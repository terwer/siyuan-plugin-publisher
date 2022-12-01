import {IApi} from "~/utils/api";
import {Post} from "~/utils/common/post";
import {CategoryInfo} from "~/utils/common/categoryInfo";
import {UserBlog} from "~/utils/common/userBlog";
import {getJSONConf} from "~/utils/config";
import {IGithubCfg} from "~/utils/platform/github/githubCfg";
import {pathJoin} from "~/utils/util";
import {Base64} from "js-base64";
import logUtil from "~/utils/logUtil";
import {GithubApi} from "~/utils/platform/github/githubApi";

/**
 * Github平台适配器
 */
export class GithubApiAdaptor implements IApi {
    protected readonly apiType: string
    protected readonly cfg: IGithubCfg
    protected readonly githubApi: GithubApi

    constructor(apiType: string) {
        this.apiType = apiType
        const cfg = getJSONConf<IGithubCfg>(apiType)
        this.cfg = cfg
        this.githubApi = new GithubApi(cfg)
    }

    async getUsersBlogs(): Promise<Array<UserBlog>> {
        let result: Array<UserBlog> = []

        const userblog: UserBlog = new UserBlog()
        userblog.blogid = this.apiType
        userblog.blogName = pathJoin(this.cfg.githubUser, "/" + this.cfg.githubRepo)
        userblog.url = pathJoin("https://github.com/" + this.cfg.githubUser, "/" + this.cfg.githubRepo)
        result.push(userblog)

        return result
    }

    async getPost(postid: string, useSlug?: boolean): Promise<Post> {
        const commonPost = new Post();

        const page = await this.githubApi.getPageData(postid)
        commonPost.postid = page.path
        commonPost.title = page.path
        commonPost.description = Base64.fromBase64(page.content)
        commonPost.link = page.path
        commonPost.permalink = page.html_url
        logUtil.logInfo("page=>", page)

        return commonPost;
    }

    async newPost(post: Post, publish?: boolean): Promise<string> {
        let res

        try {
            res = await this.githubApi.publishGithubPage(post.postid, post.description)
        } catch (e: any) {
            throw e
        }

        if (!res || !res.content || !res.content.path) {
            throw new Error("Hugo调用API异常")
        }
        return res.content.path;
    }

    async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        const res = await this.githubApi.updateGithubPage(post.postid, post.description)
        if (!res || !res.content || !res.content.path) {
            throw new Error("Hugo调用API异常")
        }
        return true;
    }

    async deletePost(postid: string): Promise<boolean> {
        const res = await this.githubApi.deleteGithubPage(postid)
        if (!res || !res.commit || !res.commit.sha) {
            throw new Error("Hugo调用API异常")
        }
        return true;
    }

    async getCategories(): Promise<CategoryInfo[]> {
        return Promise.resolve([]);
    }

    async getPreviewUrl(postid: string): Promise<string> {
        let previewUrl
        const newPostid = postid.substring(postid.lastIndexOf("/") + 1).replace(".md", "")
        previewUrl = this.cfg.previewUrl.replace("[postid]", newPostid)
        // 路径组合
        previewUrl = pathJoin(this.cfg.home || "", previewUrl)

        return previewUrl
    }

    getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>> {
        return Promise.resolve([]);
    }

    getRecentPostsCount(keyword?: string): Promise<number> {
        return Promise.resolve(0);
    }
}