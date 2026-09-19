/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"
import { CategoryTypeEnum, PageTypeEnum } from "zhi-blog-api"
import WordpressUtils from "~/src/adaptors/api/wordpress/wordpressUtils.ts"

/**
 * WordPress.com 配置
 *
 * @author terwer
 * @since 1.20.0
 */
class WordpressdotcomConfig extends MetaweblogConfig {
  /**
   * WordPress.com 配置项
   *
   * @param homeAddr WordPress.com 主页
   * @param username 用户名
   * @param password 密码
   * @param middlewareUrl 代理地址
   */
  constructor(homeAddr: string, username: string, password: string, middlewareUrl?: string) {
    super(homeAddr, "", username, password, middlewareUrl)

    const { home, apiUrl } = WordpressUtils.parseHomeAndUrl(homeAddr)
    this.home = home
    this.apiUrl = apiUrl
    this.previewUrl = "/?p=[postid]"
    this.pageType = PageTypeEnum.Html
    this.usernameEnabled = true
    this.showTokenTip = false
    this.allowPreviewUrlChange = true
    this.tagEnabled = true
    this.cateEnabled = true
    this.categoryType = CategoryTypeEnum.CategoryType_Multi
    this.allowCateChange = true
    this.knowledgeSpaceEnabled = false

    // WordPress.com 的站点域按客户端特征拒绝 Node fetch（返回需脚本校验的中间页），
    // 而宿主自身的网络栈访问正常，故走宿主会话直传；宿主不具备该能力时自动回退，不硬失败。
    this.isHostSessionFetch = true

    // 另提供一条不需要额外网络条件的通路：用户在「跨域代理地址」填入自备的代理服务后，
    // XML-RPC 即改经该代理发出（见 resolveXmlrpcTransport）。**不内置共享代理地址**，
    // 留空则回落到上面的宿主会话直传。两项均只对本平台生效。
    this.isCorsXmlrpcProxy = true
    // 该开关同时决定配置页是否渲染「跨域代理地址」输入框（见 CommonBlogSetting.vue）。
    // 本平台的传输选型由上面的 isCorsXmlrpcProxy / isHostSessionFetch 先判定，
    // 因此这里开启只影响输入框的显示，不会把请求改道到共享中间件。
    this.isCorsProxy = true
  }
}

export { WordpressdotcomConfig }
