<template>
  <el-tabs
    :model-value="defaultTab"
    tab-position="left"
    @tab-change="serviceTabChange"
  >
    <el-tab-pane
      name="plantform-main"
      :label="$t('service.tab.publish.service')"
    >
      <plantform-main :is-reload="isReloadMain" :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane
      name="plantform-setting"
      :label="$t('service.tab.publish.setting')"
    >
      <plantform-setting :is-reload="isReloadSetting" />
    </el-tab-pane>
    <el-tab-pane name="post-bind" :label="$t('service.tab.post.bind')">
      <post-bind :is-reload="isReloadPostBind" :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane
      name="service-switch"
      :label="$t('service.tab.service.switch')"
    >
      <service-switch :is-reload="isReloadServiceSwitch" />
    </el-tab-pane>
    <el-tab-pane name="dynamicp-platform" :label="$t('dynamic.platform.new')">
      <dynamic-plantform />
    </el-tab-pane>
    <el-tab-pane name="change-local" :label="$t('service.tab.change.local')">
      <change-locale />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import logUtil from "../../utils/logUtil"
import { onMounted, ref } from "vue"

import ChangeLocale from "./tab/ChangeLocale.vue"
import ServiceSwitch from "./tab/ServiceSwitch.vue"
import PlantformSetting from "./tab/PlantformSetting.vue"
import PostBind from "./tab/PostBind.vue"
import PlantformMain from "./tab/PlantformMain.vue"
import DynamicPlantform from "./tab/DynamicPlantform.vue"

const defaultTab = ref("plantform-main")

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

// @ts-ignore
const serviceTabChange = (name) => {
  logUtil.logInfo("serviceTabChange=>", name)
  if (name === "plantform-setting") {
    // 切换强制刷新
    isReloadSetting.value = !isReloadSetting.value
    logUtil.logInfo("plantform-setting change=>")
  } else if (name === "plantform-main") {
    // 切换强制刷新
    isReloadMain.value = !isReloadMain.value
    logUtil.logInfo("plantform-main change=>")
  } else if (name === "post-bind") {
    // 切换强制刷新
    isReloadPostBind.value = !isReloadPostBind.value
    logUtil.logInfo("post-bind change=>")
  } else if (name === "service-switch") {
    // 切换强制刷新
    isReloadServiceSwitch.value = !isReloadServiceSwitch.value
    logUtil.logInfo("service-switch change=>")
  }
}

onMounted(() => {
  // defaultTab.value = getQueryString("tab") || defaultTab.value
})
</script>

<script lang="ts">
export default {
  name: "PublishService",
}
</script>

<style scoped></style>
