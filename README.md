# 🛡️ TOS Analyzer – Chrome Extension (UI + Scraper + Pipeline)

This repository contains the **Chrome Extension UI** along with a **Python-based TOS scraper**, **preprocessing logic**, and an **injected pipeline** to detect and analyze Terms of Service (TOS) and Privacy Policy content from websites.

> ✅ Extension now works end-to-end with visible scraping pipeline injected! Backend APIs are in progress.

---

## 🔍 What It Does

This extension + scraper pipeline:

- 🧠 Automatically **detects** and **extracts** TOS/Policy content (both visible and hidden)
- 🧹 **Cleans** the extracted content by removing navigation, headers, footers, and scripts
- 🛰️ **Injects a pipeline** that prepares the content for backend processing
- 🚧 (Upcoming) **Sends cleaned TOS content** to backend APIs for:
  - Risk scoring via IPQualityScore
  - Fraudulent clause detection
  - Data access evaluation
  - Summarization
  - Interactive Q&A

---

## 🗂 Folder Structure

```
/extension
├── manifest.json         # Chrome Extension configuration
├── content.js            # Injected script for scraping visible/hidden content
├── popup.html            # Popup UI layout
├── popup.js              # JS logic to handle extension interactions
├── popup.css             # UI styling for popup

/backend
└── main.py               # Python backend script for TOS scraping, cleaning, and serving

/model
└── fine-tuned.ipynb      # Jupyter notebook containing the fine-tuned model
```

---

## ⚙️ How to Use (Development Mode)

### 🧪 Setting up the Extension

1. **Clone or download** this repository.
2. Open **Chrome > Extensions** → Enable **Developer Mode**.
3. Click **Load Unpacked** → select the `extension` folder.
4. Use the extension popup to trigger content extraction on any active webpage.

### 🧼 Running the Backend

1. Navigate to the `/backend` folder.
2. Run the backend server (FastAPI recommended for full integration):

```bash
python main.py
```

### 🔬 (Optional) Exploring the Fine-Tuned Model

Navigate to `/model/fine-tuned.ipynb` to view or run the fine-tuned model used for TOS analysis.

---

## 🔌 Backend APIs (Coming Soon)

The following API endpoints will be integrated into the extension via a FastAPI backend:

| Endpoint         | Purpose                                |
|------------------|----------------------------------------|
| `/fraud-check`   | Detects suspicious or fraudulent clauses |
| `/data-access`   | Evaluates what personal data is accessed |
| `/summarize`     | Generates a concise summary of the TOS |
| `/chat`          | Enables interactive Q&A about the TOS |
| `/ipqualityscore`| Integrates external reputation scoring |

---

## 🚦 Status

| Feature                            | Status     |
|------------------------------------|------------|
| UI Design                          | ✅ Complete |
| Chrome Extension Injection         | ✅ Complete |
| TOS Scraping (Visible + Hidden)    | ✅ Complete |
| Preprocessing & Cleaning Pipeline  | ✅ Complete |
| Backend API Design                 | ⚙ In Progress |
| API Integration into Extension     | 🔜 Coming Soon |

---

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Chrome Extension)
- **Scraping & Cleaning**: Python, `requests`, `BeautifulSoup`
- **Backend (Planned)**: FastAPI (Python)
- **Risk Evaluation**: IPQualityScore API
- **Model Training**: Jupyter Notebook (fine-tuned)

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
