let currentLang = "en";

function updateUI(data) {
  const risk = document.getElementById("risk");
  const summary = document.getElementById("summary");
  const fraud = document.getElementById("fraud");
  const dataAccess = document.getElementById("data");

  risk.innerHTML = `Risk Score: <span class="${
    data.risk_score > 70 ? "score-low" : data.risk_score > 40 ? "score-medium" : "score-high"
  }">${data.risk_score}</span> (Suspicious: ${data.suspicious_domain ? "Yes" : "No"})`;

  summary.textContent = data.summary || "No summary available.";
  fraud.textContent = data.fraud || "No fraud info.";
  dataAccess.textContent =
    `Accepted: ${data.accepted?.join(", ") || "None"}\nRejected: ${data.rejected?.join(", ") || "None"}`;
}

function analyzeTOS(url, rawTosText) {
  fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, rawTosText, lang: currentLang }),
  })
    .then(res => res.json())
    .then(data => updateUI(data))
    .catch(err => {
      document.getElementById("summary").textContent = "Analyze request failed.";
      console.error("Analyze error:", err);
    });
}

function fetchDataAndRender() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;

    chrome.runtime.sendMessage({ action: "getTOSResult", url }, (data) => {
      if (!data || data.lang !== currentLang) {
        chrome.runtime.sendMessage({ action: "getRawTOS", url }, (resp) => {
          const raw = resp?.rawTosText;
          if (raw) analyzeTOS(url, raw);
        });
        return;
      }

      updateUI(data);
      setupChat(url);
    });
  });
}

function setupChat(url) {
  const input = document.getElementById("chatInput");
  const button = document.getElementById("chatSend");
  const response = document.getElementById("chatResponse");

  if (button._listenerAttached) return;
  button._listenerAttached = true;

  button.onclick = () => {
    const question = input.value.trim();
    if (!question) return;

    response.textContent = "Waiting...";
    button.disabled = true;

    fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, question, lang: currentLang }),
    })
      .then(res => res.json())
      .then(json => response.textContent = json.answer || "No answer")
      .catch(err => {
        response.textContent = "Chatbot failed to respond.";
        console.error("Chat error:", err);
      })
      .finally(() => button.disabled = false);
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") button.click();
  });
}

function setupLanguageSelector() {
  const langSelect = document.getElementById("languageSelect");

  chrome.storage.sync.get("language", (data) => {
    currentLang = data.language || "en";
    langSelect.value = currentLang;
  });

  langSelect.addEventListener("change", () => {
    currentLang = langSelect.value;
    chrome.storage.sync.set({ language: currentLang }, fetchDataAndRender);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSelector();
  fetchDataAndRender();
});
