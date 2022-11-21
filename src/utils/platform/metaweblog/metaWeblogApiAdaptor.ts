import {IApi} from "../../api";
import {Post} from "../../common/post";
import {UserBlog} from "../../common/userBlog";
import logUtil from "../../logUtil";
import {IMetaweblogCfg} from "./IMetaweblogCfg";
import {getJSONConf} from "../../config";
import {MetaWeblogApi} from "./metaWeblogApi";
import {CategoryInfo} from "../../common/categoryInfo";
import {CustomMetaWeblogApi} from "./CustomMetaweblogApi";
import {isInChromeExtension} from "../../browser/ChromeUtil";
import {pathJoin} from "../../util";

/**
 * 支持Metaweblog的通用API适配器
 */
export class MetaWeblogApiAdaptor implements IApi {
    private readonly cfg: IMetaweblogCfg
    protected metaWeblogApi: MetaWeblogApi
    protected username: string
    protected password: string
    protected appkey: string

    // Chrome插件扩展专用，后期也可以扩展为通用
    protected customMetaWeblogApi: CustomMetaWeblogApi

    constructor(apiType: string) {
        this.cfg = getJSONConf<IMetaweblogCfg>(apiType)

        this.metaWeblogApi = new MetaWeblogApi(apiType)
        this.username = this.cfg.username
        this.password = this.cfg.password
        this.appkey = apiType

        this.customMetaWeblogApi = new CustomMetaWeblogApi(apiType, this.cfg.apiUrl, this.cfg.username, this.cfg.password)
    }

    /**
     * getUsersBlogs
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getUsersBlogs
     */
    public async getUsersBlogs(): Promise<Array<UserBlog>> {
        let result: Array<UserBlog> = []
        if (isInChromeExtension()) {
            result = await this.customMetaWeblogApi.getUsersBlogs(this.appkey, this.username, this.password);
        } else {
            result = await this.metaWeblogApi.getUsersBlogs(this.appkey, this.username, this.password);
        }
        logUtil.logInfo("getUsersBlogs=>")
        logUtil.logInfo(result)
        return result;
    }

    /**
     * Not supported
     * @param keyword
     */
    public async getRecentPostsCount(keyword?: string): Promise<number> {
        return Promise.resolve(0);
    }

    /**
     * getRecentPosts
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getRecentPosts
     * @param numOfPosts
     */
    public async getRecentPosts(numOfPosts: number): Promise<Array<Post>> {
        let result: Array<Post> = []
        let blogPosts
        if (isInChromeExtension()) {
            blogPosts = await this.customMetaWeblogApi.getRecentPosts(this.appkey, this.username, this.password, numOfPosts);
        } else {
            blogPosts = await this.metaWeblogApi.getRecentPosts(this.appkey, this.username, this.password, numOfPosts);
        }

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
    public async getPost(postid: string): Promise<Post> {
        let data
        if (isInChromeExtension()) {
            data = await this.customMetaWeblogApi.getPost(postid, this.username, this.password)
        } else {
            data = await this.metaWeblogApi.getPost(postid, this.username, this.password)
        }
        return data;
    }

    /**
     * editPost
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.editPost
     */
    public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        let data
        if (isInChromeExtension()) {
            data = await this.customMetaWeblogApi.editPost(postid, this.username, this.password, post, publish || true)
        } else {
            data = await this.metaWeblogApi.editPost(postid, this.username, this.password, post, publish || true)
        }
        return data
    }

    /**
     * newPost
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newPost
     */
    public async newPost(post: Post, publish?: boolean): Promise<string> {
        let data
        if (isInChromeExtension()) {
            data = await this.customMetaWeblogApi.newPost(this.appkey, this.username, this.password, post, publish || true)
        } else {
            data = await this.metaWeblogApi.newPost(this.appkey, this.username, this.password, post, publish || true)
        }
        return data
    }

    /**
     * deletePost
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.deletePost
     */
    public async deletePost(postid: string): Promise<boolean> {
        let data
        if (isInChromeExtension()) {
            data = await this.customMetaWeblogApi.deletePost(this.appkey, postid, this.username, this.password, true)
        } else {
            data = await this.metaWeblogApi.deletePost(this.appkey, postid, this.username, this.password, true)
        }
        return data
    }

    /**
     * getCategories
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getCategories
     *
     * @returns {Promise<CategoryInfo[]>}
     */
    public async getCategories(): Promise<CategoryInfo[]> {
        let cats
        if (isInChromeExtension()) {
            cats = await this.customMetaWeblogApi.getCategories(this.appkey, this.username, this.password)
        } else {
            cats = await this.metaWeblogApi.getCategories(this.appkey, this.username, this.password)
        }
        logUtil.logInfo("获取分类列表=>", cats)
        return cats
    }

    public async getPrevireUrl(postid: string): Promise<string> {
        let previewUrl
        const postUrl = this.cfg.previewUrl.replace("[postid]", postid)
        previewUrl = pathJoin(this.cfg.home || "", postUrl)
        logUtil.logInfo("previewUrl", previewUrl)
        return previewUrl;
    }
}