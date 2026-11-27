/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonWebConfig } from "~/src/adaptors/web/base/commonWebConfig.ts"
import {
  CategoryTypeEnum,
  CoverMode,
  MathRenderModeEnum,
  PageTypeEnum,
  PasswordType,
  PicbedServiceTypeEnum,
} from "zhi-blog-api"

/**
 * CSDN配置
 */
export class CsdnConfig extends CommonWebConfig {
  public logoutUrl: string

  /**
   * 是否支持原生封面字段。
   *
   * 发布层按「题头图 → 正文首图 → 自定义」解析，适配器再把图片换成
   * CSDN 图床地址写入 `cover_images`。
   */
  public coverEnabled = true

  /**
   * `cover_images` 接收图片 URL（不是附件 ID）。
   */
  public coverMode = CoverMode.Url

  /**
   * 允许在发布表单中自定义封面（上传/填写链接）。
   */
  public featuredImageEnabled = true

  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://blog.csdn.net", "https://bizapi.csdn.net", username, password, middlewareUrl)

    this.logoutUrl = "https://passport.csdn.net/account/logout"
    this.previewUrl = "/[userid]/article/details/[postid]"
    this.pageType = PageTypeEnum.Markdown
    this.usernameEnabled = false
    this.passwordType = PasswordType.PasswordType_Cookie
    this.tagEnabled = true
    this.cateEnabled = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.allowCateChange = true
    this.knowledgeSpaceEnabled = false
    this.picgoPicbedSupported = false
    this.bundledPicbedSupported = true
    this.picbedService = PicbedServiceTypeEnum.Bundled
    // CSDN 正文使用 KaTeX 渲染公式
    this.mathRenderMode = MathRenderModeEnum.KaTeX
  }
}
