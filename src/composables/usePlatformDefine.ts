/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { DynamicConfig, getSubPlatformTypeByKey, PlatformType, SubPlatformType } from "~/src/platforms/dynamicConfig.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { mainPre, pre } from "~/src/platforms/pre.ts"

export type PreI18nResolver = (key: string) => string
export type PreI18nConfig = Record<string, string>
export type LocalizablePrePlatform = DynamicConfig & {
  i18n?: PreI18nConfig
}

export const getAllPrePlatformDefinitions = (): DynamicConfig[] => [
  ...pre.commonCfg,
  ...pre.githubCfg,
  ...pre.gitlabCfg,
  ...pre.metaweblogCfg,
  ...pre.wordpressCfg,
  ...pre.customCfg,
  ...pre.fsCfg,
]

export const getPrePlatformI18nConfig = (platform: Pick<DynamicConfig, "i18n">): PreI18nConfig => {
  return platform.i18n ?? {}
}

export const resolvePrePlatformI18nField = (
  platform: Pick<DynamicConfig, "i18n">,
  field: string,
  t: PreI18nResolver
): string | undefined => {
  const i18nKey = getPrePlatformI18nConfig(platform)[field]?.trim()
  if (!i18nKey) {
    return undefined
  }

  const translated = t(i18nKey).trim()
  return translated && translated !== i18nKey ? translated : undefined
}

export const localizePrePlatform = <T extends LocalizablePrePlatform>(platform: T, t: PreI18nResolver): T => {
  const i18nConfig = getPrePlatformI18nConfig(platform)
  if (Object.keys(i18nConfig).length === 0) {
    return platform
  }

  const localized = { ...platform } as Record<string, any>
  for (const [field, i18nKey] of Object.entries(i18nConfig)) {
    const translated = t(i18nKey).trim()
    if (translated && translated !== i18nKey) {
      localized[field] = translated
    }
  }

  return localized as T
}

export const localizePrePlatforms = <T extends LocalizablePrePlatform>(platforms: T[], t: PreI18nResolver): T[] => {
  return platforms.map((platform) => localizePrePlatform(platform, t))
}

/**
 * 通用平台定义。包含平台类型列表、getPlatformType函数和getPrePlatform函数的对象。
 * @since 0.9.0
 */
export const usePlatformDefine = () => {
  const { t } = useVueI18n()

  const platformTypeList = mainPre(t)

  const prePlatformList: DynamicConfig[] = localizePrePlatforms(getAllPrePlatformDefinitions(), t)

  /**
   * 根据键获取平台类型
   *
   * @param key - 平台类型的键
   */
  const getPlatformType = (key) => {
    return platformTypeList.find((platformType) => platformType.type === key)
  }

  /**
   * 根据类型获取预定义平台
   */
  const getPrePlatformList = (type: PlatformType): DynamicConfig[] => {
    return prePlatformList.filter((platform) => platform.platformType === type)
  }

  /**
   * 根据类型获取预定义平台
   */
  const getPrePlatform = (key: string): DynamicConfig => {
    return prePlatformList.find((platform) => platform.platformKey === key)
  }

  /**
   * 根据平台 key 或子平台类型获取预定义平台。
   *
   * 历史配置可能使用自定义实例 key（如 common_Yuque-xxxx），因此不能只按 platformKey 精确匹配。
   */
  const getPrePlatformByKeyOrSubtype = (key?: string, subtype?: SubPlatformType): DynamicConfig | undefined => {
    const exactPlatform = key ? getPrePlatform(key) : undefined
    if (exactPlatform) {
      return exactPlatform
    }

    let resolvedSubtype = subtype
    if (!resolvedSubtype && key) {
      try {
        resolvedSubtype = getSubPlatformTypeByKey(key)
      } catch {
        resolvedSubtype = undefined
      }
    }
    return resolvedSubtype ? prePlatformList.find((platform) => platform.subPlatformType === resolvedSubtype) : undefined
  }

  /**
   * 根据所有预定义平台 key 集合
   */
  const getPrePlatformKeys = (): string[] => {
    return prePlatformList.map((platform) => {
      return platform.platformKey
    })
  }

  /**
   * 获取所有平台
   *
   * @since 1.20.0
   */
  const getAllPrePlatformList = (): DynamicConfig[] => {
    return prePlatformList
  }

  return {
    getPrePlatformKeys,
    platformTypeList,
    getPlatformType,
    getAllPrePlatformList,
    getPrePlatformList,
    getPrePlatform,
    getPrePlatformByKeyOrSubtype,
  }
}
