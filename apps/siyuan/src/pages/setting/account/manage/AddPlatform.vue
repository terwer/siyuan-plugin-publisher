<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2022-2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

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
// computed
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

// 监听 platformConfig 的变化
watch(
  platformConfig,
  (newConfig) => {
    // 更新克隆对象
    Object.assign(clonedPlatformConfig, newConfig)
    // 强制更新表单状态
    formState.platformConfig.value = { ...newConfig }
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
      // 更新克隆对象
      Object.assign(clonedPlatformConfig, config)
      // 强制更新表单状态
      formState.platformConfig.value = { ...config }
    }
  },
  { immediate: true },
)

// 平台组
const groups = platformGroups(t)
// 组下面的平台列表
const getPlatformOptionsByGroup = (group?: PlatformType) => {
  return allTemplates.filter((item) => item.platformType === group)
}

const platformOptions = computed(() => {
  return (
    getPlatformOptionsByGroup(formState.platformConfig.value.platformType)?.map(
      (item) => ({
        label: item.platformName,
        value: item.subPlatformType,
      }),
    ) ?? []
  )
})

const platformSettingFormGroup = reactive({
  title: t("account.single.platformSetting"),
  items: [
    {
      type: "input",
      label: t("account.single.platform.platformName"),
      value: computed(() => formState.platformConfig.value.platformName),
      placeholder: t("account.single.platform.platformNamePlaceholder"),
    },
    {
      type: "select",
      label: t("account.single.platform.platformType"),
      value: computed(() => formState.platformConfig.value.platformType),
      options: groups.map((item) => ({
        label: item.title,
        value: item.type,
      })),
      onChange: (value?: PlatformType) => {
        // 设置新的下拉
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
      onChange: (_value: string) => {
        // setCurrentConfigByKey(value)
      },
    },
    {
      type: "select",
      label: t("account.single.account.authMode"),
      value: computed(() => platformConfig.value.authMode),
      options: [
        {
          label: t("platformSelect.authMode.api"),
          value: AuthMode.API,
        },
        {
          label: t("platformSelect.authMode.web"),
          value: AuthMode.WEBSITE,
        },
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

const handleBack = () => {
  router.push({
    path: `/setting/account/templates`,
    query: {
      showBack: "true",
    },
  })
}

const handleSave = async () => {
  try {
    const newConfig = toRaw(_.cloneDeep(formState.platformConfig.value))
    const dbConfig = publishSettingStore.readonlyState[DYNAMIC_CONFIG_KEY]
    if (
      dbConfig?.totalCfg.find(
        (item) => item.platformKey === newConfig.platformKey,
      )
    ) {
      newConfig.platformName = generateUniquePlatformName(
        newConfig.platformName,
        dbConfig.totalCfg,
      )
      newConfig.platformKey = getNewPlatformKey(
        newConfig.platformType,
        newConfig.subPlatformType,
      )
    }

    // 保存平台配置
    const dynCfg = {
      totalCfg: [...(dbConfig?.totalCfg || [])],
      commonCfg: [...(dbConfig?.commonCfg || [])],
      githubCfg: [...(dbConfig?.githubCfg || [])],
      gitlabCfg: [...(dbConfig?.gitlabCfg || [])],
      metaweblogCfg: [...(dbConfig?.metaweblogCfg || [])],
      wordpressCfg: [...(dbConfig?.wordpressCfg || [])],
      customCfg: [...(dbConfig?.customCfg || [])],
      systemCfg: [...(dbConfig?.systemCfg || [])],
    } as DYNAMIC_CONFIG_TYPE

    // 根据平台类型添加到对应配置中
    switch (platformConfig.value.platformType) {
      case PlatformType.Common:
        // 通用平台
        dynCfg.totalCfg.push(newConfig)
        dynCfg.commonCfg.push(newConfig)
        break
      case PlatformType.Github:
        // Github
        dynCfg.totalCfg.push(newConfig)
        dynCfg.githubCfg.push(newConfig)
        break
      case PlatformType.Gitlab:
        // Gitlab
        dynCfg.totalCfg.push(newConfig)
        dynCfg.gitlabCfg.push(newConfig)
        break
      case PlatformType.Metaweblog:
        // Metaweblog
        dynCfg.totalCfg.push(newConfig)
        dynCfg.metaweblogCfg.push(newConfig)
        break
      case PlatformType.Wordpress:
        // WordPress
        dynCfg.totalCfg.push(newConfig)
        dynCfg.wordpressCfg.push(newConfig)
        break
      case PlatformType.Custom:
        // 自定义平台
        dynCfg.totalCfg.push(newConfig)
        dynCfg.customCfg.push(newConfig)
        break
      case PlatformType.System:
        // 系统平台
        break
      default:
    }
    const toUpdateConfig: Partial<SypConfig> = {
      [DYNAMIC_CONFIG_KEY]: dynCfg,
    }
    const ret = await publishSettingStore.updateAsync(toUpdateConfig)
    if (!ret.success) {
      throw new Error(ret.error)
    }

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

const unregisterPublishSettingStore = publishSettingStore.registerOnInit(
  async () => {},
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
