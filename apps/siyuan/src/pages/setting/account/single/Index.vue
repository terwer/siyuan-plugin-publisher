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
import { useI18n } from "@composables/useI18n.ts"
import { computed, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { TabEnum } from "@enums/TabEnum.ts"

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
</script>

<template>
  <back-page
    :title="pageTitle"
    :plugin-instance="props.pluginInstance"
    :has-back-emit="true"
    :help-key="subtype"
    @back-emit="handleBack"
  >
    <div>single set index:{{ apiType }}=>{{ subtype }}</div>
  </back-page>
</template>

<style scoped lang="stylus"></style>
