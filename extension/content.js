function extractTOSFromPage() {
  const keywords = ["terms", "tos", "terms of service", "terms and conditions"];
  const elements = Array.from(document.querySelectorAll("body *"));
  const matches = elements
    .filter(el => keywords.some(k => el.textContent.toLowerCase().includes(k)))
    .map(el => el.textContent.trim())
    .filter(t => t.length > 200);

  return matches.length ? matches.join("\n\n") : null;
}

const tosText = extractTOSFromPage();

console.log("🔍 TOS Extracted from Page:");
console.log(tosText ? tosText.slice(0, 1000) + "..." : "No TOS found in HTML");

chrome.runtime.sendMessage({
  action: "analyzeTOS",
  url: window.location.href,
  tos: tosText
});
