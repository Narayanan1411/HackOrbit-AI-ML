# 🛡️ TOS Analyzer – Chrome Extension (Multilingual AI TOS Inspector)

This repository contains the **Chrome Extension UI** along with a **Python-based FastAPI backend**, **scraper**, and a **pipeline** to detect, analyze, and summarize Terms of Service (TOS) content from websites using AI.

> ✅ Now supports **multilingual translation**, **chatbot Q&A**, **risk/fraud detection**, and **dynamic reanalysis** when language changes.

---

## 🔍 What It Does

This project includes a Chrome Extension + FastAPI backend that:

- 🔎 **Automatically detects and extracts** visible or linked TOS content from web pages
- 🧹 **Cleans** boilerplate and noise from TOS documents
- 🌍 **Supports multilingual summaries** (e.g. Tamil, Hindi, French, Spanish)
- 🛡️ **Performs fraud and risk detection** via IPQualityScore
- 📑 **Summarizes** and simplifies legal text using Groq's LLaMA 3 70B model
- 🧠 **Enables Q&A chatbot** for users to ask questions about the TOS
- 🔁 **Re-analyzes TOS dynamically** when language is changed via popup dropdown

---

## ❗ Problem Statement

Most users ignore or misunderstand **Terms of Service (TOS)** due to complex legal language, hidden data permissions, or embedded risks. Additionally, TOS documents often vary by region and language, leaving non-English speakers at a disadvantage.

**TOS Analyzer** addresses this by:
- 🧠 Summarizing dense legal terms using AI
- 🌍 Supporting multiple languages (e.g., Tamil, Hindi, French)
- ⚠️ Flagging risky clauses via IPQS fraud detection
- 💬 Offering a chatbot to answer user-specific questions
- 🔁 Re-analyzing when the user changes language preference

---

## 🗂 Folder Structure

```
/extension
├── manifest.json         # Chrome Extension configuration
├── background.js         # Handles message passing and backend requests
├── content.js            # Extracts TOS text from DOM automatically
├── popup.html            # Popup UI layout
├── popup.js              # JS logic for rendering, chatbot, and translation
├── popup.css             # UI styling

/backend
└── main.py               # FastAPI backend with Groq + IPQS + Translation

/model
└── fine-tuned.ipynb      # Jupyter notebook containing the fine-tuned model
```

---

## ⚙️ How to Use (Development Mode)

### 🧪 Setting up the Extension

1. **Clone or download** this repository.
2. Open **Chrome > Extensions** → Enable **Developer Mode**.
3. Click **Load Unpacked** → select the `extension` folder.
4. Navigate to any website, then open the extension to see the TOS analysis.

### 🧼 Running the Backend

1. Navigate to the `/backend` folder.
2. Install dependencies (e.g. `fastapi`, `uvicorn`, `requests`, `openai`, `googletrans==4.0.0rc1`).
3. Run the backend server:

```bash
uvicorn main:app --reload
```

---

## 🧠 Backend Features

| Endpoint     | Description                                      |
|--------------|--------------------------------------------------|
| `/analyze`   | Accepts URL + TOS text (optional) and returns:   |
|              | - summary, fraud check, accepted/rejected data   |
|              | - translated output based on selected language   |
| `/ask`       | Accepts TOS-related question and answers it via chatbot |

---

## 🚀 New Features (2025 Update)

- 🌍 **Multilingual Support** (Tamil, Hindi, French, Spanish, etc.)
- 🧠 **AI Chatbot Q&A** powered by Groq (LLaMA 3 70B)
- ⚠️ **IPQS Domain Risk Scoring** with suspicious flags
- 💾 **Caching** of raw extracted TOS per URL
- 🔁 **Dynamic Translation + Reanalysis** on language change

---

## 🛠 Tech Stack

- **Frontend**: Chrome Extension (HTML, JS)
- **Backend**: FastAPI, OpenAI (Groq API), IPQS, Google Translate
- **ML Model**: Groq LLaMA3-70B via Chat API

---
 **🎥 Demo (Pics & Video)**
📂 Google Drive Folder: https://drive.google.com/drive/folders/1M_d4_qB5IA4FlGI-1iHvGGjegBVpcuo6?usp=drive_link

---

## 📜 License

This project is licensed under the **MIT License** – feel free to fork, extend, and build upon it!

---

## 👨‍💻 Author

Made with 💡 by Sparktons

---

## 📬 Contact

For issues, suggestions, or collaborations:  
📧 naraad060@rmkcet.ac.in
