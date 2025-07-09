let tosDataCache = {};

// Handle incoming messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeTOS") {
    const payload = { url: request.url };

    if (typeof request.rawTosText === "string" && request.rawTosText.trim().length > 50) {
      payload.rawTosText = request.rawTosText.trim();
    }

    fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error(`Backend responded with status ${res.status}`);
        return res.json();
      })
      .then(data => {
        tosDataCache[request.url] = data;
        sendResponse({ success: true });
      })
      .catch(err => {
        console.error("[TOS Analyzer] Error from backend:", err);
        sendResponse({ success: false, error: err.message });
      });

    return true; // Keep message channel open for sendResponse
  }

  if (request.action === "getTOSResult") {
    const result = tosDataCache[request.url] || null;
    sendResponse(result);
    return true;
  }
});
