import BlogPlaceholder from "./blogPlaceholder";
/**
 * 页面类型
 */
export declare enum PageType {
    /**
     * Markdown正文
     */
    Markdown = 0,
    /**
     * HTML
     */
    Html = 1,
    /**
     * 属性
     */
    Formatter = 2,
    /**
     * Markdown和属性
     */
    Markdown_And_Formatter = 3,
    /**
     * MDX
     *
     * @see {@link https://mdxjs.com/ mdx}
     */
    MDX = 4
}
/**
 * 密码类型
 */
export declare enum PasswordType {
    /**
     * 密码
     */
    PasswordType_Password = 0,
    /**
     * token
     */
    PasswordType_Token = 1
}
/**
 * 博客通用配置类
 */
declare abstract class BlogConfig {
    /**
     * 首页
     */
    protected home: string;
    /**
     * API地址
     */
    protected apiUrl: string;
    /**
     * 用户名
     */
    protected username: string;
    /**
     * 密码类型
     */
    protected passwordType: PasswordType;
    /**
     * 密码
     */
    protected password: string;
    /**
     * 是否发布
     */
    protected apiStatus: boolean;
    /**
     * 博客名（API获取）
     */
    protected blogName: string;
    /**
     * 文章别名key
     */
    protected posidKey: string;
    /**
     * 文章预览链接
     */
    protected previewUrl: string;
    /**
     * 文章类型
     */
    protected pageType: PageType;
    /**
     * 操作提示
     */
    protected placeholder: BlogPlaceholder | undefined;
    /**
     * 是否处理标题
     *
     * @protected
     */
    protected fixTitle: boolean;
    protected constructor();
}
export default BlogConfig;
