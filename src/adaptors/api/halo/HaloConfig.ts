/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import { CategoryTypeEnum, CoverMode, PageTypeEnum, PicbedServiceTypeEnum } from "zhi-blog-api"

/**
 * Halo 配置
 */
class HaloConfig extends CommonBlogConfig {
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

  /**
   * Halo 配置项
   *
   * @param username 用户名
   * @param password 密码
   * @param middlewareUrl 代理地址
   */
  constructor(username: string, password: string, middlewareUrl?: string) {
    super("", "", username, password, middlewareUrl)

    this.home = "[your-halo-home]"
    this.apiUrl = "[your-halo-api-url]"
    this.previewUrl = "/archives/{slug}"
    this.pageType = PageTypeEnum.Html
    this.usernameEnabled = true
    this.showTokenTip = false
    this.allowPreviewUrlChange = true
    this.tagEnabled = true
    this.cateEnabled = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.allowCateChange = true
    this.knowledgeSpaceEnabled = false
    // Halo 自带附件上传（见 HaloApiAdaptor.newMediaObject），平台图床可用，
    // 新账号默认选「当前平台」；显式选择「不使用」不会被覆盖
    this.picbedService = PicbedServiceTypeEnum.Bundled
  }
}

export { HaloConfig }
