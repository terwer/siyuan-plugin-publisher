import {IApi} from "../../api";
import {Post} from "../../common/post";
import {UserBlog} from "../../common/userBlog";
import {getJSONConf} from "../../config";
import {ICommonblogCfg} from "./commonblogCfg";

/**
 * 通用平台接口适配器
 */
export class CommonblogApiAdaptor implements IApi {
    protected cfg: ICommonblogCfg

    constructor(apiType: string) {
        this.cfg = getJSONConf<ICommonblogCfg>(apiType)
    }

    public async deletePost(postid: string): Promise<boolean> {
        throw new Error("该功能未实现，请在子类重写改方法")
    }

    public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        throw new Error("该功能未实现，请在子类重写改方法")
    }

    public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
        throw new Error("该功能未实现，请在子类重写改方法")
    }

    public async getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>> {
        throw new Error("该功能未实现，请在子类重写改方法")
    }

    public async getUsersBlogs(): Promise<Array<UserBlog>> {
        throw new Error("该功能未实现，请在子类重写改方法")
    }

    public async newPost(post: Post, publish?: boolean): Promise<string> {
        throw new Error("该功能未实现，请在子类重写改方法")
    }
}