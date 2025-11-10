/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PageTypeEnum, WebConfig } from "zhi-blog-api"
import { CommonWebPlaceholder } from "~/src/adaptors/web/base/commonWebPlaceholder.ts"

/**
 * 网页授权配置
 */
export class CommonWebConfig extends WebConfig {
  /**
   * 操作提示
   */
  public override placeholder = {} as CommonWebPlaceholder

  constructor(home: string, apiUrl: string, username: string, password: string, middlewareUrl?: string) {
    super(password, middlewareUrl)
    this.home = home
    this.apiUrl = apiUrl
    this.username = username
    this.password = password
    this.apiStatus = false
    this.blogid = ""
    this.blogName = ""
    this.posidKey = ""
    this.previewUrl = ""
    this.pageType = PageTypeEnum.Markdown
    this.middlewareUrl = middlewareUrl
    this.usernameEnabled = false
    this.allowPreviewUrlChange = true
    this.showTokenTip = false
    this.yamlLinkEnabled = true
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = false
    this.placeholder = new CommonWebPlaceholder()
  }
}
