/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { UserBlog, YamlConvertAdaptor } from "zhi-blog-api"
import { LocalSystemYamlConvertAdaptor } from "~/src/adaptors/fs/LocalSystem/LocalSystemYamlConvertAdaptor.ts"
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { YuqueConfig } from "~/src/adaptors/api/yuque/yuqueConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { EnvUtil } from "~/src/utils/EnvUtil.ts"
import { StrUtil } from "zhi-common"

/**
 * 本地系统适配器
 *
 * @author terwer
 * @since 1.38.0
 */
class LocalSystemApiAdaptor extends BaseBlogApi {
  constructor(appInstance: any, cfg: LocalSystemConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("local-system-adaptor")
  }

  /**
   * 通用校验逻辑调用
   *
   * @param _keyword
   */
  getUsersBlogs(_keyword?: string): Promise<Array<UserBlog>> {
    const localFsCfg = this.cfg as LocalSystemConfig
    // 确保保存路径存在
    this.logger.debug("Ensure that the save path exists1...", localFsCfg)
    const absStorePath = localFsCfg.storePath
    const absImageStorePath = StrUtil.pathJoin(absStorePath, localFsCfg.imageStorePath)
    const isPathOk = EnvUtil.ensurePath(absStorePath)
    const isImagePathOk = EnvUtil.ensurePath(absImageStorePath)
    if (!isPathOk || !isImagePathOk) {
      throw new Error("文件存储路径或媒体存储路径初始化失败！")
    }
    return Promise.resolve([])
  }

  /**
   * 获取YAML适配器
   */
  getYamlAdaptor(): YamlConvertAdaptor {
    const localFsCfg = this.cfg as LocalSystemConfig
    return new LocalSystemYamlConvertAdaptor(localFsCfg)
  }
}

export { LocalSystemApiAdaptor }
