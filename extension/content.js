function extractTOSFromDOM() {
  const tags = document.querySelectorAll("article, section, div, p");
  let bestMatch = "";
  let maxScore = 0;

  for (let tag of tags) {
    const text = tag.innerText.trim();
    const lower = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;
    if (wordCount < 100) continue;

    let score = 0;
    if (lower.includes("terms of service")) score += 3;
    if (lower.includes("terms and conditions")) score += 2;
    if (lower.includes("use of service") || lower.includes("your responsibilities")) score += 1;
    score += wordCount / 100;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = text;
    }
  }

  return bestMatch || null;
}

function triggerAnalysis() {
  const tosText = extractTOSFromDOM();
  const url = window.location.href;

  chrome.storage.sync.get("language", (data) => {
    const lang = data.language || "en";
    chrome.runtime.sendMessage({
      action: "analyzeTOS",
      url,
      lang,
      rawTosText: tosText,
    });
  });
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  triggerAnalysis();
} else {
  document.addEventListener("DOMContentLoaded", triggerAnalysis);
}
