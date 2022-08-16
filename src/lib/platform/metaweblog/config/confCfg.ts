import {MetaweblogCfg} from "../MetaweblogCfg";
import {POSTID_KEY_CONSTANTS} from "../../../constants/postidKeyConstants";

/**
 * Confluence配置类
 */
export class ConfCfg extends MetaweblogCfg {
    constructor() {
        super("", "", "", "");
        this.posidKey = POSTID_KEY_CONSTANTS.CONFLUENCE_POSTID_KEY
        this.previewUrl = "/post/[postid].html"
    }
}