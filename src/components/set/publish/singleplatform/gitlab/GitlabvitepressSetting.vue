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
import { useGitlabvitepressApi } from "~/src/adaptors/api/gitlab-vitepress/useGitlabvitepressApi.ts"
import { GitlabvitepressConfig } from "~/src/adaptors/api/gitlab-vitepress/gitlabvitepressConfig.ts"
import { GitlabvitepressPlaceholder } from "~/src/adaptors/api/gitlab-vitepress/gitlabvitepressPlaceholder.ts"
import { GITLAB_CONSTANTS } from "~/src/adaptors/api/base/gitlab/gitlabConstants.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useGitlabvitepressApi(props.apiType)
const vitepressCfg = cfg as GitlabvitepressConfig
const vitepressPlaceholder = new GitlabvitepressPlaceholder()
vitepressPlaceholder.homePlaceholder = t("setting.blog.gitlab.url.tip")
vitepressPlaceholder.usernamePlaceholder = t("setting.blog.type.gitlab.user.tip")
vitepressPlaceholder.passwordPlaceholder = t("setting.blog.type.gitlab.token.tip")
vitepressPlaceholder.apiUrlPlaceholder = t("setting.blog.gitlab.apiurl.tip")
vitepressPlaceholder.previewUrlPlaceholder = t("setting.blog.gitlab.previewUrl.tip")
vitepressCfg.placeholder = vitepressPlaceholder

// 处理事件的方法
const onHomeChange = (value: string, cfg: GitlabvitepressConfig) => {
  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  } else {
    cfg.apiUrl = cfg.home
    cfg.tokenSettingUrl = StrUtil.pathJoin(cfg.home, GITLAB_CONSTANTS.TOKEN_SETTING_URL)
  }
}
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="vitepressCfg" @onHomeChange="onHomeChange">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>
