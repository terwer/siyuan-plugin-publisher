/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonWebConfig } from "~/src/adaptors/web/base/commonWebConfig.ts"
import { PageTypeEnum, PasswordType, PicbedServiceTypeEnum } from "zhi-blog-api"

/**
 * 微信公众号配置
 */
export class WechatConfig extends CommonWebConfig {
  public logoutUrl: string

  constructor(username: string, password: string, middlewareUrl?: string) {
    super("https://mp.weixin.qq.com", "https://mp.weixin.qq.com/cgi-bin/appmsg", username, password, middlewareUrl)

    this.logoutUrl = "https://mp.weixin.qq.com/cgi-bin/logout"
    this.previewUrl =
      "/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77&appmsgid=[postid]&token=[token]&lang=zh_CN"
    this.pageType = PageTypeEnum.Html
    this.passwordType = PasswordType.PasswordType_Cookie
    this.usernameEnabled = false
    this.tagEnabled = false
    this.cateEnabled = false
    this.knowledgeSpaceEnabled = false
    // 公众号平台图片上传（素材库 upload_material），默认平台图床，与外链/PicGo 并存
    this.picgoPicbedSupported = false
    this.bundledPicbedSupported = true
    this.picbedService = PicbedServiceTypeEnum.Bundled
  }
}
