/**
 * 博客信息定义
 *
 * @public
 */
declare class UserBlog {
    /**
     * 博客ID
     */
    blogid: string;
    /**
     * 博客地址
     */
    url: string;
    /**
     * 博客名称
     */
    blogName: string;
    /**
     * 是否是管理员
     */
    isAdmin?: boolean;
    /**
     * xmlrpc地址
     */
    xmlrpc?: string;
    constructor();
}
export default UserBlog;
