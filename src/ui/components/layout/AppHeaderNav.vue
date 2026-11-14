<template>
  <nav class="syp-header-nav" :aria-label="t('app.nav.label')">
    <SypTooltip
      v-for="entry in entries"
      :key="entry.key"
      :content="entry.disabled ? t(entry.disabledReasonKey) : ''"
      ellipsis
      inline-flex
      tag="button"
      class="syp-btn syp-btn-quiet syp-btn-text-entry"
      :class="{ 'is-active': entry.active, 'is-disabled': entry.disabled }"
      type="button"
      :aria-label="t(LABEL_KEYS[entry.key])"
      :aria-current="entry.active ? 'page' : undefined"
      :aria-disabled="entry.disabled ? 'true' : undefined"
      @click="$emit('select', entry.key, entry.disabled)"
    >
      <component :is="ICONS[entry.key]" />
      <span class="syp-btn-text-entry__label">{{ t(LABEL_KEYS[entry.key]) }}</span>
    </SypTooltip>
  </nav>
</template>

<script setup lang="ts">
import type { Component } from "vue"
import SypTooltip from "~/src/ui/components/common/SypTooltip.vue"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import type { HeaderNavEntry, HeaderNavKey } from "~/src/ui/composables/useHeaderNav.ts"
import LucideRocket from "~icons/lucide/rocket"
import LucidePenLine from "~icons/lucide/pen-line"
import LucideLayers from "~icons/lucide/layers"
import LucideHouse from "~icons/lucide/house"
import LucideSettings from "~icons/lucide/settings"

/**
 * 顶部常驻导航。
 *
 * 这里只负责把入口画出来：入口集合与顺序完全由 `entries` 决定，
 * 组件内部不做任何条件渲染，也不把入口换成「返回」——当前所在项只做高亮。
 */
defineProps<{
  entries: HeaderNavEntry[]
}>()

defineEmits<{
  (event: "select", key: HeaderNavKey, disabled: boolean): void
}>()

const { t } = useAppI18n()

// 文案复用既有入口文案：界面与文档/帮助里的称呼保持同一口径
const LABEL_KEYS: Record<HeaderNavKey, string> = {
  quick_publish: "app.panel.quickPublish",
  single_publish: "panel.singlePublish",
  batch_publish: "panel.batchPublish",
  manage: "app.action.openManage",
  settings: "app.action.openSettings",
}

const ICONS: Record<HeaderNavKey, Component> = {
  quick_publish: LucideRocket,
  single_publish: LucidePenLine,
  batch_publish: LucideLayers,
  manage: LucideHouse,
  settings: LucideSettings,
}
</script>

<style scoped lang="stylus">
@import "../../assets/variables.styl"

// 常驻导航轨道：把入口收拢成一组，位置与集合恒定
// 圆角与选中态均对齐现有规范：`.syp-shell__nav-item` 用 8px，主色用 $syp-primary
.syp-header-nav
  display flex
  align-items center
  gap 2px
  padding 2px
  border-radius $syp-radius-md
  background $syp-chip-bg

  // 触发器由 SypTooltip 渲染，节点上带的是 SypTooltip 的 scope id，
  // 故这里必须用 :deep 才能让样式真正落到按钮上
  :deep(.syp-btn-quiet)
    min-width 28px
    height 28px
    padding 0
    background transparent
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)
    border-radius $syp-radius-sm

    &:hover
      color $syp-primary
      background var(--b3-theme-surface-light, $syp-accent-hover-bg)

  :deep(.syp-btn-text-entry)
    display inline-flex
    align-items center
    padding 0 10px
    font-size 13px
    font-weight 500
    white-space nowrap

    svg
      width 15px
      height 15px
      flex-shrink 0
      margin-right 0

    .syp-btn-text-entry__label
      line-height 1
      margin-left 7px

    // 当前所在入口：蓝色高亮。固定用主色而不是主题 primary（部分主题的 primary 近黑），
    // 位置不随点击漂移，只强调「我在哪」
    &.is-active
      color #fff
      background $syp-primary
      font-weight 600
      box-shadow 0 2px 8px rgba(64, 128, 255, 0.28)

      &:hover
        color #fff
        background $syp-primary-light
        opacity 1

    // 暂不可用（如未打开文档时的详细发布）：留在原位并说明原因，不做隐藏
    &.is-disabled
      cursor not-allowed
      opacity 0.45

      &:hover
        color var(--b3-theme-on-surface-light, $syp-text-tertiary)
        background transparent
        opacity 0.45
</style>
