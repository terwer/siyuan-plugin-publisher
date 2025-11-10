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
import { StrUtil } from "zhi-common"
import { useGitlabjekyllApi } from "~/src/adaptors/api/gitlab-jekyll/useGitlabjekyllApi.ts"
import { GitlabjekyllConfig } from "~/src/adaptors/api/gitlab-jekyll/gitlabjekyllConfig.ts"
import { GitlabjekyllPlaceholder } from "~/src/adaptors/api/gitlab-jekyll/gitlabjekyllPlaceholder.ts"
import { GITLAB_CONSTANTS } from "~/src/adaptors/api/base/gitlab/gitlabConstants.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useGitlabjekyllApi(props.apiType)
const jekyllCfg = cfg as GitlabjekyllConfig
const jekyllPlaceholder = new GitlabjekyllPlaceholder()
jekyllPlaceholder.homePlaceholder = t("setting.blog.gitlab.url.tip")
jekyllPlaceholder.usernamePlaceholder = t("setting.blog.type.gitlab.user.tip")
jekyllPlaceholder.passwordPlaceholder = t("setting.blog.type.gitlab.token.tip")
jekyllPlaceholder.apiUrlPlaceholder = t("setting.blog.gitlab.apiurl.tip")
jekyllPlaceholder.previewUrlPlaceholder = t("setting.blog.gitlab.previewUrl.tip")
jekyllCfg.placeholder = jekyllPlaceholder

// 处理事件的方法
const onHomeChange = (value: string, cfg: GitlabjekyllConfig) => {
  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  } else {
    cfg.apiUrl = cfg.home
    cfg.tokenSettingUrl = StrUtil.pathJoin(cfg.home, GITLAB_CONSTANTS.TOKEN_SETTING_URL)
  }
}
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="jekyllCfg" @onHomeChange="onHomeChange">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>
