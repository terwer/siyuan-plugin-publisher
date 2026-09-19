/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { PublishValidationResult } from "zhi-blog-api"
import { JsonUtil } from "zhi-common"
import Adaptors from "~/src/adaptors"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import { DynamicConfig, setDynamicJsonCfg } from "~/src/platforms/dynamicConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { Utils } from "~/src/utils/utils.ts"

export interface V2PublishValidationGateResult extends PublishValidationResult {
  isAuth: boolean
  dynCfg?: DynamicConfig
}

export const useV2PublishValidation = () => {
  const { getPublishCfg } = usePublishConfig()
  const { updateSetting } = usePublishSettingStore()
  const { t } = useV2I18n()
  const appInstance = new PublisherAppInstance()

  const validatePlatformPublish = async (platformKey: string): Promise<V2PublishValidationGateResult> => {
    const publishCfg = await getPublishCfg(platformKey)
    const dynCfg = publishCfg.dynCfg

    if (!publishCfg.cfg || !dynCfg?.platformKey) {
      return {
        canPublish: false,
        isAuth: false,
        dynCfg,
        reason: t("v2.publishValidation.incomplete"),
      }
    }

    const apiAdaptor = await Adaptors.getAdaptor(platformKey, publishCfg.cfg)
    const api = Utils.blogApi(appInstance, apiAdaptor)
    const validation = await api.validatePublish()

    return {
      ...validation,
      isAuth: dynCfg.isAuth === true,
      dynCfg,
      canPublish: dynCfg.isAuth === true && validation.canPublish === true,
      reason:
        dynCfg.isAuth === true
          ? validation.reason
          : validation.reason || t("v2.quickPublish.tooltip.unauthorized"),
    }
  }

  const enableAccountAfterPublishValidation = async (platformKey: string, dynCfg: DynamicConfig) => {
    const publishCfg = await getPublishCfg(platformKey)
    const setting = publishCfg.setting
    const dynamicConfigArray = publishCfg.dynamicConfigArray || []
    const nextDynamicConfigArray = dynamicConfigArray.map((item) => {
      if (item.platformKey !== platformKey) {
        return item
      }
      return {
        ...item,
        ...JsonUtil.safeParse<DynamicConfig>(JSON.stringify(dynCfg), dynCfg),
        isAuth: true,
        isEnabled: true,
      }
    })

    setting[DYNAMIC_CONFIG_KEY] = setDynamicJsonCfg(nextDynamicConfigArray)
    await updateSetting(setting)
  }

  return {
    validatePlatformPublish,
    enableAccountAfterPublishValidation,
  }
}
