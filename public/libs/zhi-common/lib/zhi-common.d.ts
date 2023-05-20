import JsonUtil from "./jsonUtil";
import DateUtil from "./dateUtil";
import StrUtil from "./strUtil";
import VersionUtil from "./versionUtil";
import HtmlUtil from "./htmlUtil";
import MarkdownUtil from "./markdownUtil";
import ObjectUtil from "./objectUtil";
/**
 * 平台无关的通用工具类
 *
 * @author terwer
 * @version 1.4.0
 * @since 1.3.0
 */
declare class ZhiCommon {
    readonly dateUtil: DateUtil;
    readonly strUtil: StrUtil;
    readonly versionUtil: VersionUtil;
    readonly htmlUtil: HtmlUtil;
    readonly markdownUtil: MarkdownUtil;
    readonly jsonUtil: JsonUtil;
    readonly objectUtil: ObjectUtil;
    constructor();
}
export default ZhiCommon;
