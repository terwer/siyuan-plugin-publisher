import {MetaweblogCfg} from "../metaweblog/MetaweblogCfg";
import {POSTID_KEY_CONSTANTS} from "../../constants/postidKeyConstants";

/**
 * 博客园配置类
 */
export class WordpressCfg extends MetaweblogCfg {
    constructor() {
        super("", "", "", "");
        this.posidKey = POSTID_KEY_CONSTANTS.WORDPRESS_POSTID_KEY
    }
}