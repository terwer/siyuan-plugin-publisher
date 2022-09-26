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
    console.log("Chrome Extension Installed")
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case 'fetchChromeXmlrpc':
            (async () => {
                let resText
                try {
                    const response = await fetch(request.apiUrl, request.fetchCORSParams);
                    resText = await response.text()
                    // console.log("chrome.runtime.onMessage.addListener fetchChromeXmlrpc response:", resText)
                } catch (e) {
                    console.error("chrome.runtime fetchChromeXmlrpc request error", e)
                }
                sendResponse(resText);
            })();
            break;
        case 'fetchChromeJson':
            (async () => {
                let resJson
                try {
                    const response = await fetch(request.apiUrl, request.fetchCORSOptions);
                    resJson = await response.json()
                    // console.log("chrome.runtime.onMessage.addListener fetchChromeJson response:", resJson)
                } catch (e) {
                    console.error("chrome.runtime fetchChromeJson request error", e)
                }
                sendResponse(resJson);
            })();
            break;
        // 你可以定义任意内容，使用sendResponse()来返回它
        case 'test':
            sendResponse({'msg': 'test'});
            break;
    }

    return true; // keep the messaging channel open for sendResponse
});

