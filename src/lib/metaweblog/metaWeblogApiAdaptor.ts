import {IApi} from "../api";
import {Post} from "../common/post";
import {UserBlog} from "../common/userBlog";

/**
 * 博客园的API适配器
 */
export class MetaWeblogApiAdaptor implements IApi {
    protected metaWeblog: any
    protected username: string
    protected password: string
    protected appkey: string

    constructor() {
        this.metaWeblog = null;
        this.username = ""
        this.password = ""
        this.appkey = ""
    }

    /**
     * getUsersBlogs
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getUsersBlogs
     *
     */
    public async getUsersBlogs(): Promise<Array<UserBlog>> {
        let result: Array<UserBlog> = []
        const data = await this.metaWeblog.getUsersBlogs(this.appkey, this.username, this.password);
        // TODO

        return result;
    }

    /**
     * getRecentPosts
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getRecentPosts
     * @param numOfPosts
     */
    public async getRecentPosts(numOfPosts: number): Promise<Array<any>> {
        let result: Array<Post> = []
        const blogPosts = await this.metaWeblog.getRecentPosts(this.appkey, this.username, this.password, numOfPosts);
        for (let i = 0; i < blogPosts.length; i++) {
            const blogPost = blogPosts[i]

            // 适配公共属性
            let commonPost = new Post()
            commonPost.postid = blogPost.postid
            commonPost.title = blogPost.title
            commonPost.mt_keywords = blogPost.mt_keywords
            commonPost.permalink = blogPost.permalink
            commonPost.description = blogPost.description
            commonPost.wp_slug = blogPost.wp_slug
            commonPost.dateCreated = blogPost.dateCreated
            commonPost.categories = blogPost.categories
            result.push(commonPost)
        }

        return result;
    }

    /**
     * getPost
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getPost
     *
     */
    public async getPost(postid: string): Promise<any> {
        const data = await this.metaWeblog.getPost(postid, this.username, this.password)
        return data;
    }
}