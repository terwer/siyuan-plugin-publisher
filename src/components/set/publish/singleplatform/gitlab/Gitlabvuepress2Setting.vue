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
import { useGitlabvuepress2Api } from "~/src/adaptors/api/gitlab-vuepress2/useGitlabvuepress2Api.ts"
import { Gitlabvuepress2Config } from "~/src/adaptors/api/gitlab-vuepress2/gitlabvuepress2Config.ts"
import { GitlabvuepressPlaceholder } from "~/src/adaptors/api/gitlab-vuepress/gitlabvuepressPlaceholder.ts"
import { GITLAB_CONSTANTS } from "~/src/adaptors/api/base/gitlab/gitlabConstants.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useGitlabvuepress2Api(props.apiType)
const vuepress2Cfg = cfg as Gitlabvuepress2Config
const vuepress2Placeholder = new GitlabvuepressPlaceholder()
vuepress2Placeholder.homePlaceholder = t("setting.blog.gitlab.url.tip")
vuepress2Placeholder.usernamePlaceholder = t("setting.blog.type.gitlab.user.tip")
vuepress2Placeholder.passwordPlaceholder = t("setting.blog.type.gitlab.token.tip")
vuepress2Placeholder.apiUrlPlaceholder = t("setting.blog.gitlab.apiurl.tip")
vuepress2Placeholder.previewUrlPlaceholder = t("setting.blog.gitlab.previewUrl.tip")
vuepress2Cfg.placeholder = vuepress2Placeholder

// 处理事件的方法
const onHomeChange = (value: string, cfg: Gitlabvuepress2Config) => {
  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  } else {
    cfg.apiUrl = cfg.home
    cfg.tokenSettingUrl = StrUtil.pathJoin(cfg.home, GITLAB_CONSTANTS.TOKEN_SETTING_URL)
  }
}
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="vuepress2Cfg" @onHomeChange="onHomeChange">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>
