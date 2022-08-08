import {IApi} from "../api";
import {MetaWeblogApiAdaptor} from "./metaWeblogApiAdaptor";
import MetaWeblog from "metaweblog-api";
import {API_TYPE_CONSTANTS} from "../constants/apiTypeConstants";

/**
 * JVue的API适配器
 */
export class JvueApiAdaptor extends MetaWeblogApiAdaptor implements IApi {
    constructor() {
        super();

        this.metaWeblog = new MetaWeblog(process.env.JVUE_API_URL || "");
        this.username = process.env.JVUE_USERNAME || ""
        this.password = process.env.JVUE_PASSWORD || ""
        this.appkey = API_TYPE_CONSTANTS.API_TYPE_JVUE
    }
}