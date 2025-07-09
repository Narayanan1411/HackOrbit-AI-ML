chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeTOS") {
    fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: request.url  // ✅ ONLY send URL
      })
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      chrome.runtime.sendMessage({
        action: "showResults",
        data: data
      });
    })
    .catch(err => {
      console.error("[Backend Analyze Error]", err);
    });
  }
});
