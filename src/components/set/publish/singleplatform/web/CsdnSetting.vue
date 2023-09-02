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
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { CsdnConfig } from "~/src/adaptors/web/csdn/csdnConfig.ts"
import { CsdnPlaceholder } from "~/src/adaptors/web/csdn/csdnPlaceholder.ts"
import { useCsdnWeb } from "~/src/adaptors/web/csdn/useCsdnWeb.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useCsdnWeb(props.apiType)

const csdnCfg = cfg as CsdnConfig
const csdnPlaceholder = new CsdnPlaceholder()
csdnPlaceholder.homePlaceholder = t("setting.csdn.home.tip")
csdnPlaceholder.apiUrlPlaceholder = t("setting.csdn.apiUrl.tip")
csdnPlaceholder.passwordPlaceholder = t("setting.csdn.password.tip")
csdnPlaceholder.previewUrlPlaceholder = t("setting.csdn.previewUrl.tip")
csdnCfg.placeholder = csdnPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="csdnCfg" />
</template>
