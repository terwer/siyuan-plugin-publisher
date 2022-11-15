// https://github.com/mdn/webextensions-examples/blob/master/page-to-extension-messaging/content-script.js
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/externally_connectable

/*
Listen for messages from the page.
If the message was from the page script, show an alert.
*/
// window.addEventListener("message", (event) => {
//     if (event.source == window &&
//         event.data &&
//         event.data.direction == "from-page-script") {
//         alert("Content script received message: \"" + event.data.message + "\"");
//     }
// });
//
// /*
// Send a message to the page script.
// */
// function messagePageScript(msg) {
//     window.postMessage({
//         direction: "from-content-script",
//         message: msg
//     });
// }
// TODO

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     switch (request.type) {
//         case 'fetchChromeXmlrpc':
//             (async () => {
//                 let resText
//                 try {
//                     const response = await fetch(request.apiUrl, request.fetchCORSParams);
//                     resText = await response.text()
//                     // console.log("chrome.runtime.onMessage.addListener fetchChromeXmlrpc response:", resText)
//                 } catch (e) {
//                     console.error("chrome.runtime fetchChromeXmlrpc request error", e)
//                 }
//                 sendResponse(resText);
//             })();
//             break;
//         case 'fetchChromeJson':
//             (async () => {
//                 let resJson
//                 try {
//                     const fetchCORSOptions = request.fetchCORSOptions
//                     const formJsonText = request.formJson
//                     // console.log("formJsonText=>", formJsonText)
//                     if (formJsonText) {
//                         const formJson = JSON.parse(formJsonText)
//                         // 将formJson转换为formData
//                         const form = new URLSearchParams();
//                         formJson.forEach(function (item) {
//                             form.append(item.key, item.value)
//                         })
//                         fetchCORSOptions.body = form
//                         // console.log("fetchCORSOptions.body=>", form)
//                     }
//                     // console.log("chrome.runtime fetchChromeJson apiUrl", request.apiUrl)
//                     // console.log("chrome.runtime fetchChromeJson reqOps", fetchCORSOptions)
//                     const response = await fetch(request.apiUrl, fetchCORSOptions);
//                     resJson = await response.json()
//                     // console.log("chrome.runtime.onMessage.addListener fetchChromeJson response:", resJson)
//                 } catch (e) {
//                     console.error("chrome.runtime fetchChromeJson request error", e)
//                 }
//                 sendResponse(resJson);
//             })();
//             break;
//         // 你可以定义任意内容，使用sendResponse()来返回它
//         case 'test':
//             sendResponse({'msg': 'test'});
//             break;
//     }
//
//     return true; // keep the messaging channel open for sendResponse
// });

