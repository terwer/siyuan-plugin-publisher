<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
    defineProps<{
      tabs: { label: string; content: any; props?: Record<string, any> }[]
      activeTab?: number
      vertical?: boolean
    }>(),
    {
      activeTab: 0,
      vertical: false
    }
)

const emit = defineEmits<{
  (e: 'tabChange', index: number): void
}>()

const activeIndex = ref(props.activeTab)
const isCollapsed = ref(true)

watch(
    () => props.activeTab,
    (newVal) => {
      activeIndex.value = newVal
    }
)

const handleTabClick = (index: number) => {
  if (index !== activeIndex.value) {
    activeIndex.value = index
    emit('tabChange', index)
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
            @click="handleTabClick(index)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <button class="collapse-handle" @click="toggleCollapse">
      <svg class="collapse-icon" viewBox="0 0 24 24">
        <path v-if="isCollapsed" d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01z"/>
        <path v-else d="M14.71 6.71a1 1 0 0 0-1.41 0L8.71 11.3a1 1 0 0 0 0 1.41l4.59 4.59a1 1 0 1 0 1.41-1.41L10.83 12l3.88-3.88a1 1 0 0 0 0-1.41z"/>
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

<style lang="stylus">
// 设计变量
$tab-width = 100px
$control-size = 32px
$transition-duration = 0.3s
$border-radius = 8px

.tabs-container
  // 定义带前缀的 CSS 变量
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

  // 布局样式（无需修改）
  display flex
  height 100%
  background var(--pt-tabs-bg)
  border-radius $border-radius
  box-shadow 0 2px 8px var(--pt-tabs-shadow)
  position relative

  &.vertical
    flex-direction row
    overflow visible

    .tab-controls
      width $tab-width
      transition width $transition-duration ease, border $transition-duration ease
      border-right 1px solid var(--pt-tabs-border)
      overflow hidden

      &.collapsed
        width 0
        border-right-color transparent

.tab-controls
  position relative
  background var(--pt-tabs-controls-bg)
  flex-shrink 0

.tab-list
  width $tab-width
  min-width $tab-width

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
  top 24px
  width $control-size
  height $control-size
  padding 8px
  background var(--pt-tabs-controls-bg)
  border none
  border-radius 50%
  box-shadow 0 2px 8px var(--pt-tabs-shadow)
  cursor pointer
  transition all $transition-duration ease
  z-index 10
  transform translateX(-50%)

  .tabs-container.vertical .collapsed + &
    left 10px

  &:hover
    transform translateX(-50%) scale(1.1)
    box-shadow 0 4px 12px var(--pt-tabs-shadow-hover)

  .collapse-icon
    width 100%
    height 100%
    fill var(--pt-tabs-control-icon)

.tab-content-wrapper
  flex 1
  min-width 0
  background var(--pt-tabs-content-bg)
  padding 24px
</style>