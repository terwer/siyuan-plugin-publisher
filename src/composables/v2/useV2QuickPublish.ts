import { computed, reactive } from "vue"
import { HtmlUtil, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { DynamicConfig, DynamicJsonCfg, getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import WidgetPageUtils from "~/siyuan/utils/widgetPageUtils.ts"

export interface V2QuickPublishPlatformItem {
  platformKey: string
  platformName: string
  platformIcon?: string
  isPublished: boolean
}

export const useV2QuickPublish = () => {
  const { getSetting } = usePublishSettingStore()
  const { kernelApi } = useSiyuanApi()
  const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()

  const state = reactive({
    isLoading: true,
    pageId: "",
    docTitle: "",
    hasDocument: false,
    platformItems: [] as V2QuickPublishPlatformItem[],
  })

  const pref = getReadOnlyPublishPreferenceSetting()

  const init = async () => {
    state.isLoading = true

    const pageId = WidgetPageUtils.getPageId() ?? ""
    state.pageId = pageId
    state.hasDocument = !StrUtil.isEmptyString(pageId)

    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []
    const enabledConfigArray = dynamicConfigArray.filter((item) => item.isEnabled && item.isAuth)
    const postMeta = state.hasDocument ? ObjectUtil.getProperty(setting, pageId, {}) : {}

    state.platformItems = enabledConfigArray.map((item: DynamicConfig) => {
      const postidKey = getDynPostidKey(item.platformKey)
      const postMetaValue = ObjectUtil.getProperty(postMeta, postidKey)

      return {
        platformKey: item.platformKey,
        platformName: item.platformName,
        platformIcon: item.platformIcon,
        isPublished: !StrUtil.isEmptyString(postMetaValue),
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

  return {
    state,
    hasPlatforms,
    init,
  }
}
