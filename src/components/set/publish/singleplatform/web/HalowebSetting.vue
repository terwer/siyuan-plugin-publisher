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
import CustomWebSetting from "~/src/components/set/publish/singleplatform/base/impl/CustomWebSetting.vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import {useHalowebWeb} from "~/src/adaptors/web/haloweb/useHalowebWeb.ts";
import {HalowebConfig} from "~/src/adaptors/web/haloweb/HalowebConfig.ts";
import {HalowebWebPlaceholder} from "~/src/adaptors/web/haloweb/HalowebWebPlaceholder.ts";

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useHalowebWeb(props.apiType)

const halowebCfg = cfg as HalowebConfig
const halowebPlaceholder = new HalowebWebPlaceholder()
halowebPlaceholder.homePlaceholder = t("setting.haloweb.home.tip")
halowebPlaceholder.apiUrlPlaceholder = t("setting.haloweb.apiUrl.tip")
halowebPlaceholder.passwordPlaceholder = t("setting.haloweb.password.tip")
halowebPlaceholder.previewUrlPlaceholder = t("setting.haloweb.previewUrl.tip")
halowebCfg.placeholder = halowebPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="halowebCfg" />
</template>
