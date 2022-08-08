import {IApi} from "../api";
import {API_TYPE_CONSTANTS} from "../constants/apiTypeConstants";
import {MetaWeblogApiAdaptor} from "./metaWeblogApiAdaptor";
import MetaWeblog from "metaweblog-api";

/**
 * 博客园的API适配器
 */
export class CnblogsApiAdaptor extends MetaWeblogApiAdaptor implements IApi {
    constructor() {
        super();

        this.metaWeblog = new MetaWeblog(process.env.CNBLOGS_API_URL || "");
        this.username = process.env.CNBLOGS_USERNAME || ""
        this.password = process.env.CNBLOGS_PASSWORD || ""
        this.appkey = API_TYPE_CONSTANTS.API_TYPE_CNBLOGS
    }
}