import {IApi} from "../../../api";
import {CommonblogApiAdaptor} from "../commonblogApiAdaptor";
import {Base64} from "js-base64";
import {KmsApi} from "./kmsApi";
import {API_TYPE_CONSTANTS} from "../../../constants/apiTypeConstants";
import {UserBlog} from "../../../common/userBlog";
import {Post} from "../../../common/post";
import {pathJoin} from "../../../util";

/**
 * 知识仓库的API适配器
 */
export class KmsApiAdaptor extends CommonblogApiAdaptor implements IApi {
    private readonly kmsApi: KmsApi

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_KMS);

        const kmsUsername = this.cfg.username || ""
        const kmsPassword = this.cfg.password || ""
        const basicToken = Base64.toBase64(`${kmsUsername}:${kmsPassword}`)

        this.kmsApi = new KmsApi(this.cfg.apiUrl, basicToken)
    }

    async getUsersBlogs(): Promise<Array<UserBlog>> {
        let result: Array<UserBlog> = []

        const userblog: UserBlog = new UserBlog()
        userblog.blogid = this.apiType
        userblog.blogName = "KMS"
        userblog.url = this.cfg.apiUrl
        result.push(userblog)

        return result
    }

    async deletePost(postid: string): Promise<boolean> {
        return await this.kmsApi.delDoc(postid)
    }

    async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        return await this.kmsApi.updateDoc(postid, post.title, post.description)
    }

    async newPost(post: Post, publish?: boolean): Promise<string> {
        return await this.kmsApi.addDoc(post.title, post.description)
    }

    async getPrevireUrl(postid: string): Promise<string> {
        let previewUrl

        // 替换文章链接
        const purl = this.cfg.previewUrl || ""
        const postUrl = purl.replace("[postid]", postid)
        // 路径组合
        previewUrl = pathJoin(this.cfg.home || "", postUrl)

        return previewUrl
    }
}