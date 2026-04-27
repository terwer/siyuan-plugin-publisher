import { computed, reactive } from "vue"
import { JsonUtil } from "zhi-common"
import { SUPPORTED_V2_BRIDGE_SUBTYPES } from "~/src/components/v2/settings/bridge/bridgeRegistry.ts"
import { usePlatformDefine } from "~/src/composables/usePlatformDefine.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
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
import { EnvUtil } from "~/src/utils/EnvUtil.ts"

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
  key: string
  platformKey: string
  platformName: string
  platformIcon?: string
  platformType: PlatformType
  subPlatformType: SubPlatformType
}

export const useV2Settings = () => {
  const { getSetting, updateSetting } = usePublishSettingStore()
  const { getAllPrePlatformList, getPrePlatform } = usePlatformDefine()
  const { t } = useV2I18n()

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

  const selectablePlatforms = computed<V2SelectablePlatform[]>(() => {
    const isElectron = EnvUtil.isSiyuanElectron()

    return getAllPrePlatformList()
      .filter((platform) => {
        if (!platform.subPlatformType) {
          return false
        }

        if (platform.platformType === PlatformType.System) {
          return false
        }

        if (!SUPPORTED_V2_BRIDGE_SUBTYPES.has(platform.subPlatformType)) {
          return false
        }

        if (platform.subPlatformType === SubPlatformType.Fs_LocalSystem && !isElectron) {
          return false
        }

        return true
      })
      .map((platform) => ({
        key: platform.platformKey,
        platformKey: platform.platformKey,
        platformName:
          platform.subPlatformType === SubPlatformType.Metaweblog_Cnblogs ? t("v2.platform.cnblogs") : platform.platformName,
        platformIcon: platform.platformIcon,
        platformType: platform.platformType,
        subPlatformType: platform.subPlatformType as SubPlatformType,
      }))
  })

  const loadAccountItems = async () => {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []

    state.accountItems = dynamicConfigArray
      .filter((item) => item.platformType !== PlatformType.System)
      .map((item) => {
        const isEnabled = item.isEnabled === true
        const isAuth = item.isAuth === true
        
        let statusType: "success" | "warning" | "error" | "neutral" = "neutral"
        let statusLabel = ""
        let statusText = ""
        
        if (isEnabled && isAuth) {
          statusType = "success"
          statusLabel = t("v2.account.status.running")
          statusText = t("v2.account.statusText.enabledAuthorized")
        } else if (isEnabled && !isAuth) {
          statusType = "warning"
          statusLabel = t("v2.account.status.needsAuthorization")
          statusText = t("v2.account.statusText.enabledUnauthorized")
        } else if (!isEnabled && isAuth) {
          statusType = "neutral"
          statusLabel = t("v2.account.status.disabled")
          statusText = t("v2.account.statusText.disabledAuthorized")
        } else {
          statusType = "error"
          statusLabel = t("v2.account.status.inactive")
          statusText = t("v2.account.statusText.disabledUnauthorized")
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
      throw new Error(t("v2.settings.error.presetTemplateMissing"))
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
