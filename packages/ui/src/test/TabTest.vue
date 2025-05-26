<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="pt-tab-test-container">
    <h1 class="pt-page-title">标签页测试</h1>

    <div class="pt-test-section">
      <h2 class="pt-section-title">基础标签页</h2>
      <div class="pt-tab-group">
        <Tab v-model="activeTab" @tabChange="handleTabChange">
          <TabPane name="tab1" label="标签页1">
            <div class="pt-tab-content">标签页1的内容</div>
          </TabPane>
          <TabPane name="tab2" label="标签页2">
            <div class="pt-tab-content">标签页2的内容</div>
          </TabPane>
          <TabPane name="tab3" label="标签页3">
            <div class="pt-tab-content">标签页3的内容</div>
          </TabPane>
        </Tab>
      </div>
    </div>

    <div class="pt-test-section">
      <h2 class="pt-section-title">垂直标签页</h2>
      <div class="pt-tab-group">
        <Tab v-model="activeVerticalTab" vertical @tabChange="handleVerticalTabChange">
          <TabPane name="vtab1" label="垂直标签页1">
            <div class="pt-tab-content">垂直标签页1的内容</div>
          </TabPane>
          <TabPane name="vtab2" label="垂直标签页2">
            <div class="pt-tab-content">垂直标签页2的内容</div>
          </TabPane>
          <TabPane name="vtab3" label="垂直标签页3">
            <div class="pt-tab-content">垂直标签页3的内容</div>
          </TabPane>
        </Tab>
      </div>
    </div>

    <div class="pt-test-section">
      <h2 class="pt-section-title">可折叠标签页</h2>
      <div class="pt-tab-group">
        <Tab v-model="activeCollapsedTab" vertical :collapsed="isCollapsed" @tabChange="handleCollapsedTabChange" @collapse="handleCollapse">
          <TabPane name="ctab1" label="可折叠标签页1">
            <div class="pt-tab-content">可折叠标签页1的内容</div>
          </TabPane>
          <TabPane name="ctab2" label="可折叠标签页2">
            <div class="pt-tab-content">可折叠标签页2的内容</div>
          </TabPane>
          <TabPane name="ctab3" label="可折叠标签页3">
            <div class="pt-tab-content">可折叠标签页3的内容</div>
          </TabPane>
        </Tab>
      </div>
    </div>

    <div class="pt-test-section">
      <h2 class="pt-section-title">禁用标签页</h2>
      <div class="pt-tab-group">
        <Tab v-model="activeDisabledTab" @tabChange="handleDisabledTabChange">
          <TabPane name="dtab1" label="标签页1">
            <div class="pt-tab-content">标签页1的内容</div>
          </TabPane>
          <TabPane name="dtab2" label="标签页2" disabled>
            <div class="pt-tab-content">标签页2的内容（禁用）</div>
          </TabPane>
          <TabPane name="dtab3" label="标签页3">
            <div class="pt-tab-content">标签页3的内容</div>
          </TabPane>
        </Tab>
      </div>
    </div>

    <div class="pt-test-section">
      <h2 class="pt-section-title">事件日志</h2>
      <div class="pt-event-log">
        <pre>{{ eventLog }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Tab from "../components/navigation/Tab.vue"
import TabPane from "../components/navigation/TabPane.vue"

const activeTab = ref("tab1")
const activeVerticalTab = ref("vtab1")
const activeCollapsedTab = ref("ctab1")
const activeDisabledTab = ref("dtab1")
const isCollapsed = ref(false)
const eventLog = ref<string[]>([])

const handleTabChange = (index: number) => {
  eventLog.value.push(`切换到标签页 ${index + 1}`)
}

const handleVerticalTabChange = (index: number) => {
  eventLog.value.push(`切换到垂直标签页 ${index + 1}`)
}

const handleCollapsedTabChange = (index: number) => {
  eventLog.value.push(`切换到可折叠标签页 ${index + 1}`)
}

const handleDisabledTabChange = (index: number) => {
  eventLog.value.push(`切换到禁用标签页 ${index + 1}`)
}

const handleCollapse = (collapsed: boolean) => {
  eventLog.value.push(`标签页${collapsed ? "折叠" : "展开"}`)
}
</script>

<style lang="stylus">
.pt-tab-test-container
  padding 20px

  h1
    margin-bottom 20px
    font-size 24px
    color var(--b3-theme-on-background)

  .pt-test-section
    margin-bottom 30px

    h2
      margin-bottom 16px
      font-size 18px
      color var(--b3-theme-on-background)

  .pt-tab-group
    width 100%
    height 300px
    border 1px solid var(--b3-border-color)
    border-radius 8px
    overflow hidden

  .pt-tab-content
    padding 20px
    color var(--b3-theme-on-background)

  .pt-event-log
    background var(--b3-theme-background)
    border 1px solid var(--b3-border-color)
    border-radius 4px
    padding 12px
    max-height 200px
    overflow-y auto

    pre
      margin 4px 0
      color var(--b3-theme-on-background)
      font-size 14px
</style>
