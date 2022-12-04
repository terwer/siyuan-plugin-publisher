<!--
  - Copyright (c) 2022, Terwer . All rights reserved.
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
    @tab-change="serviceTabChange"
  >
    <el-tab-pane
      name="platform-main"
      :label="$t('service.tab.publish.service')"
    >
      <!--
        <platform-main :is-reload="isReloadMain" :page-id="props.pageId" />
        -->
    </el-tab-pane>
    <el-tab-pane
      name="platform-setting"
      :label="$t('service.tab.publish.setting')"
    >
      <!--
        <platform-setting :is-reload="isReloadSetting" />
        -->
    </el-tab-pane>
    <el-tab-pane name="post-bind" :label="$t('service.tab.post.bind')">
      <!--
        <post-bind :is-reload="isReloadPostBind" :page-id="props.pageId" />
        -->
    </el-tab-pane>
    <el-tab-pane
      name="service-switch"
      :label="$t('service.tab.service.switch')"
    >
      <!--
        <service-switch :is-reload="isReloadServiceSwitch" />
        -->
    </el-tab-pane>
    <el-tab-pane name="dynamic-platform" :label="$t('dynamic.platform.new')">
      <DynamicPlatform />
    </el-tab-pane>
    <el-tab-pane name="change-local" :label="$t('service.tab.change.local')">
      <ChangeLocale />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { LogFactory } from "~/utils/logUtil"
import ChangeLocale from "~/components/publish/tab/ChangeLocale.vue"
import DynamicPlatform from "~/components/publish/tab/DynamicPlatform.vue"

const logger = LogFactory.getLogger("components/publish/PublishService.vue")

const defaultTab = ref("platform-main")

const isReloadSetting = ref(false)
const isReloadMain = ref(false)
const isReloadPostBind = ref(false)
const isReloadServiceSwitch = ref(false)

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
  logger.debug("serviceTabChange=>", name)
  if (name === "platform-setting") {
    // 切换强制刷新
    isReloadSetting.value = !isReloadSetting.value
    logger.debug("platform-setting change=>")
  } else if (name === "platform-main") {
    // 切换强制刷新
    isReloadMain.value = !isReloadMain.value
    logger.debug("platform-main change=>")
  } else if (name === "post-bind") {
    // 切换强制刷新
    isReloadPostBind.value = !isReloadPostBind.value
    logger.debug("post-bind change=>")
  } else if (name === "service-switch") {
    // 切换强制刷新
    isReloadServiceSwitch.value = !isReloadServiceSwitch.value
    logger.debug("service-switch change=>")
  }
}

onMounted(() => {
  // defaultTab.value = getQueryString("tab") || defaultTab.value
})
</script>

<style scoped></style>
