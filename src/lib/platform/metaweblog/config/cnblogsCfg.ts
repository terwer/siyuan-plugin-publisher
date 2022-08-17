import {MetaweblogCfg} from "../MetaweblogCfg";
import {POSTID_KEY_CONSTANTS} from "../../../constants/postidKeyConstants";
import {PageType} from "../IMetaweblogCfg";

/**
 * 博客园配置类
 */
export class CnblogsCfg extends MetaweblogCfg {
    constructor() {
        super("https://www.cnblogs.com/[yourblog]", "https://rpc.cnblogs.com/metaweblog/[yourblog]", "", "");
        this.posidKey = POSTID_KEY_CONSTANTS.CNBLOGS_POSTID_KEY
        this.previewUrl = "/p/[postid].html"
        this.pageType = PageType.Markdown
    }
}