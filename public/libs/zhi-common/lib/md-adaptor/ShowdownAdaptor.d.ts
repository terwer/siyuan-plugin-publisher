import MarkdownAdaptor from "./MarkdownAdaptor";
/**
 * showdown 适配器
 *
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
declare class ShowdownAdaptor implements MarkdownAdaptor {
    private readonly logger;
    private readonly converter;
    constructor();
    isAvailable(): boolean;
    renderMarkdownStr(md: string): Promise<string>;
}
export default ShowdownAdaptor;
