chrome.runtime.sendMessage({
  action: "analyzeTOS",
  url: window.location.href
});
