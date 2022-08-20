import {IApi} from "../../../api";
import {CommonblogApiAdaptor} from "../commonblogApiAdaptor";
import {YuqueApi} from "./yuqueApi";
import {API_TYPE_CONSTANTS} from "../../../constants/apiTypeConstants";

/**
 * 语雀的API适配器
 */
export class YuqueApiAdaptor extends CommonblogApiAdaptor implements IApi {
    private readonly yuqueApi: YuqueApi

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_YUQUE);
        this.yuqueApi = new YuqueApi(this.cfg.apiUrl, this.cfg.token || "")
    }
}