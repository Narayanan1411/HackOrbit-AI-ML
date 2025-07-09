let tosDataCache = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeTOS") {
    const payload = {
      url: request.url,
      lang: request.lang || "en",
    };

    if (typeof request.rawTosText === "string" && request.rawTosText.trim().length > 50) {
      payload.rawTosText = request.rawTosText.trim();
      tosDataCache[request.url] = {
        ...tosDataCache[request.url],
        rawTosText: payload.rawTosText,
      };
    }

    fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Backend responded with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        tosDataCache[request.url] = {
          ...tosDataCache[request.url],
          ...data,
          lang: payload.lang,
        };
        sendResponse({ success: true });
      })
      .catch((err) => {
        console.error("[TOS Analyzer] Backend error:", err);
        sendResponse({ success: false, error: err.message });
      });

    return true;
  }

  if (request.action === "getTOSResult") {
    sendResponse(tosDataCache[request.url] || null);
    return true;
  }

  if (request.action === "getRawTOS") {
    sendResponse({ rawTosText: tosDataCache[request.url]?.rawTosText || null });
    return true;
  }
});
