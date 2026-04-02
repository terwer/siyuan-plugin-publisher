import { computed, reactive } from "vue"
import { HtmlUtil, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { DynamicConfig, DynamicJsonCfg, getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import WidgetPageUtils from "~/siyuan/utils/widgetPageUtils.ts"
import { usePublish } from "~/src/composables/usePublish.ts"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { openPathOrUrl } from "~/src/utils/pathUtils.ts"

export interface V2QuickPublishPlatformItem {
  platformKey: string
  platformName: string
  platformIcon?: string
  isAuthorized: boolean
  isPublished: boolean
  tooltipText?: string
}

type V2PublishStatus = "idle" | "preparing" | "publishing" | "success" | "failed" | "preview_ready"
type V2PublishAction = "" | "publish" | "update" | "delete" | "preview"

export const useV2QuickPublish = () => {
  const { getSetting } = usePublishSettingStore()
  const { kernelApi } = useSiyuanApi()
  const { blogApi } = useSiyuanApi()
  const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()
  const { doSinglePublish, doSingleDelete, initPublishMethods, getPostPreviewUrl } = usePublish()
  const { getPublishCfg, getPublishApi } = usePublishConfig()

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
      isPublishing: false,
      lastAction: "" as V2PublishAction,
    },
  })

  const pref = getReadOnlyPublishPreferenceSetting()

  const normalizeError = (error: unknown) => {
    if (error instanceof Error) {
      return error.message || String(error)
    }
    return String(error ?? "未知错误")
  }

  const setPublishState = (partial: Partial<typeof state.publishState>) => {
    Object.assign(state.publishState, partial)
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
      throw new Error("平台配置缺失，无法获取预览链接")
    }
    const api = await getPublishApi(platformKey, publishCfg.cfg)
    return await getPostPreviewUrl(api, state.pageId, publishCfg.cfg)
  }


  const init = async () => {
    state.isLoading = true

    const pageId = WidgetPageUtils.getPageId() ?? ""
    state.pageId = pageId
    state.hasDocument = !StrUtil.isEmptyString(pageId)

    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []
    const enabledConfigArray = dynamicConfigArray.filter((item) => item.isEnabled)
    const postMeta = state.hasDocument ? ObjectUtil.getProperty(setting, pageId, {}) : {}

    state.platformItems = enabledConfigArray.map((item: DynamicConfig) => {
      const postidKey = getDynPostidKey(item.platformKey)
      const postMetaValue = ObjectUtil.getProperty(postMeta, postidKey)
      const isAuthorized = item.isAuth === true

      if (!StrUtil.isEmptyString(postMetaValue)) {
        setPreviewLink(item.platformKey, String(postMetaValue))
      }

      return {
        platformKey: item.platformKey,
        platformName: item.platformName,
        platformIcon: item.platformIcon,
        isAuthorized,
        isPublished: !StrUtil.isEmptyString(postMetaValue),
        tooltipText: isAuthorized ? "" : "未授权，请点击右上角设置，进入账号设置完成授权后再使用快速发布。",
      }
    })

    if (state.hasDocument) {
      const postInfo = await kernelApi.getBlockByID(pageId)
      const rawTitle = postInfo?.content ?? "未命名文档"
      state.docTitle = pref.value.fixTitle ? HtmlUtil.removeTitleNumber(rawTitle).replace(/\.md/g, "") : rawTitle
    } else {
      state.docTitle = "未检测到当前文档"
    }

    state.isLoading = false
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
      previewUrl: "",
      isPublishing: true,
      lastAction: item.isPublished ? "update" : "publish",
    })

    try {
      const publishCfg = await getPublishCfg(item.platformKey)
      if (!publishCfg?.cfg || !publishCfg?.dynCfg) {
        throw new Error("平台配置缺失，无法发布")
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
        setPublishState({
          status: "success",
          previewUrl: result.previewUrl ?? "",
          errMsg: "",
          isPublishing: false,
        })
      } else {
        setPublishState({
          status: "failed",
          errMsg: result?.errMsg || "发布失败",
          previewUrl: "",
          isPublishing: false,
        })
      }
    } catch (error) {
      setPublishState({
        status: "failed",
        errMsg: normalizeError(error),
        previewUrl: "",
        isPublishing: false,
      })
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
      previewUrl: "",
      isPublishing: true,
      lastAction: "preview",
    })

    try {
      const previewUrl = await resolvePreviewUrl(item.platformKey)
      if (!previewUrl) {
        throw new Error("未获取到预览链接")
      }

      setPreviewLink(item.platformKey, previewUrl)
      setPublishState({
        status: "preview_ready",
        previewUrl,
        errMsg: "",
        isPublishing: false,
      })

      if (openImmediately) {
        await openPathOrUrl(previewUrl, kernelApi)
      }
    } catch (error) {
      setPublishState({
        status: "failed",
        errMsg: normalizeError(error),
        previewUrl: "",
        isPublishing: false,
      })
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
      previewUrl: "",
      isPublishing: true,
      lastAction: "delete",
    })

    try {
      const publishCfg = await getPublishCfg(item.platformKey)
      if (!publishCfg?.cfg || !publishCfg?.dynCfg) {
        throw new Error("平台配置缺失，无法删除")
      }

      const result = await doSingleDelete(item.platformKey, state.pageId, publishCfg)
      if (result?.status) {
        setPreviewLink(item.platformKey, "")
        updatePlatformPublishFlag(item.platformKey, false)
        setPublishState({
          status: "success",
          previewUrl: "",
          errMsg: "",
          isPublishing: false,
        })
      } else {
        setPublishState({
          status: "failed",
          errMsg: result?.errMsg || "删除失败",
          previewUrl: "",
          isPublishing: false,
        })
      }
    } catch (error) {
      setPublishState({
        status: "failed",
        errMsg: normalizeError(error),
        previewUrl: "",
        isPublishing: false,
      })
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
