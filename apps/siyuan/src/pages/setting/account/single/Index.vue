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
import { alert } from "@components/Alert.ts"
import BackPage from "@components/BackPage.vue"
import Button from "@components/Button.vue"
import PlatformConfigForm from "@components/PlatformConfigForm.vue"
import { useI18n } from "@composables/useI18n.ts"
import { TabEnum } from "@enums/TabEnum.ts"
import { usePublishSettingStore } from "@stores/usePublishSettingStore.ts"
import { computed, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { BlogConfig } from "zhi-blog-api"

// Props
const props = defineProps<{
  pluginInstance: any
}>()

const router = useRouter()
const route = useRoute()
const { query } = useRoute()
const publishSettingStore = usePublishSettingStore()

// datas
const params = reactive(route.params)
const apiType = params.key as string
const platformName = ref((query.platformName ?? "unknown") as string)
const { t } = useI18n(props.pluginInstance)
const pageTitle = computed(() =>
  t("account.setTitle").replace("{platformName}", platformName.value),
)
const subtype = getSubPlatformTypeByKey(apiType)

// 获取平台配置
const platformConfig = computed(() => {
  const totalCfg =
    publishSettingStore.readonlyState[DYNAMIC_CONFIG_KEY]?.totalCfg
  return totalCfg?.find((item) => item.platformKey === apiType)
})
const blogConfig = computed(() => {
  const publishSetting = publishSettingStore.readonlyState as any
  return publishSetting[apiType] as BlogConfig
})

// methods
const errorMsg = ref("")

const setError = (msg: string) => {
  errorMsg.value = `${msg} (${new Date().toLocaleString()})`
}

const handleBack = () => {
  router.push(`/?tab=${TabEnum.ACCOUNT}`)
}

const handleSave = async () => {
  try {
    // 更新平台配置
    await publishSettingStore.updatePlatformConfig(platformConfig, blogConfig)
    alert({
      title: t("common.opt.ok"),
      message: t("account.single.setOk"),
      type: "success",
      position: "center",
    })
  } catch (e: any) {
    setError(e.toString())
  }
}

const handleVerify = async () => {
  try {
    // 验证平台配置
    await publishSettingStore.verifyPlatformConfig(apiType)
    alert({
      title: t("common.opt.ok"),
      message: t("account.single.verifyOk"),
      type: "success",
      position: "center",
    })
  } catch (e: any) {
    setError(e.toString())
  }
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
    <platform-config-form
      v-if="platformConfig"
      :plugin-instance="props.pluginInstance"
      :platform-config="platformConfig"
      :blog-config="blogConfig"
      @save="handleSave"
    />
  </back-page>
</template>

<style scoped lang="stylus"></style>
