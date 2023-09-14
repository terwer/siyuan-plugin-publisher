<!--
  - Copyright (c) 2023, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { StrUtil } from "zhi-common"
import { useGitlabvuepressApi } from "~/src/adaptors/api/gitlab-vuepress/useGitlabvuepressApi.ts"
import { GitlabvuepressConfig } from "~/src/adaptors/api/gitlab-vuepress/gitlabvuepressConfig.ts"
import { GitlabvuepressPlaceHolder } from "~/src/adaptors/api/gitlab-vuepress/gitlabvuepressPlaceHolder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useGitlabvuepressApi(props.apiType)
const vuepressCfg = cfg as GitlabvuepressConfig
const vuepressPlaceholder = new GitlabvuepressPlaceHolder()
vuepressPlaceholder.homePlaceholder = t("setting.blog.gitlab.url.tip")
vuepressPlaceholder.usernamePlaceholder = t("setting.blog.type.gitlab.user.tip")
vuepressPlaceholder.passwordPlaceholder = t("setting.blog.type.gitlab.token.tip")
vuepressPlaceholder.apiUrlPlaceholder = t("setting.blog.gitlab.apiurl.tip")
vuepressPlaceholder.previewUrlPlaceholder = t("setting.blog.gitlab.previewUrl.tip")
vuepressCfg.placeholder = vuepressPlaceholder

// 处理事件的方法
const onHomeChange = (value: string, cfg: GitlabvuepressConfig) => {
  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  } else {
    cfg.apiUrl = cfg.home
    cfg.tokenSettingUrl = `${cfg.home}/-/profile/personal_access_tokens`
  }
}
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="vuepressCfg" @onHomeChange="onHomeChange">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>
