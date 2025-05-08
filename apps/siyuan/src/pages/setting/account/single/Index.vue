<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { getSubPlatformTypeByKey } from "@/models/dynamicConfig.ts"
import BackPage from "@components/BackPage.vue"
import Button from "@components/Button.vue"
import { useI18n } from "@composables/useI18n.ts"
import { TabEnum } from "@enums/TabEnum.ts"
import { computed, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

// Props
const props = defineProps<{
  pluginInstance: any
}>()

const router = useRouter()
const route = useRoute()
const { query } = useRoute()

// datas
const params = reactive(route.params)
const apiType = params.key as string
const platformName = ref((query.platformName ?? "unknown") as string)
const { t } = useI18n(props.pluginInstance)
const pageTitle = computed(() =>
  t("account.setTitle").replace("{platformName}", platformName.value),
)
const subtype = getSubPlatformTypeByKey(apiType)

// methods
const handleBack = () => {
  router.push(`/?tab=${TabEnum.ACCOUNT}`)
}

const extra = computed(() => {
  return [
    {
      component: Button,
      props: {
        type: "primary",
        size: "sm",
        tooltip: "Save",
        tooltipPlacement: "bottom",
      },
      onClick: () => {
        console.log(t("account.single.save"))
      },
      text: t("account.single.save"),
    },
    {
      component: Button,
      props: {
        type: "default",
        size: "sm",
        tooltip: "Verify",
        tooltipPlacement: "bottom",
      },
      onClick: () => {
        console.log(t("account.single.verify"))
      },
      text: t("account.single.verify"),
    },
    {
      component: Button,
      props: {
        type: "link",
        size: "sm",
        tooltip: "Go to publish",
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
  >
    <div>single set index:{{ apiType }}=>{{ subtype }}</div>
  </back-page>
</template>

<style scoped lang="stylus"></style>
