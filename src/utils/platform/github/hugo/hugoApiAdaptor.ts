import {GithubApiAdaptor} from "~/utils/platform/github/githubApiAdaptor";
import {IApi} from "~/utils/api";
import {HugoApi} from "~/utils/platform/github/hugo/hugoApi";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {Post} from "~/utils/common/post";
import {CategoryInfo} from "~/utils/common/categoryInfo";
import {UserBlog} from "~/utils/common/userBlog";
import {HugoCfg} from "~/utils/platform/github/hugo/hugoCfg";
import {pathJoin} from "~/utils/util";
import logUtil from "~/utils/logUtil";
import {Base64} from "js-base64";

/**
 * Hugo的Api适配器
 */
export class HugoApiAdaptor extends GithubApiAdaptor implements IApi {
    private readonly hugoApi: HugoApi

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_HUGO);
        const hugoCfg = new HugoCfg()
        hugoCfg.githubUser = this.cfg.githubUser
        hugoCfg.githubRepo = this.cfg.githubRepo
        hugoCfg.githubToken = this.cfg.githubToken
        this.hugoApi = new HugoApi(hugoCfg)
    }

    async getUsersBlogs(): Promise<Array<UserBlog>> {
        let result: Array<UserBlog> = []

        const userblog: UserBlog = new UserBlog()
        userblog.blogid = API_TYPE_CONSTANTS.API_TYPE_HUGO
        userblog.blogName = pathJoin(this.hugoApi.hugoCfg.githubUser, "/" + this.hugoApi.hugoCfg.githubRepo)
        userblog.url = pathJoin("https://github.com/" + this.hugoApi.hugoCfg.githubUser, "/" + this.hugoApi.hugoCfg.githubRepo)
        result.push(userblog)

        return result
    }

    async getPost(postid: string, useSlug?: boolean): Promise<Post> {
        const commonPost = new Post();

        const page = await this.hugoApi.getPageData(postid)
        commonPost.postid = page.path
        commonPost.title = page.path
        commonPost.description = Base64.fromBase64(page.content)
        commonPost.link = page.path
        commonPost.permalink = page.html_url
        logUtil.logInfo("page=>", page)

        return commonPost;
    }

    async newPost(post: Post, publish?: boolean): Promise<string> {
        const res = await this.hugoApi.publishGithubPage(post.postid, post.description)
        if (!res || !res.content || !res.content.path) {
            throw new Error("Hugo调用API异常")
        }
        return res.content.path;
    }

    async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        const res = await this.hugoApi.updateGithubPage(post.postid, post.description)
        if (!res || !res.content || !res.content.path) {
            throw new Error("Hugo调用API异常")
        }
        return true;
    }

    async deletePost(postid: string): Promise<boolean> {
        const res = await this.hugoApi.deleteGithubPage(postid)
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
}