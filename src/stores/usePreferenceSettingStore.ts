/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { RemovableRef, StorageSerializers } from "@vueuse/core"
import { PublishPreferenceCfg, SiyuanAiModel, SiyuanAiProvider } from "~/src/models/publishPreferenceCfg.ts"
import { readonly } from "vue"
import { SiyuanDevice } from "zhi-device"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import useCommonLocalStorage from "~/src/stores/common/useCommonLocalStorage.ts"
import { Utils } from "~/src/utils/utils.ts"

const logger = createAppLogger("use-publish-pref")

// 共享单例：所有调用方（V1/V2 共用 AI 设置组件）拿到同一个引用，保证选择与回填一致
let prefConfig: RemovableRef<PublishPreferenceCfg> | null = null

/**
 * 读取思源笔记 config.ai.providers（仅保留启用且含可用模型的项）
 *
 * 思源笔记 AI 配置被重构为 providers[] 结构，旧的 config.ai.openAI 已移除。
 *
 * @returns 规范化的思源笔记 AI Provider 列表
 * @author terwer
 * @since 1.9.1
 */
const getSisyuanAiProviders = (): SiyuanAiProvider[] => {
  const win = SiyuanDevice.siyuanWindow()
  const aiCfg = win?.siyuan?.config?.ai
  const providers = (aiCfg?.providers ?? []).filter((p: any) => p?.enabled)
  return providers
    .map((p: any): SiyuanAiProvider => {
      return {
        id: p.id ?? "",
        displayName: p.displayName || p.id,
        baseURL: p.baseURL || "",
        protocol: p.protocol || "openai",
        apiKey: p.apiKey || "",
        models: (p.models ?? [])
          .filter((m: any) => m?.enabled)
          .map((m: any): SiyuanAiModel => ({ id: m.id ?? "", name: m.name ?? m.id ?? "" })),
      }
    })
    .filter((p) => p.models.length > 0)
}

/**
 * 在 provider 列表中按模型 id 查找其所属 provider 与模型
 */
const resolveModelConfig = (providers: SiyuanAiProvider[], modelId?: string) => {
  if (modelId) {
    for (const p of providers) {
      const m = p.models.find((mm) => mm.id === modelId)
      if (m) {
        return { p, m }
      }
    }
  }
  return null
}

/**
 * 获取发布偏好设置的单例引用（惰性创建）
 */
const getPrefConfig = (): RemovableRef<PublishPreferenceCfg> => {
  if (!prefConfig) {
    const initialValue = new PublishPreferenceCfg()
    prefConfig = useCommonLocalStorage<PublishPreferenceCfg>(
      "storage/syp/publish-preference-cfg.json",
      "publish-preference-cfg",
      initialValue,
      { serializer: StorageSerializers.object }
    )
  }
  return prefConfig
}

/**
 * 按思源笔记 AI 模型 id 回填 API 配置（apiKey/baseUrl/model），供共用组件选择模型时调用
 *
 * @param modelId 目标模型 id
 * @returns 是否回填成功
 */
const selectSisyuanAiModel = (modelId: string): boolean => {
  const cfg = getPrefConfig()
  const providers = getSisyuanAiProviders()
  const resolved = resolveModelConfig(providers, modelId)
  if (!resolved) {
    return false
  }
  cfg.value.experimentalAICode = resolved.p.apiKey
  cfg.value.experimentalAIBaseUrl = resolved.p.baseURL
  cfg.value.experimentalAIApiModel = resolved.m.name
  cfg.value.experimentalSisyuanAiActiveModelId = resolved.m.id
  return true
}

/**
 * 使用发布偏好设置的自定义钩子
 */
const usePreferenceSettingStore = () => {
  /**
   * 获取发布偏好设置
   *
   * 思源笔记 AI 配置已重构为 config.ai.providers[]，本方法会：
   * - 兼容旧的 config.ai.openAI
   * - 读取启用中的 providers，默认回填 agent.modelId 对应模型（无则取第一个启用模型的 provider）
   * - 记录用户当前选择的模型 id（experimentalSisyuanAiActiveModelId），保证多次调用不覆盖用户选择
   *
   * @returns {RemovableRef<PublishPreferenceCfg>} 可移除引用的发布偏好设置
   * @author terwer
   * @since 0.6.0
   */
  const getPublishPreferenceSetting = (): RemovableRef<PublishPreferenceCfg> => {
    const cfg = getPrefConfig()

    const win = SiyuanDevice.siyuanWindow()
    const aiCfg = win?.siyuan?.config?.ai
    const snAiCfg = aiCfg?.openAI
    logger.info("try load win.siyuan.config =>", aiCfg)

    const siyuanProviders = getSisyuanAiProviders()

    if (snAiCfg) {
      // 旧版 config.ai.openAI（向后兼容）
      cfg.value.experimentalUseSiyuanNoteAIConfig = true
      cfg.value.experimentalAIProxyUrl = snAiCfg.apiProxy
      cfg.value.experimentalAICode = snAiCfg.apiKey
      cfg.value.experimentalAIBaseUrl = snAiCfg.apiBaseURL
      cfg.value.experimentalAIApiModel = snAiCfg.apiModel
      cfg.value.experimentalAIApiMaxTokens = snAiCfg.apiMaxTokens
      cfg.value.experimentalAIApiTemperature = snAiCfg.apiTemperature
      logger.info("use siyuan-note ai config (legacy openAI)")
    } else if (siyuanProviders.length > 0) {
      // 新版 config.ai.providers[]：默认选 agent.modelId，无则取第一个启用模型的 provider
      cfg.value.experimentalUseSiyuanNoteAIConfig = true
      let resolved =
        resolveModelConfig(siyuanProviders, cfg.value.experimentalSisyuanAiActiveModelId) ||
        resolveModelConfig(siyuanProviders, aiCfg?.agent?.modelId)
      // 保证默认可用：若当前模型的 provider 无 apiKey，回退到第一个带密钥的启用 provider
      if (!resolved || !resolved.p.apiKey) {
        const withKey = siyuanProviders.find((p) => p.apiKey)
        if (withKey) {
          resolved = { p: withKey, m: withKey.models[0] }
        }
      }
      if (!resolved) {
        resolved = { p: siyuanProviders[0], m: siyuanProviders[0].models[0] }
      }
      cfg.value.experimentalAICode = resolved.p.apiKey
      cfg.value.experimentalAIBaseUrl = resolved.p.baseURL
      cfg.value.experimentalAIApiModel = resolved.m.name
      cfg.value.experimentalSisyuanAiActiveModelId = resolved.m.id
      logger.info("use siyuan-note ai config (providers)")
    } else {
      cfg.value.experimentalUseSiyuanNoteAIConfig = false
      logger.info("use custom ai config")
    }

    // 初始化默认配置
    cfg.value.showDocQuickMenu = Utils.emptyBooleanOrDefault(cfg.value.showDocQuickMenu, true)
    cfg.value.showQuickMenu = Utils.emptyBooleanOrDefault(cfg.value.showQuickMenu, true)
    cfg.value.showSingleMenu = Utils.emptyBooleanOrDefault(cfg.value.showSingleMenu, true)
    cfg.value.showBatchMenu = Utils.emptyBooleanOrDefault(cfg.value.showBatchMenu, true)
    cfg.value.showAIMenu = Utils.emptyBooleanOrDefault(cfg.value.showAIMenu, true)
    cfg.value.showExtendMenu = Utils.emptyBooleanOrDefault(cfg.value.showExtendMenu, true)
    return cfg
  }

  /**
   * 获取只读版本的思源笔记配置
   * 调用现有的 getPublishPreferenceSetting 并将其转化为只读引用
   *
   * @returns 只读引用的发布偏好设置
   * @author
   * @since 0.6.0
   */
  const getReadOnlyPublishPreferenceSetting = () => {
    const siyuanConfigRef = getPublishPreferenceSetting()
    const readOnlySiyuanConfigRef = readonly(siyuanConfigRef)
    return readOnlySiyuanConfigRef
  }

  return {
    getPublishPreferenceSetting,
    getReadOnlyPublishPreferenceSetting,
    getSisyuanAiProviders,
    selectSisyuanAiModel,
  }
}

export { usePreferenceSettingStore }
