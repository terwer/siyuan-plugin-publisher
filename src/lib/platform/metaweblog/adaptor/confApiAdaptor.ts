import {IApi} from "../../../api";
import {MetaWeblogApiAdaptor} from "../metaWeblogApiAdaptor";
import {API_TYPE_CONSTANTS} from "../../../constants/apiTypeConstants";

/**
 * Confluence的API适配器
 */
export class ConfApiAdaptor extends MetaWeblogApiAdaptor implements IApi {
    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE);
    }
}