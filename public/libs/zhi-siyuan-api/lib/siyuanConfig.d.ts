import { BlogConfig } from "zhi-blog-api";
import SiyuanPlaceholder from "./siyuanPlaceholder";
/**
 * 思源笔记配置
 *
 * @author terwer
 * @since 1.0.0
 */
declare class SiyuanConfig extends BlogConfig {
    /**
     * 思源笔记伺服地址
     */
    apiUrl: string;
    /**
     * 思源笔记 API token
     */
    password: string;
    /**
     * 思源笔记操作提示
     *
     * @protected
     */
    placeholder: SiyuanPlaceholder;
    /**
     * 是否修复标题
     *
     * @protected
     */
    fixTitle: boolean;
    constructor(apiUrl?: string, password?: string);
}
export default SiyuanConfig;
