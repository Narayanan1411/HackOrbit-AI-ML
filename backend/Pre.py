import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re

COMMON_PATHS = [
    "/terms", "/terms-of-service", "/tos",
    "/termsandconditions", "/terms_conditions",
    "/privacy-policy", "/legal", "/legal/terms"
]

KEYWORDS = ['terms', 'conditions', 'agreement', 'contract', 'services']

def extract_visible_links(base_url):
    try:
        resp = requests.get(base_url, timeout=10)
        soup = BeautifulSoup(resp.text, "html.parser")
        tos_links = []

        for a in soup.find_all('a', href=True):
            text = a.get_text(strip=True).lower()
            href = a['href'].lower()
            if any(keyword in text or keyword in href for keyword in KEYWORDS):
                full_url = urljoin(base_url, a['href'])
                tos_links.append(full_url)

        return list(set(tos_links))
    except Exception as e:
        print("HTML method error:", e)
        return []

def try_common_paths(base_url):
    found = []
    for path in COMMON_PATHS:
        test_url = urljoin(base_url, path)
        try:
            r = requests.get(test_url, timeout=5)
            if r.status_code == 200 and len(r.text) > 500:
                found.append(test_url)
        except:
            continue
    return found

def clean_html(soup):
    for tag in soup(['nav', 'footer', 'header', 'script', 'style', 'noscript', 'form']):
        tag.decompose()
    return soup

def extract_tos_text(soup):
    candidates = []

    for tag in soup.find_all(['article', 'main', 'section', 'div']):
        text = tag.get_text(separator="\n", strip=True).lower()
        if any(keyword in text for keyword in KEYWORDS) and len(text) > 500:
            candidates.append(tag)

    if not candidates:
        return soup.get_text(separator="\n", strip=True)

    best = max(candidates, key=lambda tag: len(tag.get_text()))
    return best.get_text(separator="\n", strip=True)

def extract_clean_tos(url):
    try:
        r = requests.get(url, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")
        soup = clean_html(soup)
        tos_text = extract_tos_text(soup)
        return preprocess_text(tos_text)
    except Exception as e:
        print("TOS extraction error:", e)
        return ""

def preprocess_text(text):
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'[^A-Za-z0-9.,;:\'\"()\[\]\n\-–—%&/ ]+', '', text)
    return text.strip()

def get_tos_texts(base_url):
    candidates = extract_visible_links(base_url) + try_common_paths(base_url)
    candidates = list(set(candidates))
    print(f"[+] Found {len(candidates)} candidate URLs:")

    tos_texts = []
    for url in candidates:
        print("   →", url)
        content = extract_clean_tos(url)
        if content and len(content) > 500:
            tos_texts.append((url, content))
    return tos_texts

if __name__ == "__main__":
    site = ""
    tos_results = get_tos_texts(site)

    for idx, (url, tos) in enumerate(tos_results):
        print(f"\n🔹 TOS Source {idx+1}: {url}\n{'-'*50}\n{tos[:1500]}...\n")
