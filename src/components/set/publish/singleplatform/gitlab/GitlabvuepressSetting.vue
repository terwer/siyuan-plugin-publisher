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
import { useGitlabvuepressApi } from "~/src/adaptors/api/gitlab-vuepress/useGitlabvuepressApi.ts"
import { GitlabvuepressConfig } from "~/src/adaptors/api/gitlab-vuepress/gitlabvuepressConfig.ts"
import { GitlabvuepressPlaceholder } from "~/src/adaptors/api/gitlab-vuepress/gitlabvuepressPlaceholder.ts"
import { GITLAB_CONSTANTS } from "~/src/adaptors/api/base/gitlab/gitlabConstants.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useGitlabvuepressApi(props.apiType)
const vuepressCfg = cfg as GitlabvuepressConfig
const vuepressPlaceholder = new GitlabvuepressPlaceholder()
vuepressPlaceholder.homePlaceholder = t("setting.blog.gitlab.url.tip")
vuepressPlaceholder.usernamePlaceholder = t("setting.blog.type.gitlab.user.tip")
vuepressPlaceholder.passwordPlaceholder = t("setting.blog.type.gitlab.token.tip")
vuepressPlaceholder.apiUrlPlaceholder = t("setting.blog.gitlab.apiurl.tip")
vuepressPlaceholder.previewUrlPlaceholder = t("setting.blog.gitlab.previewUrl.tip")
vuepressCfg.placeholder = vuepressPlaceholder

// 处理事件的方法
const onHomeChange = (value: string, cfg: GitlabvuepressConfig) => {
  // sync api
  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  } else {
    cfg.apiUrl = cfg.home
    cfg.tokenSettingUrl = StrUtil.pathJoin(cfg.home, GITLAB_CONSTANTS.TOKEN_SETTING_URL)
  }

  // sync site
  if (StrUtil.isEmptyString(cfg.home) || StrUtil.isEmptyString(cfg.username)) {
    cfg.site = ""
  } else {
    cfg.site = StrUtil.pathJoin(cfg.home, "/" + cfg.username)
  }
}
const onUsernameChange = (value: string, cfg: GitlabvuepressConfig) => {
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
