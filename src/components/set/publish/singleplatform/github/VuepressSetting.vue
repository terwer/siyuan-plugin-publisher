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
import { useVuepressApi } from "~/src/adaptors/api/vuepress/useVuepressApi.ts"
import { VuepressConfig } from "~/src/adaptors/api/vuepress/vuepressConfig.ts"
import { VuepressPlaceholder } from "~/src/adaptors/api/vuepress/vuepressPlaceholder.ts"
import { StrUtil } from "zhi-common"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useVuepressApi(props.apiType)
const vuepressCfg = cfg as VuepressConfig
const vuepressPlaceholder = new VuepressPlaceholder()
vuepressPlaceholder.homePlaceholder = t("setting.blog.github.url.tip")
vuepressPlaceholder.usernamePlaceholder = t("setting.blog.type.github.user.tip")
vuepressPlaceholder.passwordPlaceholder = t("setting.blog.type.github.token.tip")
vuepressPlaceholder.apiUrlPlaceholder = t("setting.blog.github.apiurl.tip")
vuepressPlaceholder.previewUrlPlaceholder = t("setting.blog.previewUrl.tip")
vuepressCfg.placeholder = vuepressPlaceholder

// 处理事件的方法
const onHomeChange = (value: string, cfg: VuepressConfig) => {
  if (StrUtil.isEmptyString(cfg.home) || StrUtil.isEmptyString(cfg.username)) {
    cfg.site = ""
  } else {
    cfg.site = StrUtil.pathJoin(cfg.home, "/" + cfg.username)
  }
}
const onUsernameChange = (value: string, cfg: VuepressConfig) => {
  // sync site
  if (StrUtil.isEmptyString(cfg.home) || StrUtil.isEmptyString(cfg.username)) {
    cfg.site = ""
  } else {
    cfg.site = StrUtil.pathJoin(cfg.home, "/" + cfg.username)
  }
}
</script>

<template>
  <common-github-setting
    :api-type="props.apiType"
    :cfg="vuepressCfg"
    @onHomeChange="onHomeChange"
    @onUsernameChange="onUsernameChange"
  >
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>
