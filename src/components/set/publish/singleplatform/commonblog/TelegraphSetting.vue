<!--
  - Copyright (c) 2024, Terwer . All rights reserved.
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
import CommonBlogSetting from "~/src/components/set/publish/singleplatform/base/CommonBlogSetting.vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useTelegraphApi } from "~/src/adaptors/api/telegraph/useTelegraphApi.ts"
import { TelegraphConfig } from "~/src/adaptors/api/telegraph/telegraphConfig.ts"
import { TelegraphPlaceholder } from "~/src/adaptors/api/telegraph/telegraphPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useTelegraphApi(props.apiType)
const telegraphCfg = cfg as TelegraphConfig
const telegraphPlaceholder = new TelegraphPlaceholder()
telegraphPlaceholder.homePlaceholder = t("setting.telegraph.home.tip")
telegraphPlaceholder.usernamePlaceholder = t("setting.telegraph.username.tip")
telegraphPlaceholder.passwordPlaceholder = t("setting.telegraph.password.tip")
telegraphPlaceholder.apiUrlPlaceholder = t("setting.telegraph.apiurl.tip")
telegraphPlaceholder.previewUrlPlaceholder = t("setting.telegraph.previewUrl.tip")
telegraphCfg.placeholder = telegraphPlaceholder
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="telegraphCfg" />
</template>
