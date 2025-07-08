# TOS Analyzer – Chrome Extension (UI + Scraper)

This repository contains the **frontend (UI skin)** of a Chrome Extension along with a Python-based TOS (Terms of Service) scraper and preprocessor.

🚧 **Note:** The backend API integration is in progress. This repo currently includes UI + backend scraping logic.

---

## 🔍 What It Does

This extension + scraper combo:
- Automatically detects and extracts visible and hidden TOS/policy content from websites
- Preprocesses and cleans the TOS content (removing headers, navs, scripts, etc.)
- Sends that content to backend APIs (coming soon)
- Will display results like:
  - Risk Score (via IPQualityScore)
  - Fraudulent Clause Detection
  - Data Access Evaluation
  - Concise Summarization
  - Interactive Q&A about the TOS

---

## 🗂️ Folder Structure

```
/extension-root
├── manifest.json         # Extension configuration
├── content.js            # Injected into web pages to extract content
├── popup.html            # UI layout for the popup
├── popup.js              # JS logic for API requests and rendering
├── popup.css             # Styling for popup

/scraper
└── tos_scraper.py        # Python script for TOS extraction and cleaning
```

---

## 🧪 How to Use (Development Mode)

1. Clone or download this repo.
2. Open **Chrome > Extensions** → Enable **Developer Mode**
3. Click **Load Unpacked** → select the `extension-root` directory.
4. Run `tos_scraper.py` to extract and preprocess TOS from a target URL.
5. The extension will eventually connect to backend APIs to display full results.

---

## 🔌 Backend APIs (Planned)

These APIs will be exposed via FastAPI and consumed by the extension:
- `/fraud-check`
- `/data-access`
- `/summarize`
- `/chat`
- `/ipqualityscore`

---

## 📌 Status

- ✅ UI Designed
- ✅ TOS Scraper with Preprocessing Added
- ⚙️ Backend APIs under development
- 🚀 API integration and full extension functionality coming soon

---

## 🛠️ Tech Stack

- HTML, CSS, JavaScript (Chrome Extension)
- Python (Scraper using requests + BeautifulSoup)
- FastAPI (planned backend)

---

## 📄 License

MIT License – feel free to build on top of it.
