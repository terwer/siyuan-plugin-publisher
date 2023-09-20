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
import CommonBlogSetting from "~/src/components/set/publish/singleplatform/base/CommonBlogSetting.vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useHaloApi } from "~/src/adaptors/api/halo/useHaloApi.ts"
import { HaloConfig } from "~/src/adaptors/api/halo/HaloConfig.ts"
import { HaloPlaceholder } from "~/src/adaptors/api/halo/HaloPlaceholder.ts"
import { StrUtil } from "zhi-common"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useHaloApi(props.apiType)
const haloCfg = cfg as HaloConfig
const haloPlaceholder = new HaloPlaceholder()
haloPlaceholder.homePlaceholder = t("setting.halo.home.tip")
haloPlaceholder.usernamePlaceholder = t("setting.halo.username.tip")
haloPlaceholder.passwordPlaceholder = t("setting.halo.password.tip")
haloPlaceholder.apiUrlPlaceholder = t("setting.halo.apiUrl.tip")
haloPlaceholder.previewUrlPlaceholder = t("setting.halo.previewUrl.tip")
haloCfg.placeholder = haloPlaceholder

// 处理事件的方法
const onHomeChange = (value: string, cfg: HaloConfig) => {
  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  } else {
    cfg.apiUrl = cfg.home
  }
}
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="haloCfg" @onHomeChange="onHomeChange" />
</template>
