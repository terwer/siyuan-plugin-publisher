import { CommonblogCfg } from "~/utils/platform/commonblog/commonblogCfg"
import { POSTID_KEY_CONSTANTS } from "~/utils/constants/postidKeyConstants"
import { PageType } from "~/utils/platform/metaweblog/IMetaweblogCfg"

/**
 * 链滴配置
 */
export class LiandiCfg extends CommonblogCfg {
  constructor() {
    super()

    this.home = "https://ld246.com/"
    this.apiUrl = "https://ld246.com/api/v2"
    this.tokenSettingUrl = "https://ld246.com/settings/account"
    this.posidKey = POSTID_KEY_CONSTANTS.LIANDI_POSTID_KEY
    this.previewUrl = "/article/[postid]"
    this.pageType = PageType.Markdown
  }
}
