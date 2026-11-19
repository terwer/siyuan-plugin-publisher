/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonWebConfig } from "../base/commonWebConfig"
import { CategoryTypeEnum, CoverMode, PageTypeEnum, PasswordType } from "zhi-blog-api"

/**
 * Halo 网页版配置
 */
class HalowebConfig extends CommonWebConfig {
  public logoutUrl: string

  /**
   * 是否支持原生封面字段。
   *
   * 发布层按「题头图 → 正文首图 → 自定义」解析，Halo 直接使用最终链接。
   */
  public coverEnabled = true

  /**
   * Halo `spec.cover` 接受封面 URL，不需要先上传成附件。
   */
  public coverMode = CoverMode.Url

  /**
   * 允许在发布表单中自定义封面（上传/填写链接）。
   */
  public featuredImageEnabled = true

  constructor(home: string, middlewareUrl?: string) {
    super(home, home, "", "", middlewareUrl)

    this.logoutUrl = `${home}/logout`
    this.previewUrl = "/archives/{slug}"
    this.pageType = PageTypeEnum.Html
    this.usernameEnabled = false
    this.showTokenTip = false
    this.allowPreviewUrlChange = true
    this.tagEnabled = true
    this.cateEnabled = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.allowCateChange = true
    this.knowledgeSpaceEnabled = false
  }
}

export { HalowebConfig }
