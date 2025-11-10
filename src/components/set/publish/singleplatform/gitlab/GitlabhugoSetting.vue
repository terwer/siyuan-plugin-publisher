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
import { useGitlabhugoApi } from "~/src/adaptors/api/gitlab-hugo/useGitlabhugoApi.ts"
import { GitlabhugoConfig } from "~/src/adaptors/api/gitlab-hugo/gitlabhugoConfig.ts"
import { GitlabhugoPlaceholder } from "~/src/adaptors/api/gitlab-hugo/gitlabhugoPlaceholder.ts"
import { StrUtil } from "zhi-common"
import { GITLAB_CONSTANTS } from "~/src/adaptors/api/base/gitlab/gitlabConstants.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useGitlabhugoApi(props.apiType)
const hugoCfg = cfg as GitlabhugoConfig
const hugoPlaceholder = new GitlabhugoPlaceholder()
hugoPlaceholder.homePlaceholder = t("setting.blog.gitlab.url.tip")
hugoPlaceholder.usernamePlaceholder = t("setting.blog.type.gitlab.user.tip")
hugoPlaceholder.passwordPlaceholder = t("setting.blog.type.gitlab.token.tip")
hugoPlaceholder.apiUrlPlaceholder = t("setting.blog.gitlab.apiurl.tip")
hugoPlaceholder.previewUrlPlaceholder = t("setting.blog.gitlab.previewUrl.tip")
hugoCfg.placeholder = hugoPlaceholder

// 处理事件的方法
const onHomeChange = (value: string, cfg: GitlabhugoConfig) => {
  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  } else {
    cfg.apiUrl = cfg.home
    cfg.tokenSettingUrl = StrUtil.pathJoin(cfg.home, GITLAB_CONSTANTS.TOKEN_SETTING_URL)
  }
}
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="hugoCfg" @onHomeChange="onHomeChange">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>
