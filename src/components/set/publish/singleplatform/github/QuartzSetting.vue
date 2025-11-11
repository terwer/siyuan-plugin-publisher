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
import { useQuartzApi } from "~/src/adaptors/api/quartz/useQuartzApi.ts"
import { QuartzConfig } from "~/src/adaptors/api/quartz/quartzConfig.ts"
import { QuartzPlaceholder } from "~/src/adaptors/api/quartz/quartzPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useQuartzApi(props.apiType)
const quartzCfg = cfg as QuartzConfig
const quartzPlaceholder = new QuartzPlaceholder()
quartzPlaceholder.homePlaceholder = t("setting.blog.github.url.tip")
quartzPlaceholder.usernamePlaceholder = t("setting.blog.type.github.user.tip")
quartzPlaceholder.passwordPlaceholder = t("setting.blog.type.github.token.tip")
quartzPlaceholder.apiUrlPlaceholder = t("setting.blog.github.apiurl.tip")
quartzPlaceholder.previewUrlPlaceholder = t("setting.blog.previewUrl.tip")
quartzCfg.placeholder = quartzPlaceholder
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="quartzCfg">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>
