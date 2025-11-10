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
import { useHugoApi } from "~/src/adaptors/api/hugo/useHugoApi.ts"
import { HugoConfig } from "~/src/adaptors/api/hugo/hugoConfig.ts"
import { HugoPlaceholder } from "~/src/adaptors/api/hugo/hugoPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useHugoApi(props.apiType)
const hugoCfg = cfg as HugoConfig
const hugoPlaceholder = new HugoPlaceholder()
hugoPlaceholder.homePlaceholder = t("setting.blog.github.url.tip")
hugoPlaceholder.usernamePlaceholder = t("setting.blog.type.github.user.tip")
hugoPlaceholder.passwordPlaceholder = t("setting.blog.type.github.token.tip")
hugoPlaceholder.apiUrlPlaceholder = t("setting.blog.github.apiurl.tip")
hugoPlaceholder.previewUrlPlaceholder = t("setting.blog.previewUrl.tip")
hugoCfg.placeholder = hugoPlaceholder
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="hugoCfg">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>