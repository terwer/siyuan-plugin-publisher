<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { DYNAMIC_CONFIG_KEY } from "@/Constants.ts"
import {
  DynamicConfig,
  getSubPlatformTypeByKey,
} from "@/models/dynamicConfig.ts"
import BackPage from "@components/BackPage.vue"
import Button from "@components/Button.vue"
import { useI18n } from "@composables/useI18n.ts"
import { TabEnum } from "@enums/TabEnum.ts"
import { usePublishSettingStore } from "@stores/usePublishSettingStore.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { computed, onMounted, reactive, ref, toRaw, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { BlogConfig } from "zhi-blog-api"
import FormGroup from "@components/FormGroup.vue"
import * as _ from "lodash-es"
import { useComputedField } from "@composables/useComputedField.ts"
import { useClonedForm } from "@composables/useClonedForm.ts"
import { StrUtil } from "zhi-common"

// Props
const props = defineProps<{
  pluginInstance: any
}>()

const logger = createAppLogger("single-platform-setting-index")
const router = useRouter()
const route = useRoute()
const publishSettingStore = usePublishSettingStore()

// datas
const params = reactive(route.params)
const apiType = params.key as string
const { t } = useI18n(props.pluginInstance)
const subtype = getSubPlatformTypeByKey(apiType)
const errorMsg = ref("")

// computed
// 获取平台配置只读版本
const platformConfig = computed(() => {
  const totalCfg =
    publishSettingStore.readonlyState[DYNAMIC_CONFIG_KEY]?.totalCfg
  return totalCfg?.find((item) => item.platformKey === apiType) as DynamicConfig
})
const blogConfig = computed(() => {
  const publishSetting = publishSettingStore.readonlyState as any
  return publishSetting[apiType] as BlogConfig
})
// 设置标题
const pageTitle = computed(() => {
  let platformName = platformConfig.value.platformName
  if (StrUtil.isEmptyString(platformName)) {
    platformName = apiType
  }
  return t("account.setTitle").replace("{platformName}", platformName)
})

// form
// 表单状态
const formState = {
  platformConfig: useClonedForm(platformConfig.value),
  blogConfig: useClonedForm(blogConfig.value),
}
const platformSettingFormGroup = reactive({
  title: t("account.single.platformSetting"),
  items: <SettingItem[]>[
    {
      type: "input",
      label: t("account.single.platform.platformName"),
      value: useComputedField(formState.platformConfig, "platformName"),
      placeholder: t("account.single.platformNamePlaceholder"),
    },
    {
      type: "input",
      label: t("account.single.platform.platformKey"),
      value: platformConfig.value.platformKey,
      placeholder: t("account.single.platformKeyPlaceholder"),
      readonly: true,
      disabled: true,
    },
  ],
})
const blogSettingFormGroup = reactive({
  title: t("account.single.blogSetting"),
  items: <SettingItem[]>[
    {
      type: "input",
      label: t("account.single.blog.home"),
      value: useComputedField(formState.blogConfig, "home"),
      placeholder: t("account.single.homePlaceholder"),
    },
    {
      type: "input",
      label: t("account.single.blog.apiUrl"),
      value: useComputedField(formState.blogConfig, "apiUrl"),
      placeholder: t("account.single.blog.apiUrlPlaceholder"),
    },
  ],
})
const formGroups = [platformSettingFormGroup, blogSettingFormGroup]

// methods
const setError = (msg: string) => {
  errorMsg.value = `${msg} (${new Date().toLocaleString()})`
}

const handleBack = () => {
  router.push(`/?tab=${TabEnum.ACCOUNT}`)
}

const handleSave = async () => {
  //   try {
  //     // 更新平台配置
  //     // TODO
  //     // await publishSettingStore.updatePlatformConfig(
  //     //   formState.platformConfig,
  //     //   formState.blogConfig,
  //     // )
  //     alert({
  //       title: t("common.opt.ok"),
  //       message: t("account.single.setOk"),
  //       type: "success",
  //       position: "center",
  //     })
  //   } catch (e: any) {
  //     setError(e.toString())
  //   }
}
//
const handleReset = () => {
  //   // 重置基础配置
  //   formState.platformConfig = {} as any
  //   // 重置平台特定配置
  //   formState.blogConfig = {} as any
}
//
const handleVerify = async () => {
  //   try {
  //     // 验证平台配置
  //     // TODO
  //     // await publishSettingStore.verifyPlatformConfig(apiType)
  //     alert({
  //       title: t("common.opt.ok"),
  //       message: t("account.single.verifyOk"),
  //       type: "success",
  //       position: "center",
  //     })
  //   } catch (e: any) {
  //     setError(e.toString())
  //   }
}

const extra = computed(() => {
  return [
    {
      component: Button,
      props: {
        type: "primary",
        size: "sm",
        tooltip: t("account.single.saveTip"),
        tooltipPlacement: "bottom",
      },
      onClick: () => {
        handleSave()
      },
      text: t("account.single.save"),
    },
    {
      component: Button,
      props: {
        type: "default",
        size: "sm",
        tooltip: t("account.single.verifyTip"),
        tooltipPlacement: "bottom",
      },
      onClick: () => {
        handleVerify()
      },
      text: t("account.single.verify"),
    },
    {
      component: Button,
      props: {
        type: "default",
        size: "sm",
        tooltip: t("account.single.resetTip"),
        tooltipPlacement: "bottom",
      },
      onClick: () => {
        handleReset()
      },
      text: t("common.reset"),
    },
    {
      component: Button,
      props: {
        type: "link",
        size: "sm",
        tooltip: t("account.single.goToPublishTip"),
        tooltipPlacement: "bottom",
      },
      onClick: () => {
        router.push(`/`)
      },
      text: t("account.single.goToPublish"),
    },
  ]
})

watch(
  () => formState.platformConfig,
  (newVal) => {
    const changedRawPlatformConfig = toRaw(newVal.value)
    logger.debug("platformConfig changed=>", changedRawPlatformConfig)
  },
  { deep: true },
)

watch(
  () => formState.blogConfig,
  (newVal) => {
    const changedRawBlogConfig = toRaw(newVal.value)
    logger.debug("blogConfig changed=>", changedRawBlogConfig)
  },
)

onMounted(() => {
  logger.debug("single account setting inited")
})
</script>

<template>
  <back-page
    :title="pageTitle"
    :plugin-instance="props.pluginInstance"
    :has-back-emit="true"
    :help-key="subtype"
    @back-emit="handleBack"
    :extra="extra"
    :error="errorMsg"
  >
    <form-group
      v-for="(group, index) in formGroups"
      :key="index"
      :plugin-instance="props.pluginInstance"
      :form-group="group"
    />
  </back-page>
</template>

<style scoped lang="stylus"></style>
