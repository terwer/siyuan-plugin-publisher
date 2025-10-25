/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import { PasswordType, PicbedServiceTypeEnum } from "zhi-blog-api"
import { EnvUtil } from "~/src/utils/EnvUtil.ts"
import { StrUtil } from "zhi-common"

/**
 * 本地系统配置
 *
 * @author terwer
 * @since 1.38.0
 */
class LocalSystemConfig extends CommonBlogConfig {
  public storePath: string

  constructor() {
    super(null, null, null, null, null)
    this.homeEnabled = false
    this.apiUrlEnabled = false
    this.previewUrlEnabled = false
    this.passwordType = PasswordType.PasswordType_None
    this.picgoPicbedSupported = false
    this.picbedService = PicbedServiceTypeEnum.Bundled
    this.storePath = StrUtil.pathJoin(EnvUtil.getHomeFolder(), "Downloads/syp")
    this.imageStorePath = "assets"
  }
}

export { LocalSystemConfig }
