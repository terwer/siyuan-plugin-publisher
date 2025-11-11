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
import { useVuepress2Api } from "~/src/adaptors/api/vuepress2/useVuepress2Api.ts"
import { Vuepress2Config } from "~/src/adaptors/api/vuepress2/vuepress2Config.ts"
import { Vuepress2Placeholder } from "~/src/adaptors/api/vuepress2/vuepress2Placeholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useVuepress2Api(props.apiType)
const vuepress2Cfg = cfg as Vuepress2Config
const vuepress2Placeholder = new Vuepress2Placeholder()
vuepress2Placeholder.homePlaceholder = t("setting.blog.github.url.tip")
vuepress2Placeholder.usernamePlaceholder = t("setting.blog.type.github.user.tip")
vuepress2Placeholder.passwordPlaceholder = t("setting.blog.type.github.token.tip")
vuepress2Placeholder.apiUrlPlaceholder = t("setting.blog.github.apiurl.tip")
vuepress2Placeholder.previewUrlPlaceholder = t("setting.blog.previewUrl.tip")
vuepress2Cfg.placeholder = vuepress2Placeholder
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="vuepress2Cfg">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>
