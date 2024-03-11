<!--
  - Copyright (c) 2022-2023, Terwer . All rights reserved.
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

<script lang="ts" setup>
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import MetaweblogSetting from "~/src/components/set/publish/singleplatform/base/impl/MetaweblogSetting.vue"
import { JvueConfig } from "~/src/adaptors/api/jvue/jvueConfig.ts"
import { useJvueApi } from "~/src/adaptors/api/jvue/useJvueApi.ts"
import { JvuePlaceHolder } from "~/src/adaptors/api/jvue/jvuePlaceHolder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useJvueApi(props.apiType)
const tcCfg = cfg as JvueConfig
const tcPlaceholder = new JvuePlaceHolder()
tcPlaceholder.homePlaceholder = t("setting.jvue.home.tip")
tcPlaceholder.usernamePlaceholder = t("setting.jvue.username.tip")
tcPlaceholder.passwordPlaceholder = t("setting.jvue.password.tip")
tcPlaceholder.apiUrlPlaceholder = t("setting.jvue.apiUrl.tip")
tcPlaceholder.previewUrlPlaceholder = t("setting.jvue.previewUrl.tip")
tcCfg.placeholder = tcPlaceholder
</script>

<template>
  <metaweblog-setting :api-type="props.apiType" :cfg="tcCfg" />
</template>
