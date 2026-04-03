<template>
  <div class="syp-shell" :class="shellClass">
    <nav v-if="isSettingsView" class="syp-shell__nav">
      <div class="syp-shell__section-title">设置导航</div>
      <button
        v-for="item in navItems"
        :key="item.key"
        type="button"
        class="syp-shell__nav-item"
        :class="{ 'is-active': item.key === activeNavKey }"
        @click="$emit('change-section', item.key as 'account' | 'picbed' | 'preference')"
      >
        {{ item.label }}
      </button>
    </nav>

    <main class="syp-shell__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  currentView?: "quick_publish" | "settings"
  activeSection?: "account" | "picbed" | "preference"
}>()

defineEmits<{
  (event: "change-section", section: "account" | "picbed" | "preference"): void
}>()

const isSettingsView = computed(() => props.currentView === "settings")
const shellClass = computed(() => (isSettingsView.value ? "is-settings" : "is-quick-publish"))

const navItems = [
  { key: "account", label: "账号设置" },
  { key: "image-hosting", label: "图床设置" },
  { key: "preference", label: "偏好设置" },
]

const activeNavKey = computed(() => props.activeSection ?? "account")
</script>

<style scoped lang="stylus">
// 设计令牌 - 参考飞书/字节规范
$syp-nav-width = 200px
$syp-nav-bg = #f5f6f7
$syp-nav-item-height = 40px
$syp-nav-item-padding = 12px 16px
$syp-nav-item-radius = 6px
$syp-nav-item-gap = 4px
$syp-nav-font-size = 14px
$syp-nav-color = #1f2329
$syp-nav-color-muted = #646a73
$syp-nav-active-bg = #e1e3e6
$syp-nav-hover-bg = #e8eaed

.syp-shell
  display flex
  flex 1
  min-height 0
  overflow hidden

// 设置态下的侧边导航
.syp-shell__nav
  width $syp-nav-width
  flex-shrink 0
  background $syp-nav-bg
  padding 16px 12px
  display flex
  flex-direction column
  gap 8px
  border-right 1px solid #e1e3e6

.syp-shell__section-title
  font-size 12px
  font-weight 500
  color $syp-nav-color-muted
  text-transform uppercase
  letter-spacing 0.05em
  padding 8px 16px
  margin-bottom 4px

.syp-shell__nav-item
  height $syp-nav-item-height
  padding $syp-nav-item-padding
  font-size $syp-nav-font-size
  color $syp-nav-color
  background transparent
  border none
  border-radius $syp-nav-item-radius
  text-align left
  cursor pointer
  transition all 0.2s ease
  display flex
  align-items center
  gap 8px

  &:hover
    background $syp-nav-hover-bg

  &.is-active
    background $syp-nav-active-bg
    font-weight 500

.syp-shell__main
  flex 1
  min-width 0
  min-height 0
  overflow-y auto
  padding 24px
</style>
