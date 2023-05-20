/**
 * HTML 处理工具类
 */
declare class HtmlUtil {
    private readonly mdUtil;
    constructor();
    /**
     * 移除标题数字
     *
     * @param str - 字符串
     */
    removeTitleNumber(str: string): string;
    /**
     * 删除挂件的HTML
     *
     * @param str - 原字符
     */
    removeWidgetTag(str: string): string;
    /**
     * 删除Markdown文本的挂件的HTML
     *
     * @param str - 原字符
     */
    removeMdWidgetTag(str: string): string;
    /**
     * 去除html标签，残缺不全也可以
     *
     * @param str - 字符串
     */
    filterHtml(str: string): string;
    /**
     * 截取指定长度html
     *
     * @param html - html
     * @param length - 长度
     * @param ignore - 不要结尾省略号
     */
    parseHtml(html: string, length: number, ignore?: boolean): string;
    /**
     * 将Markdown转换为HTML
     *
     * @param md - Markdown
     */
    mdToHtml(md: string): Promise<string>;
    /**
     * 将Markdown转换为纯文本
     *
     * @param md - Markdown
     */
    mdToPlainText(md: string): Promise<string>;
    /**
     * 移除H1标签
     *
     * @param html - html
     */
    removeH1(html: string): string;
    /**
     * 移除Markdown里面的H1标签
     *
     * JavaScript 正则表达式可以用来删除所有 Markdown 中的 h1 标签。下面是一个示例代码：
     *
     * const str = "# This is an H1\n## This is an H2\n### This is an H3";
     *
     * const regex = /^# .*$/gm;
     * const result = str.replace(regex, '');
     *
     * console.log(result);
     * 在这个例子中，我们使用正则表达式 /^# .*$/gm 来匹配所有的 h1 标签。
     * 在 JavaScript 中，^ 匹配行首，# 匹配 # 字符，.* 匹配任意字符，$ 匹配行尾，m 标记表示多行模式。
     */
    removeMdH1(md: string): string;
}
export default HtmlUtil;
