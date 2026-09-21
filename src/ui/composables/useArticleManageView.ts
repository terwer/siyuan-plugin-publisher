/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ref } from "vue"
import { JsonUtil } from "zhi-common"
import { usePublish } from "~/src/composables/usePublish.ts"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { useSiyuanSettingStore } from "~/src/stores/useSiyuanSettingStore.ts"
import { MessageError, MessageSuccess, MessageWarning } from "~/src/ui/composables/floatingUi.ts"
import { DynamicJsonCfg } from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { openPathOrUrl } from "~/src/utils/pathUtils.ts"

/**
 * 文章管理的原生动作落地。
 *
 * V1 的「管理」动作（quick/single/batch/view/picgo）在当前界面中以原生方式实现，
 * 禁止向 V1 兜底。发布类动作统一经 `usePublish.doSinglePublish`，天然受
 * 「发布源笔记本」硬校验保护（issue #2044）。
 *
 * - quick/single/window-empty：由管理视图发向上层，切换快发视图并加载指定文档。
 * - batch：把指定文档发布到全部启用+已授权平台（原生批量流）。
 * - platform-single：把指定文档发布到指定平台。
 * - view：打开 siyuan-blog 文章预览链接（原生，非 iframe 兜底）。
 * - picgo：打开图床工具（原生）。
 *
 * @public
 */
export const useArticleManageView = () => {
  const { getSetting } = usePublishSettingStore()
  const { getReadOnlySiyuanSetting } = useSiyuanSettingStore()
  const { blogApi, kernelApi } = useSiyuanApi()
  const { doSinglePublish, initPublishMethods } = usePublish()
  const { getPublishCfg } = usePublishConfig()
  const { t } = useAppI18n()

  const isBatchPublishing = ref(false)

  /**
   * 获取全部启用且已授权的平台配置。
   */
  const getReadyPlatforms = async () => {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    return (dynJsonCfg?.totalCfg || []).filter((item) => item.isEnabled === true && item.isAuth === true)
  }

  /**
   * 发布单个平台（原生，复用 usePublish 统一发布流）。
   */
  const publishOnePlatform = async (platformKey: string, pageId: string) => {
    const publishCfg = await getPublishCfg(platformKey)
    if (!publishCfg?.cfg || !publishCfg?.dynCfg) {
      throw new Error(t("articleManage.error.configMissing"))
    }

    const siyuanPost = await blogApi.getPost(pageId)
    const preparedPost = await initPublishMethods.assignInitAttrs(siyuanPost, pageId, publishCfg)
    return await doSinglePublish(platformKey, pageId, publishCfg, preparedPost)
  }

  /**
   * 批量发布：把指定文档发布到全部启用+已授权平台。
   *
   * @param pageId - 思源源文档 id
   */
  const publishBatchToAll = async (pageId: string) => {
    if (isBatchPublishing.value) {
      return
    }

    isBatchPublishing.value = true
    try {
      const readyPlatforms = await getReadyPlatforms()
      if (readyPlatforms.length === 0) {
        MessageWarning(t("articleManage.batch.noPlatforms"))
        return
      }

      let ok = 0
      const errors: string[] = []
      for (const platform of readyPlatforms) {
        try {
          const result = await publishOnePlatform(platform.platformKey, pageId)
          if (result?.status) {
            ok++
          } else {
            errors.push(`${platform.platformName}: ${result?.errMsg ?? ""}`)
          }
        } catch (e) {
          errors.push(`${platform.platformName}: ${e instanceof Error ? e.message : String(e)}`)
        }
      }

      if (errors.length === 0) {
        MessageSuccess(t("articleManage.batch.success", { count: ok }))
      } else {
        MessageWarning(t("articleManage.batch.partial", { ok, fail: errors.length }))
        const detail = errors.join("\n")
        if (readyPlatforms.length === 1) {
          MessageError(detail)
        } else {
          await kernelApi.pushErrMsg({ msg: detail, timeout: 7000 })
        }
      }
    } finally {
      isBatchPublishing.value = false
    }
  }

  /**
   * 发布到指定平台（管理页 yaml 处点击单个平台）。
   */
  const publishToSinglePlatform = async (platformKey: string, pageId: string) => {
    try {
      const result = await publishOnePlatform(platformKey, pageId)
      if (result?.status) {
        MessageSuccess(t("articleManage.platformSingle.success", { name: result.name ?? "" }))
      } else {
        MessageError(result?.errMsg || t("articleManage.platformSingle.failed"))
      }
    } catch (e) {
      MessageError(e instanceof Error ? e.message : String(e))
    }
  }

  /**
   * 查看文章：打开 siyuan-blog 的预览链接（原生新窗口）。
   */
  const viewArticle = async (pageId: string) => {
    const apiUrl = getReadOnlySiyuanSetting().value.apiUrl
    const url = `${apiUrl}/plugins/siyuan-blog/app/#/post/${pageId}`
    await openPathOrUrl(url, kernelApi)
  }

  /**
   * 打开图床工具（原生）。
   */
  const openPicgo = async (pageId: string) => {
    const apiUrl = getReadOnlySiyuanSetting().value.apiUrl
    const url = `${apiUrl}/plugins/siyuan-plugin-picgo/#/?pageId=${pageId}`
    await openPathOrUrl(url, kernelApi)
  }

  return {
    isBatchPublishing,
    publishBatchToAll,
    publishToSinglePlatform,
    viewArticle,
    openPicgo,
  }
}
