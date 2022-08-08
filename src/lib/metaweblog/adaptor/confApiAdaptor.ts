import {IApi} from "../../api";
import {MetaWeblogApiAdaptor} from "../metaWeblogApiAdaptor";
import {API_TYPE_CONSTANTS} from "../../constants/apiTypeConstants";
import MetaWeblog from "metaweblog-api";

/**
 * Confluence的API适配器
 */
export class ConfApiAdaptor extends MetaWeblogApiAdaptor implements IApi {

    constructor() {
        super();

        this.metaWeblog = new MetaWeblog(process.env.CONF_API_URL || "");
        this.username = process.env.CONF_USERNAME || ""
        this.password = process.env.CONF_PASSWORD || ""
        this.appkey = API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE
    }
}