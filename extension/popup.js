let globalUrl = "";

// Receive data from background and update popup UI
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showResults") {
    const data = request.data;
    globalUrl = data.url;

    const risk = data.risk_score ?? 0;
    let riskClass = "score-high";
    if (risk > 60) riskClass = "score-medium";
    if (risk > 80) riskClass = "score-low";

    document.getElementById("risk").innerHTML = `<span class="${riskClass}">Score: ${risk}</span>`;
    document.getElementById("summary").innerText = data.summary || "No summary found.";
    document.getElementById("fraud").innerText = data.fraud || "No fraud analysis.";
    document.getElementById("data").innerText =
      `Accepted: ${data.accepted?.join(", ") || "None"}, Rejected: ${data.rejected?.join(", ") || "None"}`;
  }
});

// Handle chatbot interaction
document.getElementById("chatSend").addEventListener("click", () => {
  const question = document.getElementById("chatInput").value.trim();
  if (!question) return;

  document.getElementById("chatResponse").innerText = "Thinking...";

  fetch("http://localhost:8000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: globalUrl, question })
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    document.getElementById("chatResponse").innerText = data.answer || "No answer found.";
  })
  .catch(err => {
    console.error("[Chat Error]", err);
    document.getElementById("chatResponse").innerText = "Error getting answer.";
  });
});
