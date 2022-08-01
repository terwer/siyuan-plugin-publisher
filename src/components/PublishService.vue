<template>
  <el-tabs model-value="plantform-main" tab-position="left" @tab-change="serviceTabChange">
    <el-tab-pane name="plantform-main" :label="$t('service.tab.publish.service')">
      <plantform-main :is-reload="isReloadMain"/>
    </el-tab-pane>
    <el-tab-pane name="plantform-setting" :label="$t('service.tab.publish.setting')">
      <plantform-setting :is-reload="isReloadSetting"/>
    </el-tab-pane>
    <el-tab-pane name="post-bind" :label="$t('service.tab.post.bind')">
     <post-bind :is-reload="isReloadPostBind"/>
    </el-tab-pane>
    <el-tab-pane name="service-switch" :label="$t('service.tab.service.switch')">
      <service-switch/>
    </el-tab-pane>
    <el-tab-pane name="change-local" :label="$t('service.tab.change.local')">
      <change-locale/>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import log from "../lib/logUtil";
import {ref} from "vue";

let isReloadSetting = ref(false)
let isReloadMain = ref(false)
let isReloadPostBind = ref(false)

const serviceTabChange = (name: string) => {
  log.logInfo("serviceTabChange=>", name)
  if ("plantform-setting" == name) {
    // 切换强制刷新
    isReloadSetting.value = !isReloadSetting.value;
    log.logInfo("plantform-setting change=>")
  } else if ("plantform-main" == name) {
    // 切换强制刷新
    isReloadMain.value = !isReloadMain.value;
    log.logInfo("plantform-main change=>")
  } else if ("post-bind" == name) {
    // 切换强制刷新
    isReloadPostBind.value = !isReloadPostBind.value;
    log.logInfo("post-bind change=>")
  }
}

</script>

<script lang="ts">
import ChangeLocale from "./tab/ChangeLocale.vue";
import ServiceSwitch from "./tab/ServiceSwitch.vue";
import PlantformSetting from "./tab/PlantformSetting.vue";
import PostBind from "./tab/PostBind.vue";
import PlantformMain from "./tab/PlantformMain.vue";

export default {
  name: "PublishService",
  components: {PlantformSetting, ServiceSwitch, ChangeLocale, PostBind, PlantformMain}
}
</script>

<style scoped>
</style>