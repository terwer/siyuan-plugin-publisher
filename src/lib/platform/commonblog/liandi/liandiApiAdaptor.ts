import {Post} from "../../../common/post";
import {UserBlog} from "../../../common/userBlog";
import {LiandiApi} from "./liandiApi";
import {config} from "./liandiCfg";
import {IApi} from "../../../api";
import {CommonblogApiAdaptor} from "../commonblogApiAdaptor";

/**
 * 链滴的API适配器
 */
export class LiandiApiAdaptor extends CommonblogApiAdaptor implements IApi {

    private readonly liandiApi: LiandiApi

    constructor() {
        super();
        this.liandiApi = new LiandiApi(config.baseUrl, config.token)
    }
}