import UserBlog from "./models/userBlog";
import Post from "./models/post";
import CategoryInfo from "./models/categoryInfo";
import MediaObject from "./models/mediaObject";
import type { IBlogApi } from "./IBlogApi";
/**
 * 博客API
 *
 * @public
 * @author terwer
 * @since 1.0.0
 */
declare class BlogApi implements IBlogApi {
    private readonly logger;
    private readonly apiAdaptor;
    /**
     * 博客API版本号
     */
    readonly VERSION: string;
    /**
     * 初始化博客 API
     *
     * @param apiAdaptor - 对应博客的适配器，例如：SiYuanApiAdaptor
     */
    constructor(apiAdaptor: IBlogApi);
    /**
     * 博客配置列表
     */
    getUsersBlogs(): Promise<Array<UserBlog>>;
    /**
     * 最新文章数目
     *
     * @param keyword - 关键字（可选，部分平台不支持搜索）
     */
    getRecentPostsCount(keyword?: string): Promise<number>;
    /**
     * 最新文章
     *
     * @param numOfPosts - 文章数目
     * @param page - 页码（可选，从0开始，部分平台不支持分页）
     * @param keyword - 关键字（可选，部分平台不支持搜索）
     */
    getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>>;
    /**
     * 发布文章
     *
     * @param post - 文章
     * @param publish - 可选，是否发布
     */
    newPost(post: Post, publish?: boolean): Promise<string>;
    /**
     * 文章详情
     * @param postid - postid
     * @param useSlug - 是否使用的是别名（可选，部分平台不支持）
     */
    getPost(postid: string, useSlug?: boolean): Promise<Post>;
    /**
     * 更新文章
     *
     * @param postid - 文章id
     * @param post - 文章
     * @param publish - 可选，是否发布
     */
    editPost(postid: string, post: Post, publish?: boolean): Promise<boolean>;
    /**
     * 删除文章
     *
     * @param postid - 文章ID
     */
    deletePost(postid: string): Promise<boolean>;
    /**
     * 获取分类列表
     */
    getCategories(): Promise<CategoryInfo[]>;
    /**
     * 获取预览链接
     *
     * @param postid - 文章ID
     */
    getPreviewUrl(postid: string): Promise<string>;
    /**
     * 上传附件
     *
     * @param mediaObject
     */
    newMediaObject(mediaObject: MediaObject): Promise<MediaObject>;
}
export default BlogApi;
