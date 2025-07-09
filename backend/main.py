from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import openai
import time

# === CONFIG ===
GROQ_API_KEY = "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"  # Replace with your Groq API key
IPQS_API_KEY = "pHUr6XdwWibP2VH68gFaMxBrjis40tbL"
openai.api_key = GROQ_API_KEY
openai.api_base = "https://api.groq.com/openai/v1"
openai.api_type = "open_ai"

IPQS_DOMAIN_URL = "https://www.ipqualityscore.com/api/json/url"

app = FastAPI()
tos_cache = {}

class AnalyzeInput(BaseModel):
    url: str
    rawTosText: str | None = None

class AskInput(BaseModel):
    url: str
    question: str

def clean_text(text: str) -> str:
    boilerplate_keywords = [
        "cookie policy", "privacy policy", "back to top", "accept all cookies",
        "all rights reserved", "©", "faq", "subscribe", "newsletter"
    ]
    lines = text.splitlines()
    cleaned_lines = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if any(kw in line.lower() for kw in boilerplate_keywords):
            continue
        cleaned_lines.append(line)

    joined = " ".join(cleaned_lines)
    joined = re.sub(r'<[^>]+>', '', joined)
    joined = re.sub(r'\s+', ' ', joined)
    return joined.strip()

def truncate_to_token_limit(text: str, max_tokens: int = 3000, token_per_word: float = 0.75) -> str:
    max_words = int(max_tokens / token_per_word)
    words = text.split()
    return ' '.join(words[:max_words]) if len(words) > max_words else text

def groq_query(prompt: str, retries: int = 3) -> str:
    for attempt in range(retries):
        try:
            response = openai.ChatCompletion.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": "You are a legal assistant that simplifies Terms of Service."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response["choices"][0]["message"]["content"].strip()

        except openai.error.RateLimitError as e:
            delay_match = re.search(r'try again in ([\d.]+)s', str(e))
            wait = float(delay_match.group(1)) if delay_match else 10.0
            print(f"[Groq Rate Limit] Waiting {wait:.2f}s before retrying...")
            time.sleep(wait)
        except Exception as e:
            print("[Groq Error]", e)
            raise HTTPException(status_code=500, detail="Groq API Error")
    raise HTTPException(status_code=429, detail="Groq Rate Limit Exceeded after retries.")

def extract_all_in_one(text: str) -> dict:
    instruction = """
You are a legal assistant helping users understand Terms of Service.

Given the TOS below, return a JSON object with:
- "summary": a plain English summary.
- "fraud": highlight suspicious or manipulative terms.
- "answer": rewrite key legal terms in user-friendly language.
- "accepted": list what kinds of personal data the service can collect, store, or share.
- "rejected": list any data the service explicitly says it will not collect, store, or share.

Return only valid JSON.

TOS:
"""
    prompt = instruction + truncate_to_token_limit(text, 3000)

    for _ in range(3):
        try:
            result = groq_query(prompt)
            return eval(result)  # You can replace with json.loads() + validation
        except Exception as e:
            print("[Unified Groq Error]", e)
            time.sleep(2)

    return {
        "summary": "Unavailable",
        "fraud": "Unavailable",
        "answer": "Unavailable",
        "accepted": [],
        "rejected": []
    }

def check_ipqs_risk(url: str) -> dict:
    try:
        domain = re.search(r"https?://([^/]+)", url).group(1)
        response = requests.get(f"{IPQS_DOMAIN_URL}/{IPQS_API_KEY}/{domain}")
        return response.json()
    except Exception as e:
        print(f"[IPQS Error] {e}")
        return {}

def scrape_tos_from_url(url: str, visited: set[str] = None) -> str:
    visited = visited or set()
    if url in visited:
        return ""
    visited.add(url)

    try:
        res = requests.get(url, timeout=5)
        soup = BeautifulSoup(res.text, "html.parser")

        candidates = []
        for tag in soup.find_all(["article", "section", "div", "p"]):
            text = tag.get_text(strip=True)
            if len(text.split()) < 200:
                continue
            if any(k in text.lower() for k in ["terms", "tos", "conditions of use"]):
                candidates.append(text)

        if candidates:
            return "\n\n".join(candidates)

        for a in soup.find_all("a", href=True):
            href = a['href'].lower()
            label = a.get_text(strip=True).lower()
            if any(k in href for k in ["terms", "tos", "conditions"]) or any(k in label for k in ["terms", "tos", "conditions"]):
                full_url = urljoin(url, a['href'])
                print(f"[Following TOS link] {full_url}")
                return scrape_tos_from_url(full_url, visited)

        return soup.get_text()
    except Exception as e:
        print(f"[Scrape Error] {e}")
        return ""

@app.post("/analyze")
def analyze(input: AnalyzeInput):
    ipqs_result = check_ipqs_risk(input.url)
    is_suspicious = ipqs_result.get("suspicious", False)
    risk_score = ipqs_result.get("risk_score", 0)

    raw_text = input.rawTosText or scrape_tos_from_url(input.url)
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Unable to extract Terms of Service from the provided URL.")

    cleaned = clean_text(raw_text)
    print(f"[Cleaned TOS] {len(cleaned.split())} words")

    if len(cleaned.split()) < 50:
        raise HTTPException(status_code=400, detail="Extracted TOS is too short to analyze.")

    tos_cache[input.url] = cleaned
    extracted = extract_all_in_one(cleaned)

    return {
        "url": input.url,
        "summary": extracted.get("summary", ""),
        "fraud": extracted.get("fraud", ""),
        "answer": extracted.get("answer", ""),
        "accepted": extracted.get("accepted", []),
        "rejected": extracted.get("rejected", []),
        "risk_score": risk_score,
        "suspicious_domain": is_suspicious
    }

@app.post("/ask")
def ask(input: AskInput):
    if input.url not in tos_cache:
        raise HTTPException(status_code=404, detail="TOS not found for this URL.")
    tos = truncate_to_token_limit(tos_cache[input.url], max_tokens=2000)
    reply = groq_query(f"TOS:\n{tos}\n\n make sure to reply very shot as possible, User's Question:\n{input.question}")
    return {"answer": reply}
