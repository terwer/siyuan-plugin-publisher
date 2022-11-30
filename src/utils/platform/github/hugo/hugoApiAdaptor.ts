import {GithubApiAdaptor} from "~/utils/platform/github/githubApiAdaptor";
import {IApi} from "~/utils/api";
import {HugoApi} from "~/utils/platform/github/hugo/hugoApi";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {Post} from "~/utils/common/post";
import {CategoryInfo} from "~/utils/common/categoryInfo";
import {UserBlog} from "~/utils/common/userBlog";
import {HugoCfg} from "~/utils/platform/github/hugo/hugoCfg";
import {pathJoin} from "~/utils/util";

/**
 * Hugo的Api适配器
 */
export class HugoApiAdaptor extends GithubApiAdaptor implements IApi {
    private readonly hugoApi: HugoApi

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_HUGO);
        const hugoCfg = new HugoCfg(this.cfg.githubUser, this.cfg.githubRepo, this.cfg.githubToken)
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

    async deletePost(postid: string): Promise<boolean> {
        return super.deletePost(postid);
    }

    async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        return super.editPost(postid, post, publish);
    }

    async getCategories(): Promise<CategoryInfo[]> {
        return super.getCategories();
    }

    async getPost(postid: string, useSlug?: boolean): Promise<Post> {
        return super.getPost(postid, useSlug);
    }

    async getPrevireUrl(postid: string): Promise<string> {
        return super.getPrevireUrl(postid);
    }

    async getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>> {
        return super.getRecentPosts(numOfPosts, page, keyword);
    }

    async getRecentPostsCount(keyword?: string): Promise<number> {
        return super.getRecentPostsCount(keyword);
    }

    async newPost(post: Post, publish?: boolean): Promise<string> {
        return super.newPost(post, publish);
    }
}