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
import BackPage from "~/src/components/common/BackPage.vue"
import { reactive } from "vue"
import { useRoute } from "vue-router"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { getSubPlatformTypeByKey, SubPlatformType } from "~/src/components/set/publish/platform/dynamicConfig.ts"
import CnblogsSetting from "~/src/components/set/publish/singleplatform/metaweblog/CnblogsSetting.vue"
import WordpressSetting from "~/src/components/set/publish/singleplatform/metaweblog/WordpressSetting.vue"
import TypechoSetting from "~/src/components/set/publish/singleplatform/metaweblog/TypechoSetting.vue"
import YuqueSetting from "~/src/components/set/publish/singleplatform/commonblog/YuqueSetting.vue"

// uses
const { t } = useVueI18n()
const route = useRoute()

// datas
const params = reactive(route.params)
const apiType = params.key as string
const subtype = getSubPlatformTypeByKey(apiType)
</script>

<template>
  <back-page :title="t('setting.entry.title') + apiType">
    <yuque-setting v-if="subtype === SubPlatformType.Common_Yuque" :api-type="apiType" />
    <cnblogs-setting v-else-if="subtype === SubPlatformType.Metaweblog_Cnblogs" :api-type="apiType" />
    <wordpress-setting v-else-if="subtype === SubPlatformType.Wordpress_Wordpress" :api-type="apiType" />
    <typecho-setting v-else-if="subtype === SubPlatformType.Metaweblog_Typecho" :api-type="apiType" />
    <span v-else>
      <el-alert :closable="false" :title="t('setting.entry.not.supported')" class="top-tip" type="error" />
    </span>
  </back-page>
</template>

<style lang="stylus" scoped>
.top-tip
  margin 10px 0
  padding-left 0
</style>
