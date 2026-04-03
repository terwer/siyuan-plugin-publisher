import { computed, reactive } from "vue"
import { JsonUtil } from "zhi-common"
import { usePlatformDefine } from "~/src/composables/usePlatformDefine.ts"
import {
  deletePlatformByKey,
  DynamicConfig,
  DynamicJsonCfg,
  getNewPlatformKey,
  PlatformType,
  setDynamicJsonCfg,
  SubPlatformType,
} from "~/src/platforms/dynamicConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"

export type V2SettingsSection = "account" | "picbed" | "preference"
export type V2AccountView = "list" | "select" | "config"

export interface V2AccountItem {
  platformKey: string
  platformName: string
  platformIcon?: string
  isEnabled: boolean
  isAuth: boolean
  statusText: string
  statusType: "success" | "warning" | "error" | "neutral"
  statusLabel: string
}

export interface V2SelectablePlatform {
  key: "wordpress" | "cnblogs"
  platformKey: string
  platformName: string
  platformIcon?: string
  platformType: PlatformType
  subPlatformType: SubPlatformType
}

const WORDPRESS_PRESET_KEY = "wordpress_Wordpress"
const CNBLOGS_PRESET_KEY = "metaweblog_Cnblogs"

export const useV2Settings = () => {
  const { getSetting, updateSetting } = usePublishSettingStore()
  const { getPrePlatform } = usePlatformDefine()

  const state = reactive({
    section: "account" as V2SettingsSection,
    accountView: "list" as V2AccountView,
    accountHistoryStack: [] as V2AccountView[],
    requestState: "idle" as "idle" | "saving" | "failed" | "success",
    errorMessage: "",
    accountItems: [] as V2AccountItem[],
    selectedPlatformKey: "" as string,
    selectedPlatformName: "" as string,
    configMode: "create" as "create" | "edit",
    pendingConfigItem: null as DynamicConfig | null,
  })

  const selectablePlatforms = computed<V2SelectablePlatform[]>(() => [
    {
      key: "wordpress",
      platformKey: WORDPRESS_PRESET_KEY,
      platformName: "WordPress",
      platformIcon: getPrePlatform(WORDPRESS_PRESET_KEY)?.platformIcon,
      platformType: PlatformType.Wordpress,
      subPlatformType: SubPlatformType.Wordpress_Wordpress,
    },
    {
      key: "cnblogs",
      platformKey: CNBLOGS_PRESET_KEY,
      platformName: "博客园",
      platformIcon: getPrePlatform(CNBLOGS_PRESET_KEY)?.platformIcon,
      platformType: PlatformType.Metaweblog,
      subPlatformType: SubPlatformType.Metaweblog_Cnblogs,
    },
  ])

  const loadAccountItems = async () => {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []

    state.accountItems = dynamicConfigArray
      .filter((item) => item.platformType !== PlatformType.System)
      .map((item) => {
        const isEnabled = item.isEnabled === true
        const isAuth = item.isAuth === true
        
        // 根据状态确定类型和标签
        let statusType: "success" | "warning" | "error" | "neutral" = "neutral"
        let statusLabel = ""
        let statusText = ""
        
        if (isEnabled && isAuth) {
          statusType = "success"
          statusLabel = "运行中"
          statusText = "已启用 · 已授权"
        } else if (isEnabled && !isAuth) {
          statusType = "warning"
          statusLabel = "需授权"
          statusText = "已启用 · 未授权"
        } else if (!isEnabled && isAuth) {
          statusType = "neutral"
          statusLabel = "已禁用"
          statusText = "未启用 · 已授权"
        } else {
          statusType = "error"
          statusLabel = "未启用"
          statusText = "未启用 · 未授权"
        }
        
        return {
          platformKey: item.platformKey,
          platformName: item.platformName,
          platformIcon: item.platformIcon,
          isEnabled,
          isAuth,
          statusText,
          statusType,
          statusLabel,
        }
      })
  }

  const setSection = async (section: V2SettingsSection) => {
    state.section = section
    state.errorMessage = ""
    state.accountHistoryStack = []
    if (section === "account") {
      state.accountView = "list"
      await loadAccountItems()
    }
  }

  const openPlatformSelect = () => {
    state.accountHistoryStack.push(state.accountView)
    state.accountView = "select"
    state.errorMessage = ""
  }

  const openAccountConfig = async (platformKey: string, platformName: string) => {
    state.accountHistoryStack.push(state.accountView)
    state.selectedPlatformKey = platformKey
    state.selectedPlatformName = platformName
    state.configMode = "edit"
    state.accountView = "config"
  }

  const backInAccountFlow = async () => {
    const previousView = state.accountHistoryStack.pop()
    state.accountView = previousView ?? "list"
    if (state.accountView === "list") {
      await loadAccountItems()
    }
  }

  const toggleAccountEnabled = async (platformKey: string, nextEnabled: boolean) => {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []
    const target = dynamicConfigArray.find((item) => item.platformKey === platformKey)
    if (!target) {
      return
    }

    target.isEnabled = nextEnabled
    setting[DYNAMIC_CONFIG_KEY] = setDynamicJsonCfg(dynamicConfigArray)
    await updateSetting(setting)
    await loadAccountItems()
  }

  const createAccountDraft = async (platform: V2SelectablePlatform) => {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []

    const existingPreset = dynamicConfigArray.find((item) => item.platformKey === platform.platformKey)
    const base = JsonUtil.safeParse<DynamicConfig>(
      JSON.stringify(getPrePlatform(platform.platformKey) ?? {}),
      {} as DynamicConfig
    )

    if (!base.platformKey) {
      throw new Error("预设平台模板缺失")
    }

    if (existingPreset) {
      base.platformKey = getNewPlatformKey(platform.platformType, platform.subPlatformType)
      base.platformName = base.platformName || platform.platformName
    }

    base.platformType = platform.platformType
    base.subPlatformType = platform.subPlatformType
    base.isEnabled = false
    base.isAuth = false

    dynamicConfigArray.push(base)
    setting[DYNAMIC_CONFIG_KEY] = setDynamicJsonCfg(dynamicConfigArray)
    setting[base.platformKey] = setting[base.platformKey] ?? {}
    await updateSetting(setting)

    state.accountHistoryStack.push(state.accountView)
    state.pendingConfigItem = base
    state.selectedPlatformKey = base.platformKey
    state.selectedPlatformName = base.platformName
    state.configMode = "create"
    state.accountView = "config"
    await loadAccountItems()
  }

  const phase4DeleteDraft = async (platformKey: string) => {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []
    const nextConfigArray = deletePlatformByKey(dynamicConfigArray, platformKey)
    setting[DYNAMIC_CONFIG_KEY] = setDynamicJsonCfg(nextConfigArray)
    delete setting[platformKey]
    await updateSetting(setting)
    await loadAccountItems()
  }

  return {
    state,
    selectablePlatforms,
    loadAccountItems,
    setSection,
    openPlatformSelect,
    openAccountConfig,
    backInAccountFlow,
    toggleAccountEnabled,
    createAccountDraft,
    phase4DeleteDraft,
  }
}
