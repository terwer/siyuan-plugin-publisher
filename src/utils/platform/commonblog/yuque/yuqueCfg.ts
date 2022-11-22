import {CommonblogCfg} from "~/utils/platform/commonblog/commonblogCfg";
import {POSTID_KEY_CONSTANTS} from "~/utils/constants/postidKeyConstants";
import {PageType} from "~/utils/platform/metaweblog/IMetaweblogCfg";

/**
 * 语雀配置
 */
export class YuqueCfg extends CommonblogCfg {

    constructor() {
        super();

        this.home = "https://www.yuque.com/"
        this.apiUrl = "https://www.yuque.com/api/v2"
        this.tokenSettingUrl = "https://www.yuque.com/settings/tokens"
        this.posidKey = POSTID_KEY_CONSTANTS.YUQUE_POSTID_KEY
        this.previewUrl = "/[notebook]/[postid]"
        this.pageType = PageType.Markdown
    }
}