/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import { PasswordType } from "zhi-blog-api"

/**
 * 发布方式
 */
enum TelegraphPostType {
  // 匿名用户
  ANONYMOUS = "anonymous",
  // 登录用户
  LOGIN_USER = "user",
}

/**
 * Telegraph 配置
 */
class TelegraphConfig extends CommonBlogConfig {
  public postType: TelegraphPostType
  public accessToken: string
  public saveHash: string
  public forceReAuth: boolean

  constructor(telegraphUrl: string, telegraphToken: string, middlewareUrl?: string) {
    super(telegraphUrl, "https://edit.telegra.ph", "", telegraphToken, middlewareUrl)

    this.postType = TelegraphPostType.ANONYMOUS
    this.previewUrl = "/[postid]"
    this.allowPreviewUrlChange = false
    this.forceReAuth = false

    // CORS 受限平台：声明 isCorsProxy，强制走 CORS 代理通道
    // corsAnywhereUrl 由用户自行配置（不写死共享代理地址，防止滥用），UI 提供输入框
    this.isCorsProxy = true
  }
}

export { TelegraphPostType, TelegraphConfig }
