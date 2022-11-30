import {MetaweblogCfg} from "../metaweblog/MetaweblogCfg";
import {POSTID_KEY_CONSTANTS} from "../../constants/postidKeyConstants";
import {PageType} from "../metaweblog/IMetaweblogCfg";

/**
 * Wordpress配置类
 */
export class WordpressCfg extends MetaweblogCfg {
    constructor() {
        super("http://localhost:8000", "http://localhost:8000/xmlrpc.php", "", "");
        this.posidKey = POSTID_KEY_CONSTANTS.WORDPRESS_POSTID_KEY
        this.previewUrl = "/?p=[postid]"
        this.pageType = PageType.Markdown
    }
}