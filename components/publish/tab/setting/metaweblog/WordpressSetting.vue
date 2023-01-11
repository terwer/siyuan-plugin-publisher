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

<template>
  <metaweblog-setting :api-type="apiType" :cfg="cfg" />
</template>

<script lang="ts" setup>
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { ref } from "vue"
import { WordpressCfg } from "~/utils/platform/wordpress/wordpressCfg"

import MetaweblogSetting from "../MetaweblogSetting.vue"
import { MetaweblogPlaceholder } from "~/utils/platform/metaweblog/metaweblogPlaceholder"
import { useI18n } from "vue-i18n"

// const props = defineProps({
//   isReload: {
//     type: Boolean,
//     default: false
//   },
//   apiType: {
//     type: String,
//     default: ''
//   },
//   cfg: {
//     type: MetaweblogCfg,
//     default: null
//   }
// })

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_WORDPRESS)
const { t } = useI18n()

const wpCfg = new WordpressCfg()
const wpPlaceholder = new MetaweblogPlaceholder()
wpPlaceholder.homePlaceholder = t("setting.wordpress.home.tip")
wpPlaceholder.usernamePlaceholder = t("setting.wordpress.username.tip")
wpPlaceholder.passwordPlaceholder = t("setting.wordpress.password.tip")
wpPlaceholder.apiUrlPlaceholder = t("setting.wordpress.apiUrl.tip")
wpPlaceholder.previewUrlPlaceholder = t("setting.wordpress.previewUrl.tip")
wpCfg.placeholder = wpPlaceholder
const cfg = ref(wpCfg)
</script>
