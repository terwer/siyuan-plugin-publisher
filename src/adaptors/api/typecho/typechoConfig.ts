/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryTypeEnum, PageTypeEnum } from "zhi-blog-api"
import TypechoUtils from "~/src/adaptors/api/typecho/typechoUtils.ts"
import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"

/**
 * Typecho 配置
 *
 * @author terwer
 * @since 1.0.0
 */
class TypechoConfig extends MetaweblogConfig {
  /**
   * Typecho 配置项
   *
   * @param homeAddr Typecho 主页
   * @param username 用户名
   * @param password 密码
   * @param middlewareUrl 代理地址
   */
  constructor(homeAddr: string, username: string, password: string, middlewareUrl?: string) {
    super(homeAddr, "", username, password, middlewareUrl)

    const { home, apiUrl } = TypechoUtils.parseHomeAndUrl(homeAddr)
    this.home = home
    this.apiUrl = apiUrl
    this.previewUrl = "/index.php/archives/[postid]"
    this.pageType = PageTypeEnum.Html
    this.showTokenTip = false
    this.allowPreviewUrlChange = true
    this.tagEnabled = true
    this.cateEnabled = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.allowCateChange = true
    this.knowledgeSpaceEnabled = false
  }
}

export { TypechoConfig }
