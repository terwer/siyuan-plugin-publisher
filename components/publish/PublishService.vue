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
  <el-tabs
    :model-value="defaultTab"
    tab-position="left"
    @tab-click="serviceTabChange"
  >
    <el-tab-pane
      class="pane-platform-main-body"
      name="platform-main"
      :label="$t('service.tab.publish.service')"
    >
      <platform-main :is-reload="isReloadServiceTab" :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane
      name="platform-setting"
      :label="$t('service.tab.publish.setting')"
    >
      <platform-setting :is-reload="isReloadServiceTab" />
    </el-tab-pane>
    <el-tab-pane
      name="service-switch"
      :label="$t('service.tab.service.switch')"
    >
      <service-switch :is-reload="isReloadServiceTab" />
    </el-tab-pane>
    <el-tab-pane name="dynamic-platform" :label="$t('dynamic.platform.new')">
      <dynamic-platform />
    </el-tab-pane>
    <el-tab-pane name="picgo-setting" :label="$t('picgo.pic.setting')">
      <picgo-setting />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { LogFactory } from "~/utils/logUtil"
import DynamicPlatform from "~/components/publish/tab/DynamicPlatform.vue"
import ServiceSwitch from "~/components/publish/tab/ServiceSwitch.vue"
import PlatformSetting from "~/components/publish/tab/PlatformSetting.vue"
import PlatformMain from "~/components/publish/tab/PlatformMain.vue"
import PicgoSetting from "~/components/picgo/PicgoSetting.vue"

const logger = LogFactory.getLogger("components/publish/PublishService.vue")

const defaultTab = ref("platform-main")

const isReloadServiceTab = ref(false)

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false,
  },
  pageId: {
    type: String,
    default: undefined,
  },
})

const serviceTabChange = (name) => {
  const paneName = name.paneName
  logger.debug("serviceTabChange=>", paneName)
  isReloadServiceTab.value = !isReloadServiceTab.value
}
</script>

<style scoped>
.pane-platform-main-body {
  margin-right: 24px;
}
</style>
