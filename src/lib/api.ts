import {SiYuanApiAdaptor} from "./siyuan/siYuanApiAdaptor";
import {API_TYPE_CONSTANTS} from "./constants/apiTypeConstants";
import {JvueApiAdaptor} from "./metaweblog/jvueApiAdaptor";
import {ConfApiAdaptor} from "./metaweblog/confApiAdaptor";
import {CnblogsApiAdaptor} from "./metaweblog/cnblogsApiAdaptor";
import {Post} from "./common/post";
import {UserBlog} from "./common/userBlog";

export interface IApi {
    /**
     * 博客配置列表
     */
    getUsersBlogs(): Promise<Array<UserBlog>>

    /**
     * 最新文章
     * @param numOfPosts 文章数目
     * @param page 页码（可选，部分平台不支持分页）
     * @param keyword 关键字（可选，部分平台不支持搜索）
     */
    getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<any>>

    /**
     * 文章详情
     * @param postid
     * @param useSlug 是否使用的是别名（可选，部分平台不支持）
     */
    getPost(postid: string, useSlug?: boolean): Promise<any>
}

export class API implements IApi {
    type: string
    private apiAdaptor: IApi

    constructor(type: string) {
        this.type = type;
        switch (this.type) {
            case API_TYPE_CONSTANTS.API_TYPE_SIYUAN:
                this.apiAdaptor = new SiYuanApiAdaptor()
                break;
            case API_TYPE_CONSTANTS.API_TYPE_JVUE:
                this.apiAdaptor = new JvueApiAdaptor()
                break;
            case API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE:
                this.apiAdaptor = new ConfApiAdaptor()
                break;
            case API_TYPE_CONSTANTS.API_TYPE_CNBLOGS:
                this.apiAdaptor = new CnblogsApiAdaptor()
                break;
            default:
                throw new Error("未找到接口适配器，请检查参数")
        }
    }

    async getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>> {
        return this.apiAdaptor.getRecentPosts(numOfPosts, page, keyword);
    }

    async getUsersBlogs(): Promise<Array<UserBlog>> {
        return this.apiAdaptor.getUsersBlogs();
    }

    getPost(postid: string, useSlug?: boolean): Promise<Post> {
        return this.apiAdaptor.getPost(postid, useSlug);
    }
}

