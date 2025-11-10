<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useVitepressApi } from "~/src/adaptors/api/vitepress/useVitepressApi.ts"
import { VitepressConfig } from "~/src/adaptors/api/vitepress/vitepressConfig.ts"
import { VitepressPlaceholder } from "~/src/adaptors/api/vitepress/vitepressPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useVitepressApi(props.apiType)
const vitepressCfg = cfg as VitepressConfig
const vitepressPlaceholder = new VitepressPlaceholder()
vitepressPlaceholder.homePlaceholder = t("setting.blog.github.url.tip")
vitepressPlaceholder.usernamePlaceholder = t("setting.blog.type.github.user.tip")
vitepressPlaceholder.passwordPlaceholder = t("setting.blog.type.github.token.tip")
vitepressPlaceholder.apiUrlPlaceholder = t("setting.blog.github.apiurl.tip")
vitepressPlaceholder.previewUrlPlaceholder = t("setting.blog.previewUrl.tip")
vitepressCfg.placeholder = vitepressPlaceholder
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="vitepressCfg">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>
