/**
 * Markdown 处理工具类
 *
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
declare class MarkdownUtil {
    private readonly logger;
    private mdAdaptor;
    constructor();
    /**
     * 获取当前 MD 解析器名称
     */
    private getCurrentAdaptorName;
    /**
     * 渲染Markdown
     *
     * @param md - Markdown文本
     */
    renderHTML(md: string): Promise<string>;
}
export default MarkdownUtil;
