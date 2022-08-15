/**
 * 链滴的API适配器
 */
import {IApi} from "../../api";
import {Post} from "../../common/post";
import {UserBlog} from "../../common/userBlog";

export class LiandiApiAdaptor implements IApi {

    constructor() {
    }

    getPost(postid: string, useSlug?: boolean): Promise<Post> {
        throw new Error("Method Not Implemented")
    }

    getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>> {
        throw new Error("Method Not Implemented")
    }

    getUsersBlogs(): Promise<Array<UserBlog>> {
        throw new Error("Method Not Implemented")
    }

    editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        throw new Error("Method Not Implemented")
    }

    newPost(post: Post, publish?: boolean): Promise<string> {
        throw new Error("Method Not Implemented")
    }
}