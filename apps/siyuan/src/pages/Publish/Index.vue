<script lang="ts" setup>
import Tab from "../../components/Tab.vue"
import AccountSetting from "../Setting/AccountSetting.vue"
import GeneralSetting from "../Setting/GeneralSetting.vue"
import PublishPlatformSelect from "./PublishPlatformSelect.vue"

const props = defineProps<{
  pluginInstance: any,
}>()

const tabs = [
  {
    // label: props.pluginInstance.i18n["share.setting.basic"],
    label: "文档发布",
    content: PublishPlatformSelect,
    props: {
      pluginInstance: props.pluginInstance,
    }
  },
  {
    // label: props.pluginInstance.i18n["share.setting.basic"],
    label: "账号设置",
    content: AccountSetting,
    props: {
      pluginInstance: props.pluginInstance,
    }
  },
  {
    // label: props.pluginInstance.i18n["share.setting.basic"],
    label: "图床设置",
    content: PublishPlatformSelect,
    props: {
      pluginInstance: props.pluginInstance,
    }
  },
  {
    // label: props.pluginInstance.i18n["share.setting.basic"],
    label: "偏好设置",
    content: GeneralSetting,
    props: {
      pluginInstance: props.pluginInstance,
    }
  }
]
const activeTab = 0
</script>

<template>
  <div id="publisher">
    <Tab :tabs="tabs" :active-tab="activeTab" :vertical="true"/>
  </div>
</template>

<style scoped>

</style>