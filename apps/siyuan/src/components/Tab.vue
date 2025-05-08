<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ref, watch } from "vue"

const props = withDefaults(
  defineProps<{
    tabs: { label: string; content: any; props?: Record<string, any> }[]
    activeTab?: number
    vertical?: boolean
    collapsed?: boolean
  }>(),
  {
    activeTab: 0,
    vertical: false,
    collapsed: false,
  },
)

const emit = defineEmits<{
  (e: "tabChange", index: number): void
}>()

const activeIndex = ref(props.activeTab)
const isCollapsed = ref(props.collapsed)

watch(
  () => props.activeTab,
  (newVal) => {
    activeIndex.value = newVal
  },
)

watch(
  () => props.collapsed,
  (newVal) => {
    isCollapsed.value = newVal
  },
)

const handleTabClick = (index: number) => {
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
  <div :class="['tabs-container', { vertical }]">
    <div class="tab-controls" :class="{ collapsed: isCollapsed }">
      <div class="tab-list">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-button"
          :class="{ active: index === activeIndex }"
          @click.stop="handleTabClick(index)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <button class="collapse-handle" @click.stop="toggleCollapse">
      <svg class="collapse-icon" viewBox="0 0 24 24">
        <path
          v-if="isCollapsed"
          d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01z"
        />
        <path
          v-else
          d="M14.71 6.71a1 1 0 0 0-1.41 0L8.71 11.3a1 1 0 0 0 0 1.41l4.59 4.59a1 1 0 1 0 1.41-1.41L10.83 12l3.88-3.88a1 1 0 0 0 0-1.41z"
        />
      </svg>
    </button>

    <div class="tab-content-wrapper">
      <component
        v-if="tabs[activeIndex]?.content"
        :is="tabs[activeIndex].content"
        v-bind="tabs[activeIndex].props"
        class="tab-content"
      />
    </div>
  </div>
</template>

<style lang="stylus" scoped>
// 设计变量
$tab-width = 100px
$control-size = 32px
$transition-duration = 0.3s
$border-radius = 8px

.tabs-container
  --pt-tabs-bg: #fff
  --pt-tabs-controls-bg: #f8f9fa
  --pt-tabs-border: #e0e0e0
  --pt-tabs-text: #495057
  --pt-tabs-hover-bg: #f1f3f5
  --pt-tabs-active-bg: #e9ecef
  --pt-tabs-active-text: #212529
  --pt-tabs-active-indicator: #1971c2
  --pt-tabs-shadow: rgba(0,0,0,0.1)
  --pt-tabs-shadow-hover: rgba(0,0,0,0.2)
  --pt-tabs-control-icon: #6c757d
  --pt-tabs-content-bg: #fff

  // 暗黑模式变量覆盖
  html[data-theme-mode="dark"] &
    --pt-tabs-bg: #2d2d2d
    --pt-tabs-controls-bg: #363636
    --pt-tabs-border: rgba(255,255,255,0.1)
    --pt-tabs-text: rgba(255,255,255,0.8)
    --pt-tabs-hover-bg: rgba(255,255,255,0.05)
    --pt-tabs-active-bg: rgba(255,255,255,0.1)
    --pt-tabs-active-text: #fff
    --pt-tabs-active-indicator: #2196f3
    --pt-tabs-shadow: rgba(0,0,0,0.3)
    --pt-tabs-shadow-hover: rgba(0,0,0,0.5)
    --pt-tabs-control-icon: rgba(255,255,255,0.7)
    --pt-tabs-content-bg: #1f1f1f

  // 布局样式
  display flex
  width 100%
  height 100%
  background var(--pt-tabs-bg)
  border-radius $border-radius
  box-shadow 0 2px 8px var(--pt-tabs-shadow)
  position relative

  &.vertical
    flex-direction row
    overflow hidden

    .tab-controls
      width $tab-width
      transition width $transition-duration ease, border $transition-duration ease
      border-right 1px solid var(--pt-tabs-border)
      overflow hidden
      position relative
      height 100%

      &.collapsed
        width 0
        border-right-color transparent
        height 0
        position absolute
        z-index -1

.tab-controls
  position relative
  background var(--pt-tabs-controls-bg)
  flex-shrink 0
  height 100%

.tab-list
  width $tab-width
  min-width $tab-width
  height 100%

.tab-button
  display flex
  width 100%
  padding 12px 20px
  border none
  background none
  color var(--pt-tabs-text)
  font-size 14px
  text-align left
  cursor pointer
  transition all 0.2s ease
  position relative

  &:hover:not(.active)
    background var(--pt-tabs-hover-bg)

  &.active
    background var(--pt-tabs-active-bg)
    color var(--pt-tabs-active-text)
    &::after
      content ''
      position absolute
      right 0
      top 50%
      transform translateY(-50%)
      height 60%
      width 3px
      background var(--pt-tabs-active-indicator)
      border-radius 2px

.collapse-handle
  position absolute
  left $tab-width
  top 32px
  width $control-size
  height $control-size
  padding 6px
  background var(--pt-tabs-controls-bg)
  border 1px solid var(--pt-tabs-border)
  border-radius 50%
  box-shadow 0 2px 8px var(--pt-tabs-shadow)
  cursor pointer
  transition all $transition-duration ease
  z-index 100
  transform translateX(-50%)
  display flex
  align-items center
  justify-content center

  .tabs-container.vertical .collapsed + &
    left 4px
    background var(--pt-tabs-bg)
    border-color var(--pt-tabs-border)
    box-shadow 2px 0 8px var(--pt-tabs-shadow)
    padding-left 8px
    padding-right 4px

  &:hover
    transform translateX(-50%) scale(1.1)
    box-shadow 0 4px 12px var(--pt-tabs-shadow-hover)
    background var(--pt-tabs-hover-bg)

  .collapse-icon
    width 16px
    height 16px
    fill var(--pt-tabs-control-icon)
    transition transform $transition-duration ease

    .tabs-container.vertical .collapsed + .collapse-handle &
      transform rotate(180deg)

.tab-content-wrapper
  flex 1
  min-width 0
  height 100%
  background var(--pt-tabs-content-bg)
  padding 2px 6px
  display flex
  flex-direction column
  overflow hidden

  .tab-content
    flex 1
    display flex
    flex-direction column
    gap 4px
    // 注意：b3-menu__items是最外层已经设置了，这里不能设置
    // 否则会出现双滚动条
    //overflow-y auto
</style>
