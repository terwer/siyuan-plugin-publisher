import {IApi} from "../../../api";
import {CommonblogApiAdaptor} from "../commonblogApiAdaptor";
import {YuqueApi} from "./yuqueApi";
import {API_TYPE_CONSTANTS} from "../../../constants/apiTypeConstants";
import {UserBlog} from "../../../common/userBlog";
import logUtil from "../../../logUtil";

/**
 * 语雀的API适配器
 */
export class YuqueApiAdaptor extends CommonblogApiAdaptor implements IApi {
    private readonly yuqueApi: YuqueApi

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_YUQUE);
        this.yuqueApi = new YuqueApi(this.cfg.apiUrl, this.cfg.username || "", this.cfg.token || "")
    }

    public async getUsersBlogs(): Promise<Array<UserBlog>> {
        let result: Array<UserBlog> = []

        const repos = await this.yuqueApi.repos()
        logUtil.logInfo("repos=>", repos)

        // 数据适配
        repos.forEach((item: any) => {
            const userblog: UserBlog = new UserBlog()
            userblog.blogid = item.slug
            userblog.blogName = item.name
            userblog.url = item.namespace
            result.push(userblog)
        })

        return result
    }
}