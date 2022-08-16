import {MetaweblogCfg} from "../MetaweblogCfg";
import {API_TYPE_CONSTANTS} from "../../../constants/apiTypeConstants";
import {POSTID_KEY_CONSTANTS} from "../../../constants/postidKeyConstants";

/**
 * 博客园配置类
 */
export class CnblogsCfg extends MetaweblogCfg {
    constructor() {
        super("", "", "", "");
        this.posidKey = POSTID_KEY_CONSTANTS.CNBLOGS_POSTID_KEY
        this.previewUrl = "/p/[postid].html"
    }
}