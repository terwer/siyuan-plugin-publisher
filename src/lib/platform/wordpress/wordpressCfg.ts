import {MetaweblogCfg} from "../metaweblog/MetaweblogCfg";
import {POSTID_KEY_CONSTANTS} from "../../constants/postidKeyConstants";
import {PageType} from "../metaweblog/IMetaweblogCfg";

/**
 * 博客园配置类
 */
export class WordpressCfg extends MetaweblogCfg {
    constructor() {
        super("", "", "", "");
        this.posidKey = POSTID_KEY_CONSTANTS.WORDPRESS_POSTID_KEY
        this.previewUrl = "/post/[postid].html"
        this.pageType = PageType.Html
    }
}