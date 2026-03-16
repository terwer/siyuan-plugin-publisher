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
import { GitlabastroConfig } from "~/src/adaptors/api/gitlab-astro/gitlabastroConfig.ts"
import { GitlabastroPlaceholder } from "~/src/adaptors/api/gitlab-astro/gitlabastroPlaceholder.ts"
import { useGitlabastroApi } from "~/src/adaptors/api/gitlab-astro/useGitlabastroApi.ts"
import { StrUtil } from "zhi-common"
import { GITLAB_CONSTANTS } from "~/src/adaptors/api/base/gitlab/gitlabConstants.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useGitlabastroApi(props.apiType)
const astroCfg = cfg as GitlabastroConfig
const astroPlaceholder = new GitlabastroPlaceholder()
astroPlaceholder.homePlaceholder = t("setting.blog.gitlab.url.tip")
astroPlaceholder.usernamePlaceholder = t("setting.blog.type.gitlab.user.tip")
astroPlaceholder.passwordPlaceholder = t("setting.blog.type.gitlab.token.tip")
astroPlaceholder.apiUrlPlaceholder = t("setting.blog.gitlab.apiurl.tip")
astroPlaceholder.previewUrlPlaceholder = t("setting.blog.gitlab.previewUrl.tip")
astroCfg.placeholder = astroPlaceholder

// 处理事件的方法
const onHomeChange = (value: string, cfg: GitlabastroConfig) => {
  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  } else {
    cfg.apiUrl = cfg.home
    cfg.tokenSettingUrl = StrUtil.pathJoin(cfg.home, GITLAB_CONSTANTS.TOKEN_SETTING_URL)
  }
}
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="astroCfg" @onHomeChange="onHomeChange">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>