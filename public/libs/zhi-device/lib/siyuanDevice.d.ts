import BasePathTypeEnum from "./basePathTypeEnum";
/**
 * 思源笔记设备相关
 *
 * @public
 * @author terwer
 * @version 0.1.0
 * @since 0.1.0
 */
declare class SiyuanDevice {
    /**
     * 思源笔记iframe挂件环境
     */
    static isInSiyuanWidget: () => boolean;
    /**
     * 思源笔记新窗口
     *
     * @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
     * @author terwer
     * @version 0.1.0
     * @since 0.0.1
     */
    static isInSiyuanNewWin: () => boolean;
    /**
     * 检测是否运行在思源打开的浏览器中
     */
    static isInSiyuanBrowser(): boolean;
    /**
     * 思源笔记 window 对象
     */
    static siyuanWindow(): any;
    /**
     * 引入依赖
     *
     * @param libpath - 依赖全路径
     * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
     * @param type - 可选，以谁的基本路径为准
     */
    static requireLib: (libpath: string, abs?: boolean, type?: BasePathTypeEnum) => any;
    /**
     * 引入依赖，以 data 的基本路径为准
     *
     * @param libpath - 相对于 appearance 的相对路径
     */
    static requireAppearanceLib: (libpath: string) => any;
    /**
     * 引入依赖，以 data 的基本路径为准
     *
     * @param libpath - 相对于 data 的相对路径
     */
    static requireDataLib: (libpath: string) => any;
    /**
     * 引入依赖，以 theme 的基本路径为准
     *
     * @param libpath - 相对于 theme 的相对路径
     */
    static requireThemesLib: (libpath: string) => any;
    /**
     * 引入依赖，以 ZhiTheme 的基本路径为准
     *
     * @param libpath - 相对于 ZhiTheme 的相对路径
     */
    static requireZhiThemeLib: (libpath: string) => any;
    /**
     * 引入json
     *
     * @param jsPath - js相对路径全路径
     * @param type - 类型
     */
    static importJs(jsPath: string, type: BasePathTypeEnum): Promise<any>;
    /**
     * 引入json
     *
     * @param jsonPath - json相对路径全路径
     * @param type - 类型
     */
    /**
     * 引入 json - 以 data 为基本路径
     *
     * @param jsonPath - 相对于 data 的相对路径
     */
    /**
     * 引入 json - 以 appearance 为基本路径
     *
     * @param jsonPath - 相对于 appearance 的相对路径
     */
    /**
     * 引入 json - 以 themes 为基本路径
     *
     * @param jsonPath - 相对于 themes 的相对路径
     */
    /**
     * 引入 zhi 主题的 json - 以 zhi 主题 的根路径为基本路径
     *
     * @param jsonPath - 相对于 zhi 主题根路径的相对路径
     */
    /**
     * 引入 zhi 主题的 js - 以 zhi 主题 的根路径为基本路径
     *
     * @param jsPath - 相对于 zhi 主题根路径的相对路径
     */
    static importZhiThemeJs(jsPath: string): Promise<any>;
    /**
     * 路径拼接
     *
     * @param paths - 路径数组
     */
    static joinPath(...paths: string[]): string;
    static browserJoinPath(...paths: string[]): string;
    /**
     * 思源笔记 conf 目录
     */
    static siyuanConfPath(): any;
    /**
     * 思源笔记 data 目录
     */
    static siyuanDataPath(): any;
    /**
     * 思源笔记 data 目录-相对路径
     */
    static siyuanDataRelativePath(): string;
    /**
     * 思源笔记 appearance 目录
     */
    static siyuanAppearancePath(): string;
    /**
     * 思源笔记 appearance 目录-相对路径
     */
    static siyuanAppearanceRelativePath(): string;
    /**
     * 思源笔记 themes 目录-绝对路径
     *
     * 注意: 如果是非 electron 和 Node 环境，这里返回的是浏览器的路径，不是物理路径
     * 如果使用物理路径，请调用 siyuanAppearancePath 或者 siyuanDataPath
     *
     * @author terwer
     * @since 0.1.0
     */
    static siyuanThemePath(): string;
    /**
     * 思源笔记 themes 目录-相对路径
     */
    static siyuanThemeRelativePath(): string;
    /**
     * zhi 主题目录 - 绝对路径
     */
    static zhiThemePath(): string;
    /**
     * zhi 主题目录 - 相对路径
     */
    static zhiThemeRelativePath(): string;
}
export default SiyuanDevice;
