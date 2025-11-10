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

/**
 * 印象笔记配置
 */
class YinxiangConfig extends CommonBlogConfig {
  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://dev.yinxiang.com/doc/", "https://dev.yinxiang.com/doc/api/v2", username, password, middlewareUrl)

    this.tokenSettingUrl = "https://dev.yinxiang.com/doc/settings/tokens"
    this.showTokenTip = true
    this.previewUrl = "/notebook/[notebook]/note/[noteid]"
    this.pageType = PageTypeEnum.Html
    this.usernameEnabled = true
    this.passwordType = PasswordType.PasswordType_Cookie
    this.allowPreviewUrlChange = false
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "笔记本"
    this.allowKnowledgeSpaceChange = false
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "由于印象笔记平台的限制，暂时不支持编辑所属笔记本。如果您想移动笔记，请先取消删除该笔记，然后重新选择新的笔记本发布"
  }
}

export { YinxiangConfig }
