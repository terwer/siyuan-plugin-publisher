<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { defineEmits, defineProps, ref } from "vue"

const props = withDefaults(
  defineProps<{
    tabs: { label: string; content: any; props?: Record<string, any> }[];
    activeTab: number;
    vertical: boolean;
  }>(),
  {
    tabs: [] as any,
    activeTab: 0,
    vertical: false,
  },
)

const emit = defineEmits<{
  (event: "tabChange", index: number): void;
}>()

const activeIndex = ref(props.activeTab)
const isCollapsed = ref(true)

function handleTabClick(index: number) {
  if (index !== activeIndex.value) {
    activeIndex.value = index
    emit("tabChange", index)
  }
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div :class="['tabs', { vertical }]">
    <div class="tab-list-container">
      <div class="tab-list" :class="{ collapsed: isCollapsed }">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab"
          :class="{ active: index === activeIndex }"
          @click="handleTabClick(index)"
        >
          {{ tab.label }}
        </button>
      </div>
      <!-- 将折叠按钮移动到这里 -->
      <button v-if="vertical" class="collapse-btn" @click="toggleCollapse">
        {{ isCollapsed ? "❯" : "❮" }}
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="tab-content">
      <template v-if="tabs[activeIndex]">
        <component
          v-if="
            typeof tabs[activeIndex].content === 'function' ||
            typeof tabs[activeIndex].content === 'object'
          "
          :is="tabs[activeIndex].content"
          v-bind="tabs[activeIndex].props"
        />
        <template v-else>
          {{ tabs[activeIndex].content }}
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.tabs
  display flex
  flex-direction column
  margin 0
  border-radius 8px
  overflow hidden
  background-color #fff
  box-shadow 0 1px 3px rgba(0, 0, 0, 0.1)

  &.vertical
    flex-direction row

.tab-list-container
  position relative
  display flex
  transition all 0.3s ease

.tab-list
  display flex
  flex-direction column
  width 100px
  border-right 1px solid #e0e0e0
  transition width 0.3s ease
  overflow hidden

  &.collapsed
    width 0
    border-right none

    & + .collapse-btn  // 折叠状态下的按钮位置
      left 0
      margin-left 4px

.collapse-btn
  position absolute
  left calc(100% + 4px)  // 位于tab列表右侧
  top 10px
  width 24px
  height 24px
  padding 0
  border none
  background var(--b3-theme-background)
  border-radius 4px
  box-shadow 0 2px 4px rgba(0, 0, 0, 0.1)
  cursor pointer
  z-index 99
  display flex
  align-items center
  justify-content center
  font-size 16px
  color var(--b3-theme-on-background)
  transition left 0.3s ease  // 添加过渡效果

// 保持其他样式不变...
.tab
  padding 8px 12px
  border none
  background-color transparent
  cursor pointer
  position relative
  font-size 12px
  color #555
  transition background-color 0.2s ease
  white-space nowrap
  border-bottom 1px solid #e0e0e0

  &:last-child
    border-bottom none

  &.active
    background-color var(--b3-list-hover)
    color var(--b3-theme-on-background)

.tab-content
  flex 1
  background-color #fff
  min-width 0
  position relative
  padding-left 32px

// 暗黑模式适配
html[data-theme-mode="dark"]
  .tabs
    background-color var(--b3-theme-background)

    .tab-content
      background-color #2a2a2a

    // 垂直模式样式
    &.vertical
      .tab-list
        border-right 1px solid var(--b3-theme-surface-lighter)

      .tab:not(:last-child)
        border-bottom 1px solid var(--b3-theme-surface-lighter)

    // 非垂直模式样式
    &:not(.vertical)
      .tab:not(:last-child)
        border-right 1px solid var(--b3-theme-surface-lighter)

  .tab-list
    color #fff
    border-right-color var(--b3-theme-surface-lighter)
    border-bottom 1px solid var(--b3-theme-surface-lighter)

  .collapse-btn
    background var(--b3-theme-surface)
    box-shadow 0 2px 4px rgba(0, 0, 0, 0.3)
</style>
