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
import { StrUtil } from "zhi-common"
import TypechoUtils from "~/src/adaptors/api/typecho/typechoUtils.ts"
import { TypechoConfig } from "~/src/adaptors/api/typecho/typechoConfig.ts"
import { TypechoPlaceholder } from "~/src/adaptors/api/typecho/typechoPlaceholder.ts"
import { useTypechoApi } from "~/src/adaptors/api/typecho/useTypechoApi.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

// 处理事件的方法
const onHomeChange = (value: string, cfg: TypechoConfig) => {
  const { home, apiUrl } = TypechoUtils.parseHomeAndUrl(value)
  cfg.home = home
  cfg.apiUrl = apiUrl

  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  }
}

const { t } = useVueI18n()
const { cfg } = await useTypechoApi(props.apiType)
const tcCfg = cfg as TypechoConfig
const tcPlaceholder = new TypechoPlaceholder()
tcPlaceholder.homePlaceholder = t("setting.typecho.home.tip")
tcPlaceholder.usernamePlaceholder = t("setting.typecho.username.tip")
tcPlaceholder.passwordPlaceholder = t("setting.typecho.password.tip")
tcPlaceholder.apiUrlPlaceholder = t("setting.typecho.apiUrl.tip")
tcPlaceholder.previewUrlPlaceholder = t("setting.typecho.previewUrl.tip")
tcCfg.placeholder = tcPlaceholder
</script>

<template>
  <metaweblog-setting :api-type="props.apiType" :cfg="tcCfg" @onHomeChange="onHomeChange" />
</template>
