<template>
  <el-tabs tab-position="left">
    <el-tab-pane :label="$t('service.tab.publish.service')">
      <!--
      <plantform-main/>
      -->
    </el-tab-pane>
    <el-tab-pane :label="$t('service.tab.publish.setting')">
      <!--
      <plantform-setting/>
      -->
    </el-tab-pane>
    <el-tab-pane :label="$t('service.tab.post.bind')">
      <!--
      <post-bind/>
      -->
    </el-tab-pane>
    <el-tab-pane :label="$t('service.tab.service.switch')">
     <service-switch/>
    </el-tab-pane>
    <el-tab-pane :label="$t('service.tab.change.local')">
      <change-locale/>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import ChangeLocale from "./ChangeLocale.vue";
import ServiceSwitch from "./ServiceSwitch.vue";

export default {
  name: "PublishService",
  components: {ServiceSwitch, ChangeLocale}
}
</script>

<style scoped>

</style>