/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogConfig, PageTypeEnum } from "zhi-blog-api"
import { CommonBlogPlaceholder } from "~/src/adaptors/api/base/commonBlogPlaceholder.ts"

export class CommonBlogConfig extends BlogConfig {
  /**
   * 操作提示
   */
  public override placeholder = {} as CommonBlogPlaceholder

  constructor(home: string, apiUrl: string, username: string, password: string, middlewareUrl?: string) {
    super()
    this.home = home
    this.apiUrl = apiUrl
    this.username = username
    this.password = password
    this.tokenSettingUrl = undefined
    this.apiStatus = false
    this.blogid = ""
    this.blogName = ""
    this.posidKey = ""
    this.previewUrl = ""
    this.pageType = PageTypeEnum.Markdown
    this.middlewareUrl = middlewareUrl
    // this.corsAnywhereUrl = ""
    // this.corsCookieArray = []
    this.usernameEnabled = false
    this.allowPreviewUrlChange = true
    this.showTokenTip = false
    this.yamlLinkEnabled = true
    this.placeholder = new CommonBlogPlaceholder()
  }
}
