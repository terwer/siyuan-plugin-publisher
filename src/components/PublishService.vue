<template>
  <el-tabs tab-position="left" @tab-change="serviceTabChange">
    <el-tab-pane name="plantform-main" :label="$t('service.tab.publish.service')">
      <plantform-main/>
    </el-tab-pane>
    <el-tab-pane name="plantform-setting" :label="$t('service.tab.publish.setting')">
      <plantform-setting :is-reload="isReloadSetting"/>
    </el-tab-pane>
    <el-tab-pane name="post-bind" :label="$t('service.tab.post.bind')">
      <post-bind/>
    </el-tab-pane>
    <el-tab-pane :label="$t('service.tab.service.switch')">
      <service-switch/>
    </el-tab-pane>
    <el-tab-pane :label="$t('service.tab.change.local')">
      <change-locale/>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import log from "../lib/logUtil";
import {ref} from "vue";
import PostBind from "./PostBind.vue";
import PlantformMain from "./PlantformMain.vue";

let isReloadSetting = ref(false)

const serviceTabChange = (name: string) => {
  log.logInfo("serviceTabChange=>", name)
  if ("plantform-setting" == name) {
    // 切换强制刷新
    isReloadSetting.value = !isReloadSetting.value;
    log.logInfo("plantform-setting change=>")
  }
}

</script>

<script lang="ts">
import ChangeLocale from "./ChangeLocale.vue";
import ServiceSwitch from "./ServiceSwitch.vue";
import PlantformSetting from "./PlantformSetting.vue";

export default {
  name: "PublishService",
  components: {PlantformSetting, ServiceSwitch, ChangeLocale}
}
</script>

<style scoped>
</style>