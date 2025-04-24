<script lang="ts" setup>
import Tab from "../../components/Tab.vue"
import AccountSetting from "../Setting/AccountSetting.vue"
import GeneralSetting from "../Setting/GeneralSetting.vue"
import PublishPlatformSelect from "./PublishPlatformSelect.vue"
import DashBoard from "../Setting/DashBoard.vue"
import {ref} from "vue"
import {   TabEnum} from "../../constants/TabEnum.ts"

const props = defineProps<{
  pluginInstance: any,
}>()

const tabs = [
  {
    key: TabEnum.PUBLISH,
    label: props.pluginInstance.i18n.publish.publish,
    content: PublishPlatformSelect,
    props: {
      pluginInstance: props.pluginInstance,
      // 注入动态切换方法
      requestSwitchTab: (componentType: TabEnum) => switchTabByComponent(componentType)
    }
  },
  {
    key: TabEnum.ACCOUNT,
    label: props.pluginInstance.i18n.account.account,
    content: AccountSetting,
    props: {
      pluginInstance: props.pluginInstance,
    }
  },
  {
    key: TabEnum.PICBED,
    label: props.pluginInstance.i18n.picbed.picbed,
    content: PublishPlatformSelect,
    props: {
      pluginInstance: props.pluginInstance,
    }
  },
  {
    key: TabEnum.PREFERENCE,
    label: props.pluginInstance.i18n.preference.preference,
    content: GeneralSetting,
    props: {
      pluginInstance: props.pluginInstance,
    }
  },
  {
    key: TabEnum.DASHBOARD,
    label: props.pluginInstance.i18n.dashboard.dashboard,
    content: DashBoard,
    props: {
      pluginInstance: props.pluginInstance,
    }
  }
]
const activeTab = ref(0)
const isCollapsed = ref(true)

// 智能切换方法
const switchTabByComponent = (curTab: TabEnum) => {
  const targetIndex = tabs.findIndex(
      tab => tab.key === curTab
  )

  if (targetIndex === -1) {
    console.error('目标标签页不存在')
    return
  }

  activeTab.value = targetIndex
  isCollapsed.value = false
}

const onTabChange = () => {

}

</script>

<template>
  <div id="publisher">
    <Tab :tabs="tabs" :active-tab="activeTab" :vertical="true" :collapsed="isCollapsed" @tab-change="onTabChange"/>
  </div>
</template>

<style scoped>
</style>