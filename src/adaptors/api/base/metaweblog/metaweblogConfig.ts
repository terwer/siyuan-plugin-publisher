/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CategoryTypeEnum, PageTypeEnum, PicbedServiceTypeEnum } from "zhi-blog-api"
import { MetaweblogPlaceholder } from "~/src/adaptors/api/base/metaweblog/metaweblogPlaceholder.ts"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"

/**
 * Metaweblog配置类
 */
export class MetaweblogConfig extends CommonBlogConfig {
  /**
   * 首页
   */
  public override home = ""

  /**
   * API地址
   */
  public override apiUrl = ""
  /**
   * 用户名
   */
  public override username = ""
  /**
   * 密码
   */
  public override password = ""

  /**
   * 是否发布
   */
  public override apiStatus = false

  /**
   * 博客ID
   */
  public override blogid = ""

  /**
   * 博客名（API获取）
   */
  public override blogName = ""

  /**
   * 文章别名key
   */
  public override posidKey = ""

  /**
   * 文章预览链接
   */
  public override previewUrl = ""

  /**
   * 文章类型
   */
  public override pageType = PageTypeEnum.Markdown

  /**
   * 操作提示
   */
  public override placeholder = {} as MetaweblogPlaceholder

  /**
   * 跨域请求代理
   */
  public override middlewareUrl = ""

  /**
   * 是否走宿主会话直传（Electron `session.fetch`，即 Chromium 网络栈）。
   *
   * 按客户端特征拒绝 Node fetch、但宿主内访问正常的站点需要开启（如 WordPress.com）。
   * 宿主不具备该能力时会自动回退既有通道，不会硬失败。默认关闭，不影响其他 MetaWeblog 平台。
   *
   * 与 {@link BlogConfig.isCorsProxy} 构成一对处境开关：**开启本项**即走宿主直连（需要当前网络
   * 能打开站点）；**关闭本项、仅开 `isCorsProxy` 并填好跨域代理地址**则走用户自备的代理
   * （不需要额外网络条件）。两者都开时以已配置代理地址为准。
   */
  public isHostSessionFetch = false

  constructor(home: string, apiUrl: string, username: string, password: string, middlewareUrl?: string) {
    super(home, apiUrl, username, password, middlewareUrl)

    this.home = home
    this.apiUrl = apiUrl
    this.username = username
    this.password = password
    this.apiStatus = false
    this.blogid = ""
    this.blogName = ""
    this.posidKey = ""
    this.previewUrl = ""
    this.pageType = PageTypeEnum.Html
    this.middlewareUrl = middlewareUrl
    this.placeholder = new MetaweblogPlaceholder()
    this.usernameEnabled = true
    this.showTokenTip = false
    this.allowPreviewUrlChange = true
    this.tagEnabled = true
    this.cateEnabled = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.allowCateChange = true
    this.knowledgeSpaceEnabled = false
    // MetaWeblog 协议自带 metaWeblog.newMediaObject（见 metaweblogBlogApiAdaptor），
    // 平台图床可用，新账号默认选「当前平台」；显式选择「不使用」不会被覆盖
    this.picbedService = PicbedServiceTypeEnum.Bundled
  }
}
