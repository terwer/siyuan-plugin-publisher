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
import { useGitlabvuepress2Api } from "~/src/adaptors/api/gitlab-vuepress2/useGitlabvuepress2Api.ts"
import { Gitlabvuepress2Config } from "~/src/adaptors/api/gitlab-vuepress2/gitlabvuepress2Config.ts"
import { GitlabvuepressPlaceholder } from "~/src/adaptors/api/gitlab-vuepress/gitlabvuepressPlaceholder.ts"

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
    cfg.tokenSettingUrl = `${cfg.home}/-/profile/personal_access_tokens`
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
