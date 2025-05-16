<script setup lang="ts">
import { DYNAMIC_CONFIG_KEY } from "@/Constants.ts"
import {
  AuthMode,
  DynamicConfig,
  generateUniquePlatformName,
  getNewPlatformKey,
  PlatformType,
} from "@/models/dynamicConfig.ts"
import { DYNAMIC_CONFIG_TYPE, SypConfig } from "@/models/SypConfig.ts"
import {
  findAllTemplates,
  findConfigByKey,
  platformGroups,
  platformTemplates,
} from "@/presets/platformTemplates.ts"
import { alert } from "@components/Alert.ts"
import BackPage from "@components/BackPage.vue"
import Button from "@components/Button.vue"
import FormGroup from "@components/FormGroup.vue"
import { useClonedForm } from "@composables/useClonedForm.ts"
import { useI18n } from "@composables/useI18n.ts"
import { TabEnum } from "@enums/TabEnum.ts"
import { usePublishSettingStore } from "@stores/usePublishSettingStore.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import * as _ from "lodash-es"
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRaw,
  watch,
} from "vue"
import { useRoute, useRouter } from "vue-router"
import { BlogConfig } from "zhi-blog-api"

const props = defineProps<{
  pluginInstance: any
}>()

const logger = createAppLogger("add-platform")
const { t } = useI18n(props.pluginInstance)
const router = useRouter()
const route = useRoute()
const errorMsg = ref("")
const extra = ref([])
const publishSettingStore = usePublishSettingStore()

// 预定义
const templates = platformTemplates(t)
const allTemplates = findAllTemplates(templates)
// 当前平台
const templateKey = ref(route.params.templateKey as string)

// 获取平台配置只读版本
const platformConfig = computed(() => {
  const config = findConfigByKey(templateKey.value, templates) as DynamicConfig
  if (!config) {
    console.warn(`No config found for templateKey: ${templateKey.value}`)
    return {} as DynamicConfig
  }
  return config
})

// 创建一个响应式的克隆对象
const clonedPlatformConfig = reactive({ ...platformConfig.value })
const clonedBlogConfig = reactive({} as BlogConfig)

const formState = {
  platformConfig: useClonedForm(clonedPlatformConfig),
  blogConfig: useClonedForm(clonedBlogConfig),
}

// 更新克隆对象 + 表单状态
const updateClonedPlatformConfig = (config: DynamicConfig) => {
  Object.assign(clonedPlatformConfig, config)
  formState.platformConfig.value = { ...config }
}

// 处理唯一性逻辑
const handleEnsureUniqueness = (config: DynamicConfig) => {
  const dbConfig = publishSettingStore.readonlyState[DYNAMIC_CONFIG_KEY]
  if (
    dbConfig &&
    dbConfig.totalCfg.some((item) => item.platformKey === config.platformKey)
  ) {
    config.platformName = generateUniquePlatformName(
      config.platformName,
      dbConfig.totalCfg,
    )
    config.platformKey = getNewPlatformKey(
      config.platformType,
      config.subPlatformType,
    )
  }
}

// 监听 platformConfig 的变化
watch(
  platformConfig,
  (newConfig) => {
    const config = toRaw(_.cloneDeep(newConfig))
    handleEnsureUniqueness(config)
    updateClonedPlatformConfig(config)
    logger.info("platformConfig changed to:", config)
  },
  { deep: true, immediate: true },
)

// 监听 templateKey 的变化
watch(
  templateKey,
  (newKey) => {
    logger.info("templateKey changed to:", newKey)
    const config = findConfigByKey(newKey, templates) as DynamicConfig
    if (config) {
      const newConfig = _.cloneDeep(config)
      handleEnsureUniqueness(newConfig)
      updateClonedPlatformConfig(newConfig)
    }
  },
  { immediate: true },
)

// 平台组 & 子平台选项
const groups = platformGroups(t)
const getPlatformOptionsByGroup = (group?: PlatformType) =>
  allTemplates.filter((item) => item.platformType === group)

const platformOptions = computed(
  () =>
    getPlatformOptionsByGroup(formState.platformConfig.value.platformType)?.map(
      (item) => {
        // 使用原始模板中的 platformName，而不是引用对象上的
        const originalTemplate = allTemplates.find(
          (t) => t.subPlatformType === item.subPlatformType,
        )
        return {
          label: originalTemplate?.platformName ?? item.platformName,
          value: item.subPlatformType,
        }
      },
    ) ?? [],
)

// 构建表单项工厂函数
function createFormItem(
  labelKey: string,
  field: keyof DynamicConfig,
  type: string = "input",
) {
  return {
    type,
    label: t(labelKey),
    value: computed(() => formState.platformConfig.value[field]),
    placeholder: t(`${labelKey}Placeholder`),
  }
}

// 平台设置表单组
const platformSettingFormGroup = reactive({
  title: t("account.single.platformSetting"),
  items: [
    {
      type: "select",
      label: t("account.single.platform.platformType"),
      value: computed(() => formState.platformConfig.value.platformType),
      options: groups.map((item) => ({ label: item.title, value: item.type })),
      onChange: (value?: PlatformType) => {
        const newPlatformOptions = getPlatformOptionsByGroup(value)
        if (newPlatformOptions.length > 0) {
          templateKey.value =
            newPlatformOptions[0].platformKey?.toString() ?? ""
        }
      },
    },
    {
      type: "select",
      label: t("account.single.platform.subPlatformType"),
      value: computed(() => formState.platformConfig.value.subPlatformType),
      options: platformOptions,
      onChange: (value: string) => {
        const config = allTemplates.find(
          (item) => item.subPlatformType === value,
        )
        if (config) {
          const newConfig = _.cloneDeep(config)
          handleEnsureUniqueness(newConfig)
          updateClonedPlatformConfig(newConfig)
        }
      },
    },
    createFormItem("account.single.platform.platformName", "platformName"),
    {
      type: "select",
      label: t("account.single.account.authMode"),
      value: computed(() => platformConfig.value.authMode),
      options: [
        { label: t("platformSelect.authMode.api"), value: AuthMode.API },
        { label: t("platformSelect.authMode.web"), value: AuthMode.WEBSITE },
      ],
      onChange: (value: AuthMode) => {
        platformConfig.value.authMode = value
      },
      readonly: true,
      disabled: true,
    },
  ],
})

const accountSettingFormGroup = reactive({
  title: t("account.single.accountSetting"),
  items: [],
})

const formGroups = [platformSettingFormGroup, accountSettingFormGroup]

// 返回上一页
const handleBack = () => {
  router.push({
    path: `/setting/account/templates`,
    query: { showBack: "true" },
  })
}

// 平台类型到配置字段映射
const platformTypeToConfigKeyMap: Record<
  PlatformType,
  keyof DYNAMIC_CONFIG_TYPE
> = {
  [PlatformType.Common]: "commonCfg",
  [PlatformType.Github]: "githubCfg",
  [PlatformType.Gitlab]: "gitlabCfg",
  [PlatformType.Metaweblog]: "metaweblogCfg",
  [PlatformType.Wordpress]: "wordpressCfg",
  [PlatformType.Custom]: "customCfg",
  [PlatformType.System]: "systemCfg",
}

// 保存配置
const handleSave = async () => {
  try {
    const newConfig = toRaw(_.cloneDeep(formState.platformConfig.value))
    const dbConfig = publishSettingStore.readonlyState[DYNAMIC_CONFIG_KEY]

    const dynCfg: DYNAMIC_CONFIG_TYPE = {
      totalCfg: [...(dbConfig?.totalCfg || [])],
      commonCfg: [...(dbConfig?.commonCfg || [])],
      githubCfg: [...(dbConfig?.githubCfg || [])],
      gitlabCfg: [...(dbConfig?.gitlabCfg || [])],
      metaweblogCfg: [...(dbConfig?.metaweblogCfg || [])],
      wordpressCfg: [...(dbConfig?.wordpressCfg || [])],
      customCfg: [...(dbConfig?.customCfg || [])],
      systemCfg: [...(dbConfig?.systemCfg || [])],
    }

    const platformType = platformConfig.value.platformType
    const configKey = platformTypeToConfigKeyMap[platformType]

    if (!configKey) {
      throw new Error(t("platform.failed.notSupportedGroup"))
    }
    dynCfg.totalCfg.push(newConfig)

    const newBlogCfg = toRaw(_.cloneDeep(formState.blogConfig.value))
    const toUpdateConfig: Partial<SypConfig> = {
      [DYNAMIC_CONFIG_KEY]: dynCfg,
      // 初始化一个空配置
      [newConfig.platformKey]: newBlogCfg,
    }

    const ret = await publishSettingStore.updateAsync(toUpdateConfig)
    if (!ret.success) throw new Error(ret.error)

    void router.push(`/?tab=${TabEnum.ACCOUNT}`)
    void alert({
      title: t("common.opt.ok"),
      message: t("platform.addOk"),
      type: "success",
    })
  } catch (e) {
    void alert({
      title: t("common.error"),
      message: e || t("common.saveFailed"),
      type: "error",
      position: "center",
    })
  }
}

// 初始化处理唯一性
const unregisterPublishSettingStore = publishSettingStore.registerOnInit(
  async () => {
    const dbConfig = publishSettingStore.readonlyState[DYNAMIC_CONFIG_KEY]
    if (dbConfig) {
      const templateConfig = findConfigByKey(templateKey.value, templates)
      const newConfig = _.cloneDeep(templateConfig)
      handleEnsureUniqueness(newConfig)
      updateClonedPlatformConfig(newConfig)
    }
  },
)

onMounted(async () => {
  await publishSettingStore.doInit()
  logger.debug("publish setting init")
})

// 组件卸载时注销回调
onUnmounted(() => {
  unregisterPublishSettingStore()
})
</script>

<template>
  <BackPage
    :plugin-instance="pluginInstance"
    :title="t('platform.add')"
    :has-back-emit="true"
    help-key="platform.add"
    :extra="extra"
    :error="errorMsg"
    @back-emit="handleBack"
  >
    <form-group
      v-for="(group, index) in formGroups"
      :key="index"
      :plugin-instance="pluginInstance"
      :form-group="group"
    />
    <div class="form-actions">
      <Button size="md" @click="handleSave">
        {{ t("common.save") }}
      </Button>
    </div>
  </BackPage>
</template>

<style lang="stylus" scoped>
.form-container
  max-width: 600px
  margin: 0 auto

  .form-group
    margin-bottom: 1.5rem

    label
      display: block
      margin-bottom: 0.5rem
      color: var(--pt-platform-text)
      font-weight: 500

    input, select
      width: 100%
      padding: 0.75rem
      border: 1px solid var(--pt-platform-border)
      border-radius: 4px
      background: var(--pt-platform-surface)
      color: var(--pt-platform-text)
      font-size: 1rem
      transition: all 0.2s

      &:focus
        outline: none
        border-color: var(--pt-platform-accent)
        box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2)

.form-actions
  display: flex
  justify-content: flex-end
  margin-top: 2rem
</style>
