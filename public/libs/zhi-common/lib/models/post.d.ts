import PostStatusEnum from "../enums/postStatusEnum";
/**
 * 通用文章模型定义
 *
 * @public
 */
declare class Post {
    /**
     * 文章ID
     */
    postid: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 逗号分隔的标签
     */
    mt_keywords: string;
    /**
     * 链接
     */
    link?: string;
    /**
     * 永久链接
     */
    permalink: string;
    /**
     * 摘要
     */
    shortDesc?: string;
    /**
     * 描述
     */
    description: string;
    /**
     * 短评
     */
    mt_excerpt?: string;
    /**
     * 别名
     */
    wp_slug: string;
    /**
     * 创建时间
     */
    dateCreated: Date;
    /**
     * 分类
     */
    categories: Array<string>;
    /**
     * 更多
     */
    mt_text_more?: string;
    /**
     * 发布状态
     */
    post_status?: PostStatusEnum;
    /**
     * 是否发布
     */
    isPublished: boolean;
    /**
     * 发布密码
     */
    wp_password: string;
    constructor();
}
export default Post;
