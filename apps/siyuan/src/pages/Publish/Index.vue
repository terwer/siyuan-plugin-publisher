<script lang="ts" setup>
import Tab from "../../components/Tab.vue"
import AccountSetting from "../Setting/AccountSetting.vue"
import GeneralSetting from "../Setting/GeneralSetting.vue"
import PublishPlatformSelect from "./PublishPlatformSelect.vue"
import DashBoard from "../Setting/DashBoard.vue";

const props = defineProps<{
  pluginInstance: any,
}>()

const tabs = [
  {
    label: props.pluginInstance.i18n.publish.publish,
    content: PublishPlatformSelect,
    props: {
      pluginInstance: props.pluginInstance,
    }
  },
  {
    label: props.pluginInstance.i18n.account.account,
    content: AccountSetting,
    props: {
      pluginInstance: props.pluginInstance,
    }
  },
  {
    label: props.pluginInstance.i18n.picbed.picbed,
    content: PublishPlatformSelect,
    props: {
      pluginInstance: props.pluginInstance,
    }
  },
  {
    label: props.pluginInstance.i18n.preference.preference,
    content: GeneralSetting,
    props: {
      pluginInstance: props.pluginInstance,
    }
  },
  {
    label: props.pluginInstance.i18n.dashboard.dashboard,
    content: DashBoard,
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