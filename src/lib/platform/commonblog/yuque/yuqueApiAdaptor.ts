import {IApi} from "../../../api";
import {CommonblogApiAdaptor} from "../commonblogApiAdaptor";
import {YuqueApi} from "./yuqueApi";

/**
 * 语雀的API适配器
 */
export class YuqueApiAdaptor extends CommonblogApiAdaptor implements IApi {
    private readonly yuqueApi: YuqueApi

    constructor() {
        super();
        const baseUrl = ""
        const yuqueToken = ""

        this.yuqueApi = new YuqueApi(baseUrl, yuqueToken)
    }
}