// Extension event listeners are a little different from the patterns you may have seen in DOM or
// Node.js APIs. The below event listener registration can be broken in to 4 distinct parts:
//
// * chrome      - the global namespace for Chrome's extension APIs
// * runtime     – the namespace of the specific API we want to use
// * onInstalled - the event we want to subscribe to
// * addListener - what we want to do with this event
//
// See https://developer.chrome.com/docs/extensions/reference/events/ for additional details.
chrome.runtime.onInstalled.addListener(async () => {
    console.log("Installed")
});

// function createPage() {
//     // While we could have used `let url = "index.html"`, using runtime.getURL is a bit more robust as
//     // it returns a full URL rather than just a path that Chrome needs to be resolved contextually at
//     // runtime.
//     let url = chrome.runtime.getURL("index.html");
//     window.open(url)
//     console.log(`Created tab`);
// }

// chrome.action.onClicked.addListener((tab) => {
//     if (!tab.url.includes("chrome://")) {
//         chrome.scripting.executeScript({
//             target: {tabId: tab.id},
//             function: createPage
//         });
//     }
// });