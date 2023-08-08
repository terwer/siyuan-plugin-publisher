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
import { useWordpressApi } from "~/src/adaptors/api/wordpress/useWordpressApi.ts"
import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { WordpressPlaceholder } from "~/src/adaptors/api/wordpress/wordpressPlaceholder.ts"
import WordpressUtils from "~/src/adaptors/api/wordpress/wordpressUtils.ts"
import { StrUtil } from "zhi-common"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

// 处理事件的方法
const onHomeChange = (value: string, cfg: WordpressConfig) => {
  const { home, apiUrl } = WordpressUtils.parseHomeAndUrl(value)
  cfg.home = home
  cfg.apiUrl = apiUrl

  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  }
}

const { t } = useVueI18n()
const { cfg } = await useWordpressApi(props.apiType)
const wpCfg = cfg as WordpressConfig
const wpPlaceholder = new WordpressPlaceholder()
wpPlaceholder.homePlaceholder = t("setting.wordpress.home.tip")
wpPlaceholder.usernamePlaceholder = t("setting.wordpress.username.tip")
wpPlaceholder.passwordPlaceholder = t("setting.wordpress.password.tip")
wpPlaceholder.apiUrlPlaceholder = t("setting.wordpress.apiUrl.tip")
wpPlaceholder.previewUrlPlaceholder = t("setting.wordpress.previewUrl.tip")
wpCfg.placeholder = wpPlaceholder
// 正式版发布之后删除下面配置
wpCfg.usernameEnabled = true
wpCfg.showTokenTip = false
wpCfg.allowPreviewUrlChange = true
</script>

<template>
  <metaweblog-setting :api-type="props.apiType" :cfg="wpCfg" @onHomeChange="onHomeChange" />
</template>
