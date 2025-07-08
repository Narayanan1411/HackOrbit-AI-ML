# TOS Analyzer – Chrome Extension (UI Only)

This repository contains the **frontend (UI skin)** of a Chrome Extension designed to analyze and simplify website Terms of Service (TOS) and Privacy Policies using AI and ML.

🚧 **Note:** The backend and API integrations are currently under development and will be connected soon.

---

## 🔍 What It Does

This extension serves as the **visual interface** for a TOS analysis tool. It:

- Automatically detects and extracts visible policy content from visited websites
- Sends that content to backend APIs (under development)
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
```

---

## 🧪 How to Use (Development Mode)

1. Clone or download this repo.
2. Open **Chrome > Extensions** → Enable **Developer Mode**
3. Click **Load Unpacked** → select the `extension-root` directory.
4. Visit any website – the extension will attempt to extract visible policy content.

---

## 🔌 API Integration (In Progress)

The backend system (being developed in **FastAPI**) will expose endpoints such as:

- `/fraud-check`
- `/data-access`
- `/summarize`
- `/chat`
- `/ipqualityscore`

Once integrated, the extension will communicate with these endpoints to provide real-time TOS insights.

---

## 📌 Status

- ✅ UI Designed
- ⚙️ Backend APIs under development
- 🚀 API integration and full release coming soon

---

## 🛠️ Tech Stack

- HTML, CSS, JavaScript
- Chrome Extensions (Manifest V3)
- FastAPI (for backend, not in this repo)

---

## 📄 License

MIT License – feel free to build on top of it.
