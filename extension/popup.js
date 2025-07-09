function updateUI(data) {
  const risk = document.getElementById("risk");
  const summary = document.getElementById("summary");
  const fraud = document.getElementById("fraud");
  const dataAccess = document.getElementById("data");

  risk.innerHTML = `Risk Score: <span class="${
    data.risk_score > 70 ? "score-low" : data.risk_score > 40 ? "score-medium" : "score-high"
  }">${data.risk_score}</span> (Suspicious: ${data.suspicious_domain ? "Yes" : "No"})`;

  summary.textContent = data.summary || "No summary available.";
  fraud.textContent = data.fraud || "No fraud check info.";
  dataAccess.textContent =
    `Accepted: ${data.accepted?.join(", ") || "None"}\nRejected: ${data.rejected?.join(", ") || "None"}`;
}

function fetchDataAndRender() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;

    chrome.runtime.sendMessage({ action: "getTOSResult", url }, (data) => {
      if (!data) {
        document.getElementById("summary").textContent = "Analyzing... (please wait or reload page)";
        return;
      }
      updateUI(data);

      document.getElementById("chatSend").addEventListener("click", () => {
        const question = document.getElementById("chatInput").value.trim();
        if (!question) return;

        fetch("http://localhost:8000/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, question })
        })
          .then(res => res.json())
          .then(json => {
            document.getElementById("chatResponse").textContent = json.answer;
          })
          .catch(err => {
            document.getElementById("chatResponse").textContent = "Chatbot failed to respond.";
            console.error("Chatbot error:", err);
          });
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", fetchDataAndRender);
