/**
 * 在chrome插件打开网页
 */
export function createPage() {
    // While we could have used `let url = "index.html"`, using runtime.getURL is a bit more robust as
    // it returns a full URL rather than just a path that Chrome needs to be resolved contextually at
    // runtime.
    // let url = chrome.runtime.getURL("index/index.html");
    let url = "/service/index.html?pwd=123456";
    // @ts-ignore
    if (typeof chrome.runtime != "undefined") {
        // @ts-ignore
        url = chrome.runtime.getURL("/service/index.html?pwd=123456");
    }
    window.open(url)
    console.log(`Created tab`);
}