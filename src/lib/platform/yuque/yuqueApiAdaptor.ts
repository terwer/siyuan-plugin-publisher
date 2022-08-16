/**
 * 语雀的API适配器
 */
import {IApi} from "../../api";
import {Post} from "../../common/post";
import {UserBlog} from "../../common/userBlog";

export class YuqueApiAdaptor implements IApi {

    constructor() {
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