chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeTOS") {
    fetch("https://your-backend.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: request.url,
        rawTosText: request.tos
      })
    })
    .then(res => res.json())
    .then(data => {
      chrome.runtime.sendMessage({
        action: "showResults",
        data: data
      });
    });
  }
});
