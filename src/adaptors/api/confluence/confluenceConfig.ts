/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PageTypeEnum, PasswordType } from "zhi-blog-api"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import { StrUtil } from "zhi-common"

/**
 * Confluence 配置
 */
class ConfluenceConfig extends CommonBlogConfig {
  public parentPageId?: string

  constructor(home: string, apiUrl: string, password: string, middlewareUrl?: string) {
    super(home, apiUrl, "", password, middlewareUrl)

    this.tokenSettingUrl = "[your-confluence-host]/plugins/personalaccesstokens/usertokens.action"
    this.showTokenTip = true
    this.previewUrl = "/spaces/[spaceKey]/pages/[postid]"
    this.pageType = PageTypeEnum.Html
    this.usernameEnabled = false
    this.passwordType = PasswordType.PasswordType_Token
    this.allowPreviewUrlChange = false
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "空间"
    this.allowKnowledgeSpaceChange = true
    this.parentPageId = ""
    this.placeholder.knowledgeSpaceReadonlyModeTip = ""
    this.picgoPicbedSupported = true
    this.bundledPicbedSupported = true
  }
}

export { ConfluenceConfig }
