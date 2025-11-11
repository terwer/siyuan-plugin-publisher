/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "~/src/utils/appLogger.ts"
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { LocalSystemYamlConvertAdaptor } from "~/src/adaptors/fs/LocalSystem/LocalSystemYamlConvertAdaptor.ts"
import { FsYamlType } from "~/src/adaptors/fs/LocalSystem/FsYamlType.ts"
import { YamlConvertAdaptor } from "zhi-blog-api"
import { HexoYamlConverterAdaptor } from "~/src/adaptors/api/hexo/hexoYamlConverterAdaptor.ts"
import { HugoYamlConverterAdaptor } from "~/src/adaptors/api/hugo/hugoYamlConverterAdaptor.ts"
import { JekyllYamlConverterAdaptor } from "~/src/adaptors/api/jekyll/jekyllYamlConverterAdaptor.ts"
import { VuepressYamlConverterAdaptor } from "~/src/adaptors/api/vuepress/vuepressYamlConverterAdaptor.ts"
import { VitepressYamlConverterAdaptor } from "~/src/adaptors/api/vitepress/vitepressYamlConverterAdaptor.ts"
import { QuartzYamlConverterAdaptor } from "~/src/adaptors/api/quartz/quartzYamlConverterAdaptor.ts"
import { Vuepress2YamlConverterAdaptor } from "~/src/adaptors/api/vuepress2/vuepress2YamlConverterAdaptor.ts"

/**
 * 文件系统工具类
 *
 * @author terwer
 * @since 1.39.0
 */
class FsUtils {
  private static logger = createAppLogger("fs-utils")

  /**
   * 根据配置获取YAML适配器
   *
   * @param cfg 本地系统配置
   * @returns 对应的YAML适配器实例
   */
  public static getYamlAdaptor(cfg: LocalSystemConfig): YamlConvertAdaptor {
    const yamlType = cfg.fsYamlType
    FsUtils.logger.debug(`YAML type: ${yamlType}`)

    // 默认使用LocalSystemYamlConvertAdaptor
    let yamlAdaptor: YamlConvertAdaptor = new LocalSystemYamlConvertAdaptor(cfg)

    // 根据fsYamlType选择对应的适配器
    try {
      switch (yamlType) {
        case FsYamlType.Hexo:
          FsUtils.logger.info("Using Hexo YAML adapter")
          yamlAdaptor = new HexoYamlConverterAdaptor()
          break
        case FsYamlType.Hugo:
          FsUtils.logger.info("Using Hugo YAML adapter")
          yamlAdaptor = new HugoYamlConverterAdaptor()
          break
        case FsYamlType.Jekyll:
          FsUtils.logger.info("Using Jekyll YAML adapter")
          yamlAdaptor = new JekyllYamlConverterAdaptor()
          break
        case FsYamlType.Vuepress:
          FsUtils.logger.info("Using Vuepress YAML adapter")
          yamlAdaptor = new VuepressYamlConverterAdaptor()
          break
        case FsYamlType.Vitepress:
          FsUtils.logger.info("Using Vitepress YAML adapter")
          yamlAdaptor = new VitepressYamlConverterAdaptor()
          break
        case FsYamlType.Quartz:
          FsUtils.logger.info("Using Quartz YAML adapter")
          yamlAdaptor = new QuartzYamlConverterAdaptor()
          break
        case FsYamlType.Vuepress2:
          FsUtils.logger.info("Using Vuepress2 YAML adapter")
          yamlAdaptor = new Vuepress2YamlConverterAdaptor()
          break
        case FsYamlType.Default:
        default:
          FsUtils.logger.info("Using default LocalSystem YAML adapter")
          yamlAdaptor = new LocalSystemYamlConvertAdaptor(cfg)
          break
      }
    } catch (e) {
      FsUtils.logger.error(`Failed to load YAML adapter for type ${yamlType}, using default`, e)
      yamlAdaptor = new LocalSystemYamlConvertAdaptor(cfg)
    }

    return yamlAdaptor
  }
}

export { FsUtils }