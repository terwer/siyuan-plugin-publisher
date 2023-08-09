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
import CustomWebSetting from "~/src/components/set/publish/singleplatform/base/impl/CustomWebSetting.vue"
import { ZhihuConfig } from "~/src/adaptors/web/zhihu/zhihuConfig.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useZhihuWeb } from "~/src/adaptors/web/zhihu/useZhihuWeb.ts"
import { ZhihuPlaceholder } from "~/src/adaptors/web/zhihu/zhihuPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useZhihuWeb(props.apiType)

const zhihuCfg = cfg as ZhihuConfig
const zhihuPlaceholder = new ZhihuPlaceholder()
zhihuPlaceholder.homePlaceholder = t("setting.zhihu.home.tip")
zhihuPlaceholder.apiUrlPlaceholder = t("setting.zhihu.apiUrl.tip")
zhihuPlaceholder.usernamePlaceholder = t("setting.zhihu.username.tip")
zhihuPlaceholder.passwordPlaceholder = t("setting.zhihu.password.tip")
zhihuPlaceholder.previewUrlPlaceholder = t("setting.zhihu.previewUrl.tip")
zhihuCfg.placeholder = zhihuPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="zhihuCfg" />
</template>