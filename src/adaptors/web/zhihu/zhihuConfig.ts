/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonWebConfig } from "~/src/adaptors/web/base/commonWebConfig.ts"
import { CategoryTypeEnum, PageTypeEnum, PasswordType } from "zhi-blog-api"

/**
 * 知乎配置
 */
class ZhihuConfig extends CommonWebConfig {
  public logoutUrl: string

  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://zhuanlan.zhihu.com", "https://zhuanlan.zhihu.com/api", username, password, middlewareUrl)

    this.logoutUrl = "https://www.zhihu.com/logout"
    this.previewUrl = "/p/[postid]"
    this.pageType = PageTypeEnum.Html
    this.passwordType = PasswordType.PasswordType_Cookie
    this.usernameEnabled = true
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "专栏"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
    this.allowKnowledgeSpaceChange = false
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "由于知乎平台的限制，暂时不支持编辑所属专栏。如果您想移动文档，请先点击取消删除该文档，然后重新选择新的专栏发布"
  }
}

export { ZhihuConfig }
