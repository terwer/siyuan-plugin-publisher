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
import { TabEnum } from "@enums/TabEnum.ts"
import DocPublish from "@pages/publish/DocPublish.vue"
import AccountSetting from "@pages/setting/AccountSetting.vue"
import DashBoard from "@pages/setting/DashBoard.vue"
import GeneralSetting from "@pages/setting/GeneralSetting.vue"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
// import { createAppLogger } from "@utils/appLogger.ts"

const props = defineProps<{
  pluginInstance: any
}>()

// const logger = createAppLogger("publish-index")
const activeTab = ref(0)
const isCollapsed = ref(true)
const tabs = [
  {
    key: TabEnum.PUBLISH,
    label: props.pluginInstance.i18n.publish.publish,
    content: DocPublish,
    props: {
      pluginInstance: props.pluginInstance,
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
      requestSwitchTab: (componentType: TabEnum) =>
        switchTabByComponent(componentType),
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
      requestSwitchTab: (componentType: TabEnum) =>
        switchTabByComponent(componentType),
    },
  },
  {
    key: TabEnum.DASHBOARD,
    label: props.pluginInstance.i18n.dashboard.dashboard,
    content: DashBoard,
    props: {
      pluginInstance: props.pluginInstance,
      requestSwitchTab: (componentType: TabEnum) =>
        switchTabByComponent(componentType),
    },
  },
]

const route = useRoute()

// 暴露给外部调用的方法
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

// 处理路由参数
onMounted(() => {
  const tabParam = route.query.tab as string
  if (tabParam) {
    const targetTab = Object.values(TabEnum).find((tab) => tab === tabParam)
    if (targetTab) {
      switchTabByComponent(targetTab as TabEnum)
    }
  }
})
</script>

<template>
  <div class="publish-container">
    <Tab
      :tabs="tabs"
      :active-tab="activeTab"
      :vertical="true"
      :collapsed="isCollapsed"
      @tab-change="onTabChange"
    />
  </div>
</template>

<style lang="stylus" scoped>
.publish-container
  width 100%
  height 100%
  display flex
  flex-direction column
  overflow hidden
</style>
