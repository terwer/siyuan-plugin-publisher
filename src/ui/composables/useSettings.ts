import { computed, reactive } from "vue"
import { JsonUtil } from "zhi-common"
import { SUPPORTED_BRIDGE_SUBTYPES } from "~/src/ui/components/settings/bridge/bridgeRegistry.ts"
import { assignDisplayOrders, getNextDisplayOrder, sortAccounts } from "~/src/ui/composables/platformOrdering.ts"
import { resolvePrePlatformI18nField, usePlatformDefine } from "~/src/composables/usePlatformDefine.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
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

export type SettingsSection = "account" | "picbed" | "preference" | "ai" | "about"
export type AccountView = "list" | "select" | "config"

export interface AccountItem {
  platformKey: string
  platformName: string
  platformIcon?: string
  isEnabled: boolean
  isAuth: boolean
  statusText: string
  statusType: "success" | "warning" | "error" | "neutral"
  statusLabel: string
  description: string
  displayOrder?: number
}

export interface SelectablePlatform {
  key: string
  platformKey: string
  platformName: string
  description: string
  platformIcon?: string
  platformType: PlatformType
  subPlatformType: SubPlatformType
}

export const useSettings = () => {
  const { getSetting, updateSetting } = usePublishSettingStore()
  const { getAllPrePlatformList, getPrePlatform, getPrePlatformByKeyOrSubtype } = usePlatformDefine()
  const { t } = useAppI18n()

  const state = reactive({
    section: "account" as SettingsSection,
    accountView: "list" as AccountView,
    accountHistoryStack: [] as AccountView[],
    configReturnTarget: null as "quick_publish" | "account_list" | null,
    requestState: "idle" as "idle" | "saving" | "failed" | "success",
    errorMessage: "",
    accountItems: [] as AccountItem[],
    selectedPlatformKey: "" as string,
    selectedPlatformName: "" as string,
    configMode: "create" as "create" | "edit",
    pendingConfigItem: null as DynamicConfig | null,
  })

  const resolvePlatformDescription = (item: Pick<DynamicConfig, "description" | "i18n" | "platformKey" | "subPlatformType" | "platformName">, fallbackName?: string) => {
    const translatedDescription = resolvePrePlatformI18nField(item, "description", t)
    if (translatedDescription) {
      return translatedDescription
    }

    const description = item.description?.trim()
    if (description) {
      return description
    }

    const preset = getPrePlatformByKeyOrSubtype(item.platformKey, item.subPlatformType)
    const presetDescription = preset?.description?.trim()
    if (presetDescription) {
      return presetDescription
    }

    const platformName = fallbackName || item.platformName || item.platformKey
    return t("platformSelect.platformDesc.fallback", { name: platformName })
  }

  const selectablePlatforms = computed<SelectablePlatform[]>(() => {
    const isElectron = EnvUtil.isSiyuanElectron()

    return getAllPrePlatformList()
      .filter((platform) => {
        if (!platform.subPlatformType) {
          return false
        }

        if (platform.platformType === PlatformType.System) {
          return false
        }

        if (!SUPPORTED_BRIDGE_SUBTYPES.has(platform.subPlatformType)) {
          return false
        }

        if (platform.subPlatformType === SubPlatformType.Fs_LocalSystem && !isElectron) {
          return false
        }

        return true
      })
      .map((platform) => {
        const platformName =
          platform.subPlatformType === SubPlatformType.Metaweblog_Cnblogs ? t("platform.cnblogs") : platform.platformName

        return {
          key: platform.platformKey,
          platformKey: platform.platformKey,
          platformName,
          description: resolvePlatformDescription(platform, platformName),
          platformIcon: platform.platformIcon,
          platformType: platform.platformType,
          subPlatformType: platform.subPlatformType as SubPlatformType,
        }
      })
  })

  const loadAccountItems = async () => {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []

    const accountConfigs = dynamicConfigArray
      .filter((item) => item.platformType !== PlatformType.System)
      .map((item) => {
        const isEnabled = item.isEnabled === true
        const isAuth = item.isAuth === true
        
        let statusType: "success" | "warning" | "error" | "neutral" = "neutral"
        let statusLabel = ""
        let statusText = ""
        
        if (isEnabled && isAuth) {
          statusType = "success"
          statusLabel = t("account.status.running")
          statusText = t("account.statusText.enabledAuthorized")
        } else if (isEnabled && !isAuth) {
          statusType = "warning"
          statusLabel = t("account.status.needsAuthorization")
          statusText = t("account.statusText.enabledUnauthorized")
        } else if (!isEnabled && isAuth) {
          statusType = "neutral"
          statusLabel = t("account.status.disabled")
          statusText = t("account.statusText.disabledAuthorized")
        } else {
          statusType = "error"
          statusLabel = t("account.status.inactive")
          statusText = t("account.statusText.disabledUnauthorized")
        }
        
        return {
          platformKey: item.platformKey,
          platformName: item.platformName,
          platformIcon: item.platformIcon,
          description: resolvePlatformDescription(item),
          isEnabled,
          isAuth,
          statusText,
          statusType,
          statusLabel,
          displayOrder: item.displayOrder,
        }
      })

    state.accountItems = sortAccounts(accountConfigs)
  }

  const setSection = async (section: SettingsSection) => {
    state.section = section
    state.errorMessage = ""
    state.accountHistoryStack = []
    state.configReturnTarget = null
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

  const openAccountConfig = async (platformKey: string, platformName: string, returnTarget?: "quick_publish" | "account_list") => {
    if (returnTarget === "quick_publish") {
      state.configReturnTarget = "quick_publish"
    } else {
      state.configReturnTarget = null
      state.accountHistoryStack.push(state.accountView)
    }
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

  const getConfigReturnTarget = () => {
    return state.configReturnTarget
  }

  const clearConfigReturnTarget = () => {
    state.configReturnTarget = null
  }

  const finishAccountConfig = async () => {
    state.accountView = "list"
    state.accountHistoryStack = []
    state.configReturnTarget = null
    state.configMode = "edit"
    state.pendingConfigItem = null
    await loadAccountItems()
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

  const reorderAccounts = async (orderedPlatformKeys: string[]) => {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []
    const nextConfigArray = assignDisplayOrders(dynamicConfigArray, orderedPlatformKeys)
    setting[DYNAMIC_CONFIG_KEY] = setDynamicJsonCfg(nextConfigArray)
    await updateSetting(setting)
    await loadAccountItems()
  }

  const createAccountDraft = async (platform: SelectablePlatform) => {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []

    const existingPreset = dynamicConfigArray.find((item) => item.platformKey === platform.platformKey)
    const base = JsonUtil.safeParse<DynamicConfig>(
      JSON.stringify(getPrePlatform(platform.platformKey) ?? {}),
      {} as DynamicConfig
    )

    if (!base.platformKey) {
      throw new Error(t("settings.error.presetTemplateMissing"))
    }

    if (existingPreset) {
      base.platformKey = getNewPlatformKey(platform.platformType, platform.subPlatformType)
      base.platformName = base.platformName || platform.platformName
    }

    base.platformType = platform.platformType
    base.subPlatformType = platform.subPlatformType
    base.isEnabled = false
    base.isAuth = false
    base.displayOrder = getNextDisplayOrder(dynamicConfigArray)

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
    getConfigReturnTarget,
    clearConfigReturnTarget,
    finishAccountConfig,
    toggleAccountEnabled,
    reorderAccounts,
    createAccountDraft,
    phase4DeleteDraft,
  }
}
