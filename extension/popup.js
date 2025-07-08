let globalUrl = "";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showResults") {
    globalUrl = request.data.url;
    const risk = request.data.risk_score;
    let riskClass = "score-high";
    if (risk > 60) riskClass = "score-medium";
    if (risk > 80) riskClass = "score-low";

    document.getElementById("risk").innerHTML = `<span class="${riskClass}">Score: ${risk}</span>`;
    document.getElementById("summary").innerText = request.data.summary;
    document.getElementById("fraud").innerText = request.data.fraud;
    document.getElementById("data").innerText = `Accepted: ${request.data.accepted.join(", ")}, Rejected: ${request.data.rejected.join(", ")}`;
  }
});

document.getElementById("chatSend").addEventListener("click", () => {
  const question = document.getElementById("chatInput").value;
  if (!question.trim()) return;

  document.getElementById("chatResponse").innerText = "Thinking...";

  fetch("https://your-backend.com/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: globalUrl, question })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("chatResponse").innerText = data.answer;
    })
    .catch(() => {
      document.getElementById("chatResponse").innerText = "Error getting answer.";
    });
});
