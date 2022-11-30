import {IApi} from "~/utils/api";
import {Post} from "~/utils/common/post";
import {CategoryInfo} from "~/utils/common/categoryInfo";
import {UserBlog} from "~/utils/common/userBlog";
import {getJSONConf} from "~/utils/config";
import {IGithubCfg} from "~/utils/platform/github/githubCfg";

/**
 * Github平台适配器
 */
export class GithubApiAdaptor implements IApi {
    protected readonly apiType: string
    protected readonly cfg: IGithubCfg

    constructor(apiType: string) {
        this.apiType = apiType
        this.cfg = getJSONConf<IGithubCfg>(apiType)
    }

    async deletePost(postid: string): Promise<boolean> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    async getCategories(): Promise<CategoryInfo[]> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    async getPost(postid: string, useSlug?: boolean): Promise<Post> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    async getPrevireUrl(postid: string): Promise<string> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    async getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    async getRecentPostsCount(keyword?: string): Promise<number> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    async getUsersBlogs(): Promise<Array<UserBlog>> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    async newPost(post: Post, publish?: boolean): Promise<string> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }
}