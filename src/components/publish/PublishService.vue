<template>
  <el-tabs :model-value="defaultTab" tab-position="left" @tab-change="serviceTabChange">
    <el-tab-pane name="plantform-main" :label="$t('service.tab.publish.service')">
      <plantform-main :is-reload="isReloadMain" :page-id="props.pageId"/>
    </el-tab-pane>
    <el-tab-pane name="plantform-setting" :label="$t('service.tab.publish.setting')">
      <plantform-setting :is-reload="isReloadSetting"/>
    </el-tab-pane>
    <el-tab-pane name="post-bind" :label="$t('service.tab.post.bind')">
      <post-bind :is-reload="isReloadPostBind" :page-id="props.pageId"/>
    </el-tab-pane>
    <el-tab-pane name="service-switch" :label="$t('service.tab.service.switch')">
      <service-switch/>
    </el-tab-pane>
    <el-tab-pane name="dynamicp-platform" :label="$t('dynamic.platform.new')">
      <dynamic-plantform/>
    </el-tab-pane>
    <el-tab-pane name="change-local" :label="$t('service.tab.change.local')">
      <change-locale/>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import logUtil from "../../utils/logUtil";
import {onMounted, ref} from "vue";

let defaultTab = ref("plantform-main")

let isReloadSetting = ref(false)
let isReloadMain = ref(false)
let isReloadPostBind = ref(false)

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  },
  pageId: {
    type: String,
    default: undefined
  }
})

const serviceTabChange = (name: string) => {
  logUtil.logInfo("serviceTabChange=>", name)
  if ("plantform-setting" == name) {
    // 切换强制刷新
    isReloadSetting.value = !isReloadSetting.value;
    logUtil.logInfo("plantform-setting change=>")
  } else if ("plantform-main" == name) {
    // 切换强制刷新
    isReloadMain.value = !isReloadMain.value;
    logUtil.logInfo("plantform-main change=>")
  } else if ("post-bind" == name) {
    // 切换强制刷新
    isReloadPostBind.value = !isReloadPostBind.value;
    logUtil.logInfo("post-bind change=>")
  }
}

onMounted(() => {
  // defaultTab.value = getQueryString("tab") || defaultTab.value
})

</script>

<script lang="ts">
import ChangeLocale from "./tab/ChangeLocale.vue";
import ServiceSwitch from "./tab/ServiceSwitch.vue";
import PlantformSetting from "./tab/PlantformSetting.vue";
import PostBind from "./tab/PostBind.vue";
import PlantformMain from "./tab/PlantformMain.vue";
import DynamicPlantform from "./tab/DynamicPlantform.vue";

export default {
  name: "PublishService",
  components: {PlantformSetting, ServiceSwitch, ChangeLocale, PostBind, PlantformMain, DynamicPlantform}
}
</script>

<style scoped>
</style>