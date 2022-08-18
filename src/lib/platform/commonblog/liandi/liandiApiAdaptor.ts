import {IApi} from "../../../api";
import {Post} from "../../../common/post";
import {UserBlog} from "../../../common/userBlog";
import {LiandiApi} from "./liandiApi";
import {config} from "./liandiConfig";

/**
 * 链滴的API适配器
 * https://ld246.com/article/1488603534762
 */
export class LiandiApiAdaptor implements IApi {

    private readonly liandiApi: LiandiApi

    constructor() {
        this.liandiApi = new LiandiApi(config.baseUrl, config.token)
    }

    public getPost(postid: string, useSlug?: boolean): Promise<Post> {
        throw new Error("Method Not Implemented")
    }

    public getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>> {
        throw new Error("Method Not Implemented")
    }

    public getUsersBlogs(): Promise<Array<UserBlog>> {
        throw new Error("Method Not Implemented")
    }

    public editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        throw new Error("Method Not Implemented")
    }

    public newPost(post: Post, publish?: boolean): Promise<string> {
        throw new Error("Method Not Implemented")
    }

    public async deletePost(postid: string): Promise<boolean> {
        return Promise.resolve(false)
    }
}