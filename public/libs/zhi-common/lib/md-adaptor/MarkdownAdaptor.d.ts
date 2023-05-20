/**
 * Markdown适配器接口
 *
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
interface MarkdownAdaptor {
    /**
     * 是否可用
     */
    isAvailable(): boolean;
    /**
     * 渲染MD
     *
     * @param md - Markdown
     */
    renderMarkdownStr(md: string): Promise<string>;
}
export default MarkdownAdaptor;
