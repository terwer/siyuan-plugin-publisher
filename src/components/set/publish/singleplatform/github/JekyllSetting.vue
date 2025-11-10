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
import { useJekyllApi } from "~/src/adaptors/api/jekyll/useJekyllApi.ts"
import { JekyllConfig } from "~/src/adaptors/api/jekyll/jekyllConfig.ts"
import { JekyllPlaceholder } from "~/src/adaptors/api/jekyll/jekyllPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useJekyllApi(props.apiType)
const jekyllCfg = cfg as JekyllConfig
const jekyllPlaceholder = new JekyllPlaceholder()
jekyllPlaceholder.homePlaceholder = t("setting.blog.github.url.tip")
jekyllPlaceholder.usernamePlaceholder = t("setting.blog.type.github.user.tip")
jekyllPlaceholder.passwordPlaceholder = t("setting.blog.type.github.token.tip")
jekyllPlaceholder.apiUrlPlaceholder = t("setting.blog.github.apiurl.tip")
jekyllPlaceholder.previewUrlPlaceholder = t("setting.blog.previewUrl.tip")
jekyllCfg.placeholder = jekyllPlaceholder
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="jekyllCfg">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>