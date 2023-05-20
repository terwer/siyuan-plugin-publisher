import { CategoryInfo, IBlogApi, MediaObject, Post, UserBlog } from "zhi-blog-api";
import { Env } from "zhi-env";
import SiyuanConfig from "./siyuanConfig";
/**
 * 思源笔记API适配器
 *
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
declare class SiYuanApiAdaptor implements IBlogApi {
    private logger;
    private common;
    private readonly siyuanKernelApi;
    private readonly cfg;
    /**
     * 初始化思源 API 适配器
     *
     * @param cfg - 环境变量 或者 配置项
     */
    constructor(cfg: Env | SiyuanConfig);
    init(appInstance: any): void;
    deletePost(postid: string): Promise<boolean>;
    editPost(postid: string, post: Post, publish?: boolean): Promise<boolean>;
    getCategories(): Promise<CategoryInfo[]>;
    getPost(postid: string, useSlug?: boolean, skipBody?: boolean): Promise<Post>;
    getPreviewUrl(postid: string): Promise<string>;
    getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>>;
    getRecentPostsCount(keyword?: string): Promise<number>;
    getUsersBlogs(): Promise<Array<UserBlog>>;
    newMediaObject(mediaObject: MediaObject): Promise<MediaObject>;
    newPost(post: Post, publish?: boolean): Promise<string>;
}
export default SiYuanApiAdaptor;
