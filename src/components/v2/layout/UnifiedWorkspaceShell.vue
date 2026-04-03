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
// ============================================
// 飞书/字节设计令牌 - 简化统一
// ============================================
$syp-nav-width = 200px
$syp-nav-bg = #ffffff
$syp-nav-border = #f0f0f0
$syp-nav-item-height = 40px
$syp-nav-item-padding = 10px 16px
$syp-nav-item-radius = 8px
$syp-nav-font-size = 14px

// 文字颜色 - 仅使用两种
$syp-text-primary = #1f2329
$syp-text-secondary = #8f959e

// 背景色 - 仅使用两种
$syp-bg-hover = #f5f6f7
$syp-bg-active = #eef2f7

.syp-shell
  display flex
  flex 1
  min-height 0
  overflow hidden

// 设置态下的侧边导航 - 简化设计
.syp-shell__nav
  width $syp-nav-width
  flex-shrink 0
  background $syp-nav-bg
  padding 20px 12px
  display flex
  flex-direction column
  gap 4px
  border-right 1px solid $syp-nav-border

.syp-shell__section-title
  font-size 12px
  font-weight 500
  color $syp-text-secondary
  padding 8px 16px 12px
  margin-bottom 8px

.syp-shell__nav-item
  height $syp-nav-item-height
  padding $syp-nav-item-padding
  font-size $syp-nav-font-size
  color $syp-text-primary
  background transparent
  border none
  border-radius $syp-nav-item-radius
  text-align left
  cursor pointer
  transition all 0.15s ease
  display flex
  align-items center

  &:hover
    background $syp-bg-hover

  &.is-active
    background $syp-bg-active
    color $syp-text-primary
    font-weight 500

.syp-shell__main
  flex 1
  min-width 0
  min-height 0
  overflow-y auto
  padding 24px
  background #ffffff
</style>
