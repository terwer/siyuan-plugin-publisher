/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { YamlConvertAdaptor } from "zhi-blog-api"
import { AstroYamlConverterAdaptor } from "~/src/adaptors/api/astro/astroYamlConverterAdaptor.ts"
import { DocsifyYamlConverterAdaptor } from "~/src/adaptors/api/docsify/docsifyYamlConverterAdaptor.ts"
import { HexoYamlConverterAdaptor } from "~/src/adaptors/api/hexo/hexoYamlConverterAdaptor.ts"
import { HugoYamlConverterAdaptor } from "~/src/adaptors/api/hugo/hugoYamlConverterAdaptor.ts"
import { JekyllYamlConverterAdaptor } from "~/src/adaptors/api/jekyll/jekyllYamlConverterAdaptor.ts"
import { QuartzYamlConverterAdaptor } from "~/src/adaptors/api/quartz/quartzYamlConverterAdaptor.ts"
import { VitepressYamlConverterAdaptor } from "~/src/adaptors/api/vitepress/vitepressYamlConverterAdaptor.ts"
import { VuepressYamlConverterAdaptor } from "~/src/adaptors/api/vuepress/vuepressYamlConverterAdaptor.ts"
import { Vuepress2YamlConverterAdaptor } from "~/src/adaptors/api/vuepress2/vuepress2YamlConverterAdaptor.ts"
import { FsYamlType } from "~/src/adaptors/fs/LocalSystem/FsYamlType.ts"
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { LocalSystemYamlConvertAdaptor } from "~/src/adaptors/fs/LocalSystem/LocalSystemYamlConvertAdaptor.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * 把 mediaObject 的绝对路径转成相对于存储目录的 Markdown 链接。
 *
 * 配置里的存储目录可能混用 `\` 和 `/`，而 `path.join` 在 Windows 上统一输出 `\`；
 * 直接 `replace(storePath, ".")` 会因分隔符不一致失败，导致正文写出绝对路径。
 */
export const toStoreRelativeMediaUrl = (absMediaFilePath: string, storePath: string): string => {
  const normalize = (value: string) => String(value ?? "").replace(/\\/g, "/").replace(/\/+$/, "")
  const absPath = normalize(absMediaFilePath)
  const store = normalize(storePath)
  if (!store) {
    return absMediaFilePath
  }
  if (absPath === store) {
    return "."
  }
  if (absPath.startsWith(`${store}/`)) {
    return `./${absPath.slice(store.length + 1)}`
  }
  return absMediaFilePath
}

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

    // 默认使用LocalSystemYamlConvertAdaptor
    let yamlAdaptor: YamlConvertAdaptor = new LocalSystemYamlConvertAdaptor(cfg)

    // 根据fsYamlType选择对应的适配器
    try {
      switch (yamlType) {
        case FsYamlType.Hexo:
          yamlAdaptor = new HexoYamlConverterAdaptor()
          break
        case FsYamlType.Hugo:
          yamlAdaptor = new HugoYamlConverterAdaptor()
          break
        case FsYamlType.Jekyll:
          yamlAdaptor = new JekyllYamlConverterAdaptor()
          break
        case FsYamlType.Vuepress:
          yamlAdaptor = new VuepressYamlConverterAdaptor()
          break
        case FsYamlType.Vitepress:
          yamlAdaptor = new VitepressYamlConverterAdaptor()
          break
        case FsYamlType.Quartz:
          yamlAdaptor = new QuartzYamlConverterAdaptor()
          break
        case FsYamlType.Vuepress2:
          yamlAdaptor = new Vuepress2YamlConverterAdaptor()
          break
        case FsYamlType.Astro:
          yamlAdaptor = new AstroYamlConverterAdaptor()
          break
        case FsYamlType.Docsify:
          yamlAdaptor = new DocsifyYamlConverterAdaptor()
          break
        case FsYamlType.Default:
        default:
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
