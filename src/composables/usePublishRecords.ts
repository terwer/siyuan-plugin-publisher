/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ObjectUtil, StrUtil } from "zhi-common"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { DynamicConfig, getDynPostidKey, getDynYamlKey } from "~/src/platforms/dynamicConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { SypConfig } from "~/syp.config.ts"

/**
 * 一条已发布记录：某篇思源文档在某个平台上的文章关联。
 *
 * @public
 */
export interface PublishedRecord {
  platformKey: string
  platformName: string
  platformIcon: string
  /** 平台账号名（站点名/博客名），用于区分同一平台的多个账号；没有时为空 */
  accountLabel?: string
  /** 发布记录在 setting 里使用的属性名，例如 `custom-ZhihuWeb-post-id` */
  posidKey: string
  /** 平台文章 ID，空字符串表示没有记录 */
  postid: string
}

/**
 * 当前文档的发布记录概览。
 *
 * @public
 */
export interface PublishedRecordsOverview {
  /** 已有关联的平台 */
  records: PublishedRecord[]
  /** 没有关联、但可以在平台上手动关联旧文章的平台 */
  candidates: PublishedRecord[]
}

/**
 * 解析平台发布记录使用的文章 ID 属性名。
 *
 * 平台配置里持久化的 `posidKey` 是权威值；历史配置可能没有保存这个字段，
 * 此时回退到统一的 `getDynPostidKey(platformKey)` 规则，避免漏掉真实存在的记录。
 *
 * @param storedCfg - setting 里保存的平台配置
 * @param platformKey - 平台 key
 * @public
 */
export function resolvePostidKey(storedCfg: any, platformKey: string): string {
  const configured = storedCfg?.posidKey
  if (typeof configured === "string" && !StrUtil.isEmptyString(configured)) {
    return configured
  }
  return getDynPostidKey(platformKey)
}

/**
 * 从设置里收集当前文档的发布记录。
 *
 * 只认已配置的平台（`dynamicConfigArray`）；内置平台（isSys）以文档 ID 作为文章 ID、
 * 不写发布记录，因此不参与列表与关联。
 *
 * @param setting - 发布设置
 * @param docId - 思源文档 ID
 * @param dynamicConfigArray - 当前已配置的平台
 * @public
 */
export function collectPublishedRecords(
  setting: Partial<typeof SypConfig>,
  docId: string,
  dynamicConfigArray: DynamicConfig[]
): PublishedRecordsOverview {
  const overview: PublishedRecordsOverview = { records: [], candidates: [] }
  if (StrUtil.isEmptyString(docId)) {
    return overview
  }

  const postMeta = ObjectUtil.getProperty(setting, docId, {}) as Record<string, any>
  for (const item of dynamicConfigArray ?? []) {
    if (!item || item.isSys || StrUtil.isEmptyString(item.platformKey)) {
      continue
    }
    const storedCfg = ObjectUtil.getProperty(setting, item.platformKey, {})
    const posidKey = resolvePostidKey(storedCfg, item.platformKey)
    const postid = ObjectUtil.getProperty(postMeta, posidKey, "")
    const accountLabel = String(storedCfg?.blogName ?? storedCfg?.username ?? "").trim()
    const record: PublishedRecord = {
      platformKey: item.platformKey,
      platformName: item.platformName ?? item.platformKey,
      platformIcon: item.platformIcon ?? "",
      accountLabel: StrUtil.isEmptyString(accountLabel) ? "" : accountLabel,
      posidKey,
      postid: StrUtil.isEmptyString(postid) ? "" : String(postid),
    }
    if (StrUtil.isEmptyString(record.postid)) {
      overview.candidates.push(record)
    } else {
      overview.records.push(record)
    }
  }
  return overview
}

/**
 * 读写当前文档的发布记录（已发布文章管理、强制删除共用）。
 *
 * @public
 */
export const usePublishRecords = () => {
  const logger = createAppLogger("publish-records")
  const { getPublishCfg } = usePublishConfig()
  const { updateSetting } = usePublishSettingStore()
  const { kernelApi } = useSiyuanApi()

  /** 读取当前文档的发布记录概览 */
  const load = async (docId: string): Promise<PublishedRecordsOverview> => {
    if (StrUtil.isEmptyString(docId)) {
      return { records: [], candidates: [] }
    }
    const publishCfg = await getPublishCfg()
    return collectPublishedRecords(publishCfg.setting, docId, publishCfg.dynamicConfigArray)
  }

  /** 写入/修改某平台的发布记录（文章 ID） */
  const save = async (docId: string, posidKey: string, postid: string): Promise<void> => {
    const value = (postid ?? "").trim()
    if (StrUtil.isEmptyString(value)) {
      throw new Error("文章 ID 不能为空")
    }
    const publishCfg = await getPublishCfg()
    const setting = publishCfg.setting
    const postMeta = ObjectUtil.getProperty(setting, docId, {}) as Record<string, any>
    postMeta[posidKey] = value
    setting[docId] = postMeta
    await updateSetting(setting)
    logger.info(`[records] saved doc=${docId} key=${posidKey}`)
  }

  /**
   * 解绑某平台：只清理本地发布记录与平台 YAML 属性。
   *
   * 不调用平台接口，平台上的文章不会被删除。之后再次发布会被当作新文章。
   *
   * @returns YAML 属性是否也清理成功（清理失败不影响记录解绑本身）
   */
  const unbind = async (docId: string, platformKey: string, posidKey: string): Promise<boolean> => {
    const publishCfg = await getPublishCfg()
    const setting = publishCfg.setting
    const postMeta = ObjectUtil.getProperty(setting, docId, {}) as Record<string, any>
    const updatedPostMeta = { ...postMeta }
    if (Object.prototype.hasOwnProperty.call(updatedPostMeta, posidKey)) {
      delete updatedPostMeta[posidKey]
    }
    setting[docId] = updatedPostMeta
    await updateSetting(setting)

    let yamlCleared = true
    try {
      await kernelApi.setSingleBlockAttr(docId, getDynYamlKey(platformKey), "")
    } catch (e) {
      yamlCleared = false
      logger.warn(`[records] clear platform yaml failed doc=${docId} platform=${platformKey}: ${String(e)}`)
    }
    logger.info(`[records] unbound doc=${docId} platform=${platformKey}`)
    return yamlCleared
  }

  return { load, save, unbind }
}
