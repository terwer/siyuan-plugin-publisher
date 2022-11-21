import {IApi} from "../../api";
import {Post} from "../../common/post";
import {UserBlog} from "../../common/userBlog";
import {getJSONConf} from "../../config";
import {ICommonblogCfg} from "./commonblogCfg";
import {CategoryInfo} from "../../common/categoryInfo";

/**
 * 通用平台接口适配器
 */
export class CommonblogApiAdaptor implements IApi {
    protected readonly apiType: string
    protected readonly cfg: ICommonblogCfg

    constructor(apiType: string) {
        this.apiType = apiType
        this.cfg = getJSONConf<ICommonblogCfg>(apiType)
    }

    public async deletePost(postid: string): Promise<boolean> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    public async getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    public async getUsersBlogs(): Promise<Array<UserBlog>> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    public async newPost(post: Post, publish?: boolean): Promise<string> {
        throw new Error("该功能未实现，请在子类重写该方法")
    }

    public async getCategories(): Promise<CategoryInfo[]> {
        return Promise.resolve([]);
    }

    /**
     * Not supported
     * @param keyword
     */
    public async getRecentPostsCount(keyword?: string): Promise<number> {
        return Promise.resolve(0);
    }

    public async getPrevireUrl(postid: string): Promise<string> {
        return Promise.resolve("");
    }
}