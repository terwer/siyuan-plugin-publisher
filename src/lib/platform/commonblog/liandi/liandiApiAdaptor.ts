import {LiandiApi} from "./liandiApi";
import {IApi} from "../../../api";
import {CommonblogApiAdaptor} from "../commonblogApiAdaptor";
import {ICommonblogCfg} from "../commonblogCfg";
import {getJSONConf} from "../../../config";
import {API_TYPE_CONSTANTS} from "../../../constants/apiTypeConstants";
import {UserBlog} from "../../../common/userBlog";
import logUtil from "../../../logUtil";

/**
 * 链滴的API适配器
 */
export class LiandiApiAdaptor extends CommonblogApiAdaptor implements IApi {
    private readonly liandiApi: LiandiApi

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_LIANDI);
        this.liandiApi = new LiandiApi(this.cfg.apiUrl, this.cfg.token || "")
    }

    public async getUsersBlogs(): Promise<Array<UserBlog>> {
        const user = await this.liandiApi.getUser()
        logUtil.logInfo("user=>", user)
        return super.getUsersBlogs();
    }
}