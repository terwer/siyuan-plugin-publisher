import {IApi} from "../../../api";
import {API_TYPE_CONSTANTS} from "../../../constants/apiTypeConstants";
import {MetaWeblogApiAdaptor} from "../metaWeblogApiAdaptor";

/**
 * 博客园的API适配器
 */
export class CnblogsApiAdaptor extends MetaWeblogApiAdaptor implements IApi {
    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_CNBLOGS);
    }
}