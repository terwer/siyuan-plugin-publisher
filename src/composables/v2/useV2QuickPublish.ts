import { computed, reactive } from "vue"
import { HtmlUtil, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import WidgetPageUtils from "~/siyuan/utils/widgetPageUtils.ts"
import { usePublish } from "~/src/composables/usePublish.ts"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import { sortV2QuickPublish } from "~/src/composables/v2/platformOrdering.ts"
import {
  buildV2QuickPublishCaughtErrorText,
  buildV2QuickPublishErrorText,
  sanitizeV2QuickPublishText,
} from "~/src/composables/v2/quickPublishErrorText.ts"
import { notifyV2QuickPublishResult } from "~/src/composables/v2/useV2QuickPublishToast.ts"
import { useV2PublishValidation } from "~/src/composables/v2/useV2PublishValidation.ts"
import { DynamicConfig, DynamicJsonCfg, getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { openPathOrUrl } from "~/src/utils/pathUtils.ts"
import { openBrowserWindow } from "~/src/utils/widgetUtils.ts"
import { PreviewOpenModeEnum } from "zhi-blog-api"

export interface V2QuickPublishPlatformItem {
  platformKey: string
  platformName: string
  platformIcon?: string
  isAuthorized: boolean
  isPublished: boolean
  tooltipText?: string
  displayOrder?: number
  isPublishReady?: boolean
}

type V2PublishStatus =
  | "idle"
  | "preparing"
  | "publishing"
  | "success"
  | "success_with_warnings"
  | "failed"
  | "preview_ready"
type V2PublishAction = "" | "publish" | "update" | "delete" | "preview"

export const useV2QuickPublish = () => {
  const { getSetting } = usePublishSettingStore()
  const { kernelApi } = useSiyuanApi()
  const { blogApi } = useSiyuanApi()
  const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()
  const { t } = useV2I18n()
  const { doSinglePublish, doSingleDelete, initPublishMethods, getPostPreviewUrl } = usePublish()
  const { getPublishCfg, getPublishApi } = usePublishConfig()
  const publishValidation = useV2PublishValidation()
  const state = reactive({
    isLoading: true,
    pageId: "",
    docTitle: "",
    hasDocument: false,
    platformItems: [] as V2QuickPublishPlatformItem[],
    activePlatformKey: "",
    activePlatformName: "",
    previewLinkMap: {} as Record<string, string>,
    publishState: {
      status: "idle" as V2PublishStatus,
      platformKey: "",
      platformName: "",
      previewUrl: "",
      errMsg: "",
      errDetails: "",
      isPublishing: false,
      lastAction: "" as V2PublishAction,
    },
  })

  const pref = getReadOnlyPublishPreferenceSetting()

  const setPublishState = (partial: Partial<typeof state.publishState>) => {
    Object.assign(state.publishState, partial)
  }

  const emitPublishFeedback = () => {
    notifyV2QuickPublishResult(t, {
      status: state.publishState.status,
      platformName: state.publishState.platformName,
      lastAction: state.publishState.lastAction,
      errMsg: state.publishState.errMsg,
    })
  }

  const setActivePlatform = (item: V2QuickPublishPlatformItem) => {
    state.activePlatformKey = item.platformKey
    state.activePlatformName = item.platformName
    setPublishState({
      platformKey: item.platformKey,
      platformName: item.platformName,
    })
  }

  const updatePlatformPublishFlag = (platformKey: string, isPublished: boolean) => {
    const target = state.platformItems.find((item) => item.platformKey === platformKey)
    if (target) {
      target.isPublished = isPublished
    }
  }

  const setPreviewLink = (platformKey: string, link: string) => {
    if (!platformKey) {
      return
    }
    state.previewLinkMap[platformKey] = link
  }

  const resolvePreviewUrl = async (platformKey: string) => {
    const publishCfg = await getPublishCfg(platformKey)
    if (!publishCfg?.cfg) {
      throw new Error(t("v2.quickPublish.error.previewConfigMissing"))
    }
    const api = await getPublishApi(platformKey, publishCfg.cfg)
    const previewUrl = await getPostPreviewUrl(api, state.pageId, publishCfg.cfg)
    return { api, previewUrl }
  }

  /**
   * 初始化快发视图。
   *
   * @param overridePageId - 可选的指定文档 id：管理页按行发布时传入，
   *   覆盖「当前文档」的默认来源；缺省仍取活动文档（`WidgetPageUtils.getPageId()`）。
   *   状态机中 `state.pageId` 为唯一发布维度，快发/单发均据此发布。
   */
  const init = async (overridePageId?: string) => {
    state.isLoading = true

    try {
      const pageId = StrUtil.isEmptyString(overridePageId ?? "")
        ? WidgetPageUtils.getPageId() ?? ""
        : (overridePageId as string)
      state.pageId = pageId
      state.hasDocument = !StrUtil.isEmptyString(pageId)

      const setting = await getSetting()
      const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
      const dynamicConfigArray = dynJsonCfg?.totalCfg || []
      const enabledConfigArray = dynamicConfigArray.filter((item) => item.isEnabled)
      const postMeta = state.hasDocument ? ObjectUtil.getProperty(setting, pageId, {}) : {}
      const platformItems: V2QuickPublishPlatformItem[] = []

      for (const item of enabledConfigArray) {
        const postidKey = getDynPostidKey(item.platformKey)
        const postMetaValue = ObjectUtil.getProperty(postMeta, postidKey)
        const isAuthorized = item.isAuth === true
        const validation = isAuthorized
          ? await publishValidation.validatePlatformPublish(item.platformKey)
          : { canPublish: false, reason: t("v2.quickPublish.tooltip.unauthorized") }

        if (isAuthorized && validation.canPublish === true && !StrUtil.isEmptyString(postMetaValue)) {
          setPreviewLink(item.platformKey, String(postMetaValue))
        }

        const isPublishReady = isAuthorized && validation.canPublish === true

        platformItems.push({
          platformKey: item.platformKey,
          platformName: item.platformName,
          platformIcon: item.platformIcon,
          isAuthorized: isPublishReady,
          isPublished: isPublishReady && !StrUtil.isEmptyString(postMetaValue),
          tooltipText: isPublishReady ? "" : validation.reason || t("v2.publishValidation.incomplete"),
          displayOrder: item.displayOrder,
          isPublishReady,
        })
      }

      state.platformItems = sortV2QuickPublish(platformItems)

      if (state.hasDocument) {
        try {
          const postInfo = await kernelApi.getBlockByID(pageId)
          const rawTitle = postInfo?.content ?? t("v2.quickPublish.docTitle.untitled")
          state.docTitle = pref.value.fixTitle ? HtmlUtil.removeTitleNumber(rawTitle).replace(/\.md/g, "") : rawTitle
        } catch (e) {
          state.docTitle = t("v2.quickPublish.docTitle.untitled")
        }
      } else {
        state.docTitle = t("v2.quickPublish.docTitle.notDetected")
      }
    } catch (e) {
      state.docTitle = t("v2.quickPublish.docTitle.notDetected")
      state.hasDocument = false
    } finally {
      state.isLoading = false
    }
  }

  const hasPlatforms = computed(() => state.platformItems.length > 0)
  const canPublish = computed(() => state.hasDocument && !state.publishState.isPublishing)

  const publishToPlatform = async (item: V2QuickPublishPlatformItem) => {
    if (!canPublish.value || !item.isAuthorized) {
      return
    }

    setActivePlatform(item)
    setPublishState({
      status: "preparing",
      errMsg: "",
      errDetails: "",
      previewUrl: "",
      isPublishing: true,
      lastAction: item.isPublished ? "update" : "publish",
    })

    try {
      const publishCfg = await getPublishCfg(item.platformKey)
      if (!publishCfg?.cfg || !publishCfg?.dynCfg) {
        throw new Error(t("v2.quickPublish.error.publishConfigMissing"))
      }
      const validation = await publishValidation.validatePlatformPublish(item.platformKey)
      if (validation.canPublish !== true) {
        throw new Error(validation.reason || t("v2.publishValidation.incomplete"))
      }

      const siyuanPost = await blogApi.getPost(state.pageId)
      const preparedPost = await initPublishMethods.assignInitAttrs(siyuanPost, state.pageId, publishCfg)

      setPublishState({ status: "publishing" })

      const result = await doSinglePublish(item.platformKey, state.pageId, publishCfg, preparedPost)
      if (result?.status) {
        if (result.previewUrl) {
          setPreviewLink(item.platformKey, result.previewUrl)
        }
        updatePlatformPublishFlag(item.platformKey, true)
        // 发布成功但有图片上传错误时，设置为 success_with_warnings 状态
        const warningMsg = sanitizeV2QuickPublishText(result?.errMsg ?? "")
        const warningDetails = sanitizeV2QuickPublishText(result?.errDetails || result?.errMsg || "")
        const hasWarnings = !StrUtil.isEmptyString(warningMsg)
        setPublishState({
          status: hasWarnings ? "success_with_warnings" : "success",
          previewUrl: result.previewUrl ?? "",
          errMsg: warningMsg,
          errDetails: warningDetails,
          isPublishing: false,
        })
        emitPublishFeedback()
      } else {
        const errorText = buildV2QuickPublishErrorText({
          errMsg: result?.errMsg,
          errDetails: result?.errDetails,
          fallback: t("v2.quickPublish.error.publishFailed"),
        })
        setPublishState({
          status: "failed",
          errMsg: errorText.summary,
          errDetails: errorText.details,
          previewUrl: "",
          isPublishing: false,
        })
        emitPublishFeedback()
      }
    } catch (error) {
      const errorText = buildV2QuickPublishCaughtErrorText(error, t("v2.quickPublish.error.publishFailed"))
      setPublishState({
        status: "failed",
        errMsg: errorText.summary,
        errDetails: errorText.details,
        previewUrl: "",
        isPublishing: false,
      })
      emitPublishFeedback()
    }
  }

  const previewPlatform = async (item: V2QuickPublishPlatformItem, openImmediately = false) => {
    if (!state.hasDocument || state.publishState.isPublishing || !item.isPublished) {
      return
    }

    setActivePlatform(item)
    setPublishState({
      status: "preparing",
      errMsg: "",
      errDetails: "",
      previewUrl: "",
      isPublishing: true,
      lastAction: "preview",
    })

    try {
      const { api, previewUrl } = await resolvePreviewUrl(item.platformKey)
      if (!previewUrl) {
        throw new Error(t("v2.quickPublish.error.previewUrlMissing"))
      }

      setPreviewLink(item.platformKey, previewUrl)
      setPublishState({
        status: "preview_ready",
        previewUrl,
        errMsg: "",
        errDetails: "",
        isPublishing: false,
      })
      emitPublishFeedback()

      if (openImmediately) {
        // 会话绑定的查看链接（如公众号草稿编辑页）需在授权会话窗口内打开，否则会跳「请重新登录」。
        // 打开方式由适配器声明（默认 ExternalUrl/ExternalFile → 走统一打开），扩展点：适配器声明 previewOpenMode。
        if (api.previewOpenMode === PreviewOpenModeEnum.AppSession) {
          // forceElectronWindow=true：在 Electron 默认 session 窗口中打开（带授权 cookie），避免落到系统浏览器
          openBrowserWindow(previewUrl, undefined, undefined, undefined, false, true)
        } else {
          await openPathOrUrl(previewUrl, kernelApi)
        }
      }
    } catch (error) {
      const errorText = buildV2QuickPublishCaughtErrorText(error, t("v2.quickPublish.error.previewUrlMissing"))
      setPublishState({
        status: "failed",
        errMsg: errorText.summary,
        errDetails: errorText.details,
        previewUrl: "",
        isPublishing: false,
      })
      emitPublishFeedback()
    }
  }

  const retryLastPublish = async () => {
    const key = state.activePlatformKey
    if (!key) {
      return
    }
    const item = state.platformItems.find((platform) => platform.platformKey === key)
    if (item) {
      await publishToPlatform(item)
    }
  }

  const deletePlatform = async (item: V2QuickPublishPlatformItem) => {
    if (!canPublish.value || !item.isAuthorized || !item.isPublished) {
      return
    }

    setActivePlatform(item)
    setPublishState({
      status: "preparing",
      errMsg: "",
      errDetails: "",
      previewUrl: "",
      isPublishing: true,
      lastAction: "delete",
    })

    try {
      const publishCfg = await getPublishCfg(item.platformKey)
      if (!publishCfg?.cfg || !publishCfg?.dynCfg) {
        throw new Error(t("v2.quickPublish.error.deleteConfigMissing"))
      }

      const result = await doSingleDelete(item.platformKey, state.pageId, publishCfg)
      if (result?.status) {
        setPreviewLink(item.platformKey, "")
        updatePlatformPublishFlag(item.platformKey, false)
        setPublishState({
          status: "success",
          previewUrl: "",
          errMsg: "",
          errDetails: "",
          isPublishing: false,
        })
        emitPublishFeedback()
      } else {
        const errorText = buildV2QuickPublishErrorText({
          errMsg: result?.errMsg,
          errDetails: result?.errDetails,
          fallback: t("v2.quickPublish.error.deleteFailed"),
        })
        setPublishState({
          status: "failed",
          errMsg: errorText.summary,
          errDetails: errorText.details,
          previewUrl: "",
          isPublishing: false,
        })
        emitPublishFeedback()
      }
    } catch (error) {
      const errorText = buildV2QuickPublishCaughtErrorText(error, t("v2.quickPublish.error.deleteFailed"))
      setPublishState({
        status: "failed",
        errMsg: errorText.summary,
        errDetails: errorText.details,
        previewUrl: "",
        isPublishing: false,
      })
      emitPublishFeedback()
    }
  }

  return {
    state,
    hasPlatforms,
    init,
    publishToPlatform,
    previewPlatform,
    retryLastPublish,
    deletePlatform,
  }
}
