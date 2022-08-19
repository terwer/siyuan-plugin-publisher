import {IApi} from "../../api";
import {Post} from "../../common/post";
import {UserBlog} from "../../common/userBlog";

/**
 * 通用平台接口适配器
 */
export class CommonblogApiAdaptor implements IApi {
    deletePost(postid: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        return Promise.resolve(false);
    }

    getPost(postid: string, useSlug?: boolean): Promise<Post> {
        return Promise.resolve(new Post());
    }

    getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>> {
        return Promise.resolve([]);
    }

    getUsersBlogs(): Promise<Array<UserBlog>> {
        return Promise.resolve([]);
    }

    newPost(post: Post, publish?: boolean): Promise<string> {
        return Promise.resolve("");
    }
}