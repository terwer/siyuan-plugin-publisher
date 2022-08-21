import {LiandiApi} from "./liandiApi";
import {IApi} from "../../../api";
import {CommonblogApiAdaptor} from "../commonblogApiAdaptor";
import {API_TYPE_CONSTANTS} from "../../../constants/apiTypeConstants";
import {UserBlog} from "../../../common/userBlog";
import logUtil from "../../../logUtil";
import {Post} from "../../../common/post";

/**
 * 链滴的API适配器
 */
export class LiandiApiAdaptor extends CommonblogApiAdaptor implements IApi {
    private readonly liandiApi: LiandiApi

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_LIANDI);
        this.liandiApi = new LiandiApi(this.cfg.apiUrl, this.cfg.username || "", this.cfg.token || "")
    }

    public async getUsersBlogs(): Promise<Array<UserBlog>> {
        let result: Array<UserBlog> = []

        const user = await this.liandiApi.getUser()
        logUtil.logInfo("user=>", user)

        // 数据适配
        const userblog: UserBlog = new UserBlog()
        userblog.blogid = this.apiType
        userblog.blogName = user.user.userName || this.cfg.blogName || "链滴"
        userblog.url = this.cfg.apiUrl
        result.push(userblog)

        return result;
    }


    async deletePost(postid: string): Promise<boolean> {
        throw new Error("链滴社区API不支持删除帖子")
    }

    async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        const result = await this.liandiApi.updateArticle(postid, post.title, post.description, post.mt_keywords)
        logUtil.logInfo("liandi newPost=>", result)
        return result
    }

    async newPost(post: Post, publish?: boolean): Promise<string> {
        const result = await this.liandiApi.addArticle(post.title, post.description, post.mt_keywords)
        logUtil.logInfo("liandi newPost=>", result)
        return result
    }
}