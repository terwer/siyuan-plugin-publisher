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
import { useHexoApi } from "~/src/adaptors/api/hexo/useHexoApi.ts"
import { HexoConfig } from "~/src/adaptors/api/hexo/hexoConfig.ts"
import { HexoPlaceholder } from "~/src/adaptors/api/hexo/hexoPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useHexoApi(props.apiType)
const hexoCfg = cfg as HexoConfig
const hexoPlaceholder = new HexoPlaceholder()
hexoPlaceholder.homePlaceholder = t("setting.blog.github.url.tip")
hexoPlaceholder.usernamePlaceholder = t("setting.blog.type.github.user.tip")
hexoPlaceholder.passwordPlaceholder = t("setting.blog.type.github.token.tip")
hexoPlaceholder.apiUrlPlaceholder = t("setting.blog.github.apiurl.tip")
hexoPlaceholder.previewUrlPlaceholder = t("setting.blog.previewUrl.tip")
hexoCfg.placeholder = hexoPlaceholder
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="hexoCfg">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>