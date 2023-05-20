import UserBlog from "./userBlog";
/**
 * 站点信息定义
 */
declare class SiteConfig {
    /**
     * 博客信息
     */
    userBlog: UserBlog;
    /**
     * 域名
     */
    domain: string;
    /**
     * 站点链接
     */
    weburl: string;
    /**
     * 站点主题
     */
    webtheme: string;
    /**
     * 站点名称
     */
    webname: string;
    /**
     * 站点口号
     */
    webslogen: string;
    /**
     * 关键字
     */
    keywords: string;
    /**
     * 描述
     */
    description: string;
    /**
     * 备案信息
     */
    beianinfo: string;
    constructor();
}
export default SiteConfig;
