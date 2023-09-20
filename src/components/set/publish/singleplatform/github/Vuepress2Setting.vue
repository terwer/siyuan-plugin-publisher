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
import { useVuepress2Api } from "~/src/adaptors/api/vuepress2/useVuepress2Api.ts"
import { Vuepress2Config } from "~/src/adaptors/api/vuepress2/vuepress2Config.ts"
import { Vuepress2Placeholder } from "~/src/adaptors/api/vuepress2/vuepress2Placeholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useVuepress2Api(props.apiType)
const vuepress2Cfg = cfg as Vuepress2Config
const vuepress2Placeholder = new Vuepress2Placeholder()
vuepress2Placeholder.homePlaceholder = t("setting.blog.github.url.tip")
vuepress2Placeholder.usernamePlaceholder = t("setting.blog.type.github.user.tip")
vuepress2Placeholder.passwordPlaceholder = t("setting.blog.type.github.token.tip")
vuepress2Placeholder.apiUrlPlaceholder = t("setting.blog.github.apiurl.tip")
vuepress2Placeholder.previewUrlPlaceholder = t("setting.blog.previewUrl.tip")
vuepress2Cfg.placeholder = vuepress2Placeholder
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="vuepress2Cfg">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>
