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
import { useHugoApi } from "~/src/adaptors/api/hugo/useHugoApi.ts"
import { HugoConfig } from "~/src/adaptors/api/hugo/hugoConfig.ts"
import { HugoPlaceholder } from "~/src/adaptors/api/hugo/hugoPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useHugoApi(props.apiType)
const hugoCfg = cfg as HugoConfig
const hugoPlaceholder = new HugoPlaceholder()
hugoPlaceholder.homePlaceholder = t("setting.blog.github.url.tip")
hugoPlaceholder.usernamePlaceholder = t("setting.blog.type.github.user.tip")
hugoPlaceholder.passwordPlaceholder = t("setting.blog.type.github.token.tip")
hugoPlaceholder.apiUrlPlaceholder = t("setting.blog.github.apiurl.tip")
hugoPlaceholder.previewUrlPlaceholder = t("setting.blog.previewUrl.tip")
hugoCfg.placeholder = hugoPlaceholder
</script>

<template>
  <common-github-setting :api-type="props.apiType" :cfg="hugoCfg">
    <template #header="header"> </template>
    <template #main="main"> </template>
    <template #footer="footer"> </template>
  </common-github-setting>
</template>