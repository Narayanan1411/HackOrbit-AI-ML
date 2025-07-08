chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log("Sending URL to API:", tab.url);

        fetch("api", {  // replace "api" with your real endpoint
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: tab.url
            })
        })
        .then(() => console.log("Sent successfully"))
        .catch(err => console.error("Error sending to API:", err));
    }
});
