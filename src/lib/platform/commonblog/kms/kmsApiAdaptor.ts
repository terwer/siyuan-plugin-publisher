import {IApi} from "../../../api";
import {CommonblogApiAdaptor} from "../commonblogApiAdaptor";
import {Base64} from "js-base64";
import {KmsApi} from "./kmsApi";
import {API_TYPE_CONSTANTS} from "../../../constants/apiTypeConstants";
import {UserBlog} from "../../../common/userBlog";

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
}