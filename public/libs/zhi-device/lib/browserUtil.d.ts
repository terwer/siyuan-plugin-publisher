/**
 * 浏览器工具类
 *
 * @public
 * @author terwer
 * @since 1.0.2
 */
declare class BrowserUtil {
    /**
     * 是否在浏览器环境
     */
    static isNode: boolean;
    /**
     * 是否在浏览器环境
     */
    static isInBrowser: boolean;
    /**
     * 浏览器路径分隔符
     */
    static BrowserSeperator: string;
    /**
     * 是否是Electron环境
     */
    static isElectron: () => boolean;
    /**
     * 是否有Node环境，目前包括 Electron 和 Node
     */
    static hasNodeEnv: () => boolean;
    /**
     * 检测是否运行在Chrome插件中
     */
    static isInChromeExtension(): boolean;
    /**
     * 获取url参数
     *
     * @param sParam - 参数
     */
    static getQueryString: (sParam: string) => string;
    /**
     * 替换 URL 的参数
     * 思路：
     * 1. 使用了 URLSearchParams 对象来解析和构建 URL 查询参数。
     *
     * 2. 在处理包含 hash 片段的 URL 时使用了 split 函数将 URL 分成两部分：基本 URL 和 hash 片段。
     *
     * 3. 然后，再次使用 split 函数将基本 URL 分成两部分：路径和查询参数。
     *
     * 4. 将查询参数转换为 URLSearchParams 对象，然后设置指定的参数名和值。
     *
     * 5. 最后，使用 toString 函数将查询参数转换为字符串，并将其与路径组合成新的基本 URL。如果 URL 包含 hash 片段，则将其添加到新的基本 URL 中。
     *
     * @param url - 链接地址
     * @param paramName - 参数名
     * @param paramValue - 参数值
     */
    static replaceUrlParam: (url: string, paramName: string, paramValue: string) => string;
    /**
     * 设置url参数
     *
     * @param urlstring - url
     * @param key - key
     * @param value - value
     */
    static setUrlParameter: (urlstring: string, key: string, value: string) => string;
    /**
     * 重新加载指定tab
     *
     * @param tabname - tabname
     * @param t - 延迟时间
     */
    static reloadTabPage: (tabname: string, t?: number) => void;
    /**
     * 刷新当前tab页面
     */
    static reloadPage: () => void;
    /**
     * 刷新当前tab页面
     *
     * @param msg - 消息提示
     * @param cb - 回调
     */
    static reloadPageWithMessageCallback: (msg: string, cb: any) => void;
}
export default BrowserUtil;
