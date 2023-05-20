/**
 * 配置提示
 *
 * @author terwer
 * @since 1.0.0
 */
declare abstract class BlogPlaceholder {
    /**
     * 首页操作提示
     */
    protected homePlaceholder: string;
    /**
     * API 地址操作提示
     */
    protected apiUrlPlaceholder: string;
    /**
     * 用户名操作提示
     */
    protected usernamePlaceholder: string;
    /**
     * 密码类型操作提示
     */
    protected passwordTypePlaceholder: string;
    /**
     * 密码操作提示
     */
    protected passwordPlaceholder: string;
    /**
     * API状态是否正常操作提示
     */
    protected apiStatusPlaceholder: boolean;
    /**
     * 博客名（API获取）操作提示
     */
    protected blogNamePlaceholder: string;
    /**
     * 文章别名key操作提示
     */
    protected posidKeyPlaceholder: string;
    /**
     * 文章预览链接操作提示
     */
    protected previewUrlPlaceholder: string;
    /**
     * 文章类型操作提示
     */
    protected pageTypePlaceholder: string;
    constructor();
}
export default BlogPlaceholder;
