import UserBlog from "./models/userBlog";
import Post from "./models/post";
import MediaObject from "./models/mediaObject";
import CategoryInfo from "./models/categoryInfo";
/**
 * 通用博客接口
 *
 * @public
 * @author terwer
 * @outline deep
 * @version 1.0.0
 * @since 1.0.0
 */
interface IBlogApi {
    /**
     * 博客配置列表
     * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getUsersBlogs getUsersBlogs}
     * @returns {Promise<Array<UserBlog>>}
     */
    getUsersBlogs(): Promise<Array<UserBlog>>;
    /**
     * 最新文章数目
     *
     * @param keyword - 关键字（可选，部分平台不支持搜索）
     * @returns {Promise<number>}
     */
    getRecentPostsCount(keyword?: string): Promise<number>;
    /**
     * 最新文章
     *
     * @param numOfPosts - 文章数目
     * @param page - 页码（可选，从0开始，部分平台不支持分页）
     * @param keyword - 关键字（可选，部分平台不支持搜索）
     * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getRecentPosts getRecentPosts}
     * @returns {Promise<Array<Post>>}
     */
    getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>>;
    /**
     * 发布文章
     *
     * @param post - 文章
     * @param publish - 可选，是否发布
     *
     * ```ts
     *    const post = {
     *         description: "自动发布的测试内容",
     *         title: "自动发布的测试标题",
     *         categories: ["标签1","标签2"],
     *         // dateCreated: new Date(),
     *         // link: "",
     *         // permalink: "",
     *         // postid: "",
     *         // source: {
     *         //  name: "",
     *         //  url: ""
     *         // };
     *         // userid: ""
     *    }
     *
     *    const result = newPost(post, false)
     * ```
     * @see {@link  https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newPost newPost}
     * @returns {Promise<string>}
     */
    newPost(post: Post, publish?: boolean): Promise<string>;
    /**
     * 文章详情
     * @param postid - postid
     * @param useSlug - 是否使用的是别名（可选，部分平台不支持）
     * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getPost getPost}
     * @returns {Promise<Post>}
     */
    getPost(postid: string, useSlug?: boolean): Promise<Post>;
    /**
     * 更新文章
     *
     * @param postid - 文章id
     * @param post - 文章
     * @param publish - 可选，是否发布
     *
     * ```ts
     *     // wordpress
     *     // const postid = 4115
     *     // conf
     *     // const postid = 1540103
     *     const postid = "2490384_1"
     *     const post = {
     *         description: "修改过的自动发布的测试内容2",
     *         title: "修改过的自动发布的测试标题2",
     *         categories: ["标签1", "标签2"],
     *         // dateCreated: new Date(),
     *         // link: "",
     *         // permalink: "",
     *         // postid: postid,
     *         // source: {
     *         //  name: "",
     *         //  url: ""
     *         // };
     *         // userid: ""
     *     }
     *
     *     const result = editPost(postid, post, false)
     * ```
     * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.editPost editPost}
     * @returns {Promise<boolean>}
     */
    editPost(postid: string, post: Post, publish?: boolean): Promise<boolean>;
    /**
     * 删除文章
     *
     * @param postid - 文章ID
     * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.deletePost deletePost}
     * @returns {Promise<boolean>}
     */
    deletePost(postid: string): Promise<boolean>;
    /**
     * 获取分类列表
     *
     * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getCategories getCategories}
     * @returns {Promise<CategoryInfo[]>}
     */
    getCategories(): Promise<CategoryInfo[]>;
    /**
     * 获取预览链接
     *
     * @param postid - 文章ID
     * @returns {Promise<string>}
     */
    getPreviewUrl(postid: string): Promise<string>;
    /**
     * 上传附件
     *
     * @param mediaObject
     * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newMediaObject newMediaObject}
     * @returns {Promise<MediaObject>}
     */
    newMediaObject(mediaObject: MediaObject): Promise<MediaObject>;
}
export type { IBlogApi };
