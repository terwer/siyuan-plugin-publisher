import {MetaweblogCfg} from "../MetaweblogCfg";
import {POSTID_KEY_CONSTANTS} from "../../../constants/postidKeyConstants";
import {PageType} from "../IMetaweblogCfg";

/**
 * Confluence配置类
 */
export class ConfCfg extends MetaweblogCfg {
    constructor() {
        super("https://youweics.atlassian.net/wiki/spaces/[spaceKey]", "http://localhost:3000/api/xmlrpc", "", "");
        this.posidKey = POSTID_KEY_CONSTANTS.CONFLUENCE_POSTID_KEY
        this.previewUrl = "pages/[postid]"
        this.pageType = PageType.Html
    }
}