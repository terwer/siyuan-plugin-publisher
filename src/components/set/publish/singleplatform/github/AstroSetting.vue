<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useAstroApi } from "~/src/adaptors/api/astro/useAstroApi.ts"
import { AstroConfig } from "~/src/adaptors/api/astro/astroConfig.ts"
import { AstroPlaceholder } from "~/src/adaptors/api/astro/astroPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useAstroApi(props.apiType)
const astroCfg = cfg as AstroConfig
const astroPlaceholder = new AstroPlaceholder()
astroPlaceholder.homePlaceholder = t("setting.blog.github.url.tip")
astroPlaceholder.usernamePlaceholder = t("setting.blog.type.github.user.tip")
astroPlaceholder.passwordPlaceholder = t("setting.blog.type.github.token.tip")
astroPlaceholder.apiUrlPlaceholder = t("setting.blog.github.apiurl.tip")
astroPlaceholder.previewUrlPlaceholder = t("setting.blog.previewUrl.tip")
astroCfg.placeholder = astroPlaceholder
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="astroCfg">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>

<style scoped lang="stylus">
</style>