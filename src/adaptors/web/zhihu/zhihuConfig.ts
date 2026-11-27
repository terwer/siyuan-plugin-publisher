/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonWebConfig } from "~/src/adaptors/web/base/commonWebConfig.ts"
import { CategoryTypeEnum, MathRenderModeEnum, PageTypeEnum, PasswordType, PicbedServiceTypeEnum } from "zhi-blog-api"

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
    // 专栏归属按当前登录账号（/api/v4/me 的 url_token）解析，用户名不再需要用户填写
    this.usernameEnabled = false
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = true
    this.knowledgeSpaceTitle = "专栏"
    this.knowledgeSpaceType = CategoryTypeEnum.CategoryType_Single
    this.allowKnowledgeSpaceChange = false
    this.picgoPicbedSupported = false
    this.bundledPicbedSupported = true
    this.picbedService = PicbedServiceTypeEnum.Bundled
    // 知乎使用平台公式图片
    this.mathRenderMode = MathRenderModeEnum.RemoteImage
    this.mathImageUrlTemplate = "//www.zhihu.com/equation?tex={tex}"
    this.placeholder.knowledgeSpaceReadonlyModeTip =
      "由于知乎平台的限制，暂时不支持编辑所属专栏。如果您想移动文档，请先点击取消删除该文档，然后重新选择新的专栏发布"
  }
}

export { ZhihuConfig }
