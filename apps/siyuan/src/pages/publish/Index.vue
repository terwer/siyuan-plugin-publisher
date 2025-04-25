<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script lang="ts" setup>
import Tab from "@components/Tab.vue"
import DocPublish from "@pages/publish/DocPublish.vue"
import AccountSetting from "@pages/setting/AccountSetting.vue"
import GeneralSetting from "@pages/setting/GeneralSetting.vue"
import DashBoard from "@pages/setting/DashBoard.vue"
import { TabEnum } from "@enums/TabEnum.ts"
import { ref } from "vue"
// import { createAppLogger } from "@utils/appLogger.ts"

const props = defineProps<{
  pluginInstance: any
}>()

// const logger = createAppLogger("publish-index")

const tabs = [
  {
    key: TabEnum.PUBLISH,
    label: props.pluginInstance.i18n.publish.publish,
    content: DocPublish,
    props: {
      pluginInstance: props.pluginInstance,
      // 注入动态切换方法
      requestSwitchTab: (componentType: TabEnum) =>
        switchTabByComponent(componentType),
    },
  },
  {
    key: TabEnum.ACCOUNT,
    label: props.pluginInstance.i18n.account.account,
    content: AccountSetting,
    props: {
      pluginInstance: props.pluginInstance,
    },
  },
  // {
  //   key: TabEnum.PICBED,
  //   label: props.pluginInstance.i18n.picbed.picbed,
  //   content: PicBedSetting,
  //   props: {
  //     pluginInstance: props.pluginInstance,
  //   },
  // },
  {
    key: TabEnum.PREFERENCE,
    label: props.pluginInstance.i18n.preference.preference,
    content: GeneralSetting,
    props: {
      pluginInstance: props.pluginInstance,
    },
  },
  {
    key: TabEnum.DASHBOARD,
    label: props.pluginInstance.i18n.dashboard.dashboard,
    content: DashBoard,
    props: {
      pluginInstance: props.pluginInstance,
    },
  },
]
const activeTab = ref(2)
const isCollapsed = ref(false)

// 智能切换方法
const switchTabByComponent = (curTab: TabEnum) => {
  const targetIndex = tabs.findIndex((tab) => tab.key === curTab)

  if (targetIndex === -1) {
    return
  }

  activeTab.value = targetIndex
  isCollapsed.value = false
}

const onTabChange = (index: number) => {
  activeTab.value = index
}
</script>

<template>
  <div id="publisher">
    <Tab
      :tabs="tabs"
      :active-tab="activeTab"
      :vertical="true"
      :collapsed="isCollapsed"
      @tab-change="onTabChange"
    />
  </div>
</template>

<style scoped></style>
