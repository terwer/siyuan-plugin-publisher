import {MetaweblogCfg} from "../MetaweblogCfg";
import {POSTID_KEY_CONSTANTS} from "../../../constants/postidKeyConstants";
import {PageType} from "../IMetaweblogCfg";

/**
 * JVue配置类
 */
export class JVueCfg extends MetaweblogCfg {
    constructor() {
        super("https://[your-jvue-site]", "https://[your-jvue-site]/xmlrpc", "", "");
        this.posidKey = POSTID_KEY_CONSTANTS.JVUE_POSTID_KEY
        this.previewUrl = "/post/[postid].html"
        this.pageType = PageType.Markdown
    }
}