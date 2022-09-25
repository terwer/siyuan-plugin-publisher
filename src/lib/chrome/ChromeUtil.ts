/**
 * 在chrome插件打开网页
 *
 * 注意：非chrome环境，pageUrl：/index.html，split：/，实际url为：//index.html
 * @param pageUrl 例如：/index.html
 * @param splt 例如：/，但部分情况下无需传递此参数
 *
 */
export function goToPage(pageUrl: string, split?: string) {
    // While we could have used `let url = "index.html"`, using runtime.getURL is a bit more robust as
    // it returns a full URL rather than just a path that Chrome needs to be resolved contextually at
    // runtime.
    // let url = chrome.runtime.getURL("index/index.html");
    let url = pageUrl;
    // @ts-ignore
    if (typeof chrome.runtime != "undefined") {
        // @ts-ignore
        url = chrome.runtime.getURL(url);
    } else {
        if (split && split != "") {
            url = window.location.protocol + "//" + window.location.host + split + url;
        } else {
            url = window.location.protocol + "//" + window.location.host + url;
        }
    }
    window.open(url)
    // console.log(`Created tab`);
}

/**
 * 检测是否运行在Chrome插件中
 */
export function isInChromeExtension() {
    // @ts-ignore
    return typeof chrome.runtime != "undefined";
}

/**
 * 向Chrome发送消息
 * @param message 消息
 */
export function sendChromeMessage(message: any) {
    return new Promise((resolve) => {
        // @ts-ignore
        chrome.runtime.sendMessage(message, resolve)
    })
}