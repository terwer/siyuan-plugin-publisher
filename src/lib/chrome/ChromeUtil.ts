/**
 * 在chrome插件打开网页
 * @param pageUrl 例如：/service/index.html
 */
export function goToPage(pageUrl: string) {
    // While we could have used `let url = "index.html"`, using runtime.getURL is a bit more robust as
    // it returns a full URL rather than just a path that Chrome needs to be resolved contextually at
    // runtime.
    // let url = chrome.runtime.getURL("index/index.html");
    let url = pageUrl;
    // @ts-ignore
    if (typeof chrome.runtime != "undefined") {
        // @ts-ignore
        url = chrome.runtime.getURL(url);
    }
    window.open(url)
    // console.log(`Created tab`);
}