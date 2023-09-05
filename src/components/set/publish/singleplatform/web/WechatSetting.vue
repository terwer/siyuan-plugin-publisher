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
import {useWechatWeb} from "~/src/adaptors/web/wechat/useWechatWeb.ts";
import {WechatConfig} from "~/src/adaptors/web/wechat/wechatConfig.ts";
import {WechatPlaceholder} from "~/src/adaptors/web/wechat/wechatPlaceholder.ts";

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useWechatWeb(props.apiType)

const wechatCfg = cfg as WechatConfig
const wechatPlaceholder = new WechatPlaceholder()
wechatPlaceholder.homePlaceholder = t("setting.wechat.home.tip")
wechatPlaceholder.apiUrlPlaceholder = t("setting.wechat.apiUrl.tip")
wechatPlaceholder.passwordPlaceholder = t("setting.wechat.password.tip")
wechatPlaceholder.previewUrlPlaceholder = t("setting.wechat.previewUrl.tip")
wechatCfg.placeholder = wechatPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="wechatCfg" />
</template>
