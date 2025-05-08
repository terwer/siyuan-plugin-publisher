<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { help } from "@/presets/help.ts"
import { createAppLogger } from "@/utils/appLogger"
import { useI18n } from "@composables/useI18n.ts"
import { ArrowLeft, HelpCircle } from "lucide-vue-next"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

// Props
const props = defineProps<{
  pluginInstance: any
  title: string
  hasBackEmit: boolean
  helpKey: string
  extra?: Array<{
    component: any
    props?: Record<string, any>
    onClick?: () => void
    text?: string
  }>
}>()

const logger = createAppLogger("back-page")
const { t } = useI18n(props.pluginInstance)
const router = useRouter()
const { query } = useRoute()

// Emits
const emit = defineEmits(["backEmit"])

// Data
const showBack = ref(query.showBack === "true")
const showHelpTooltip = ref(false)

// Computed
const helpUrl = computed(() => {
  return (
    (help as any)[props.helpKey] ||
    "https://siyuan.wiki/s/20230810132040-nn4q7vs"
  )
})

// Methods
const handleBack = () => {
  if (props.hasBackEmit) {
    logger.info("Triggering backEmit")
    emit("backEmit")
  } else {
    logger.info("Navigating back")
    router.back()
  }
}

const goToHelp = (url: string) => {
  window.open(url, "_blank")
}

const toggleHelpTooltip = (state: boolean) => {
  showHelpTooltip.value = state
}
</script>

<template>
  <div class="back-page">
    <div v-if="showBack" class="page-header">
      <div class="header-left">
        <button class="back-btn" @click.stop="handleBack">
          <ArrowLeft class="icon" />
          <span class="text">{{ t("common.back") }}</span>
        </button>

        <div class="title-group">
          <h1 class="title">{{ props.title }}</h1>
          <div
            v-if="helpKey"
            class="help-container"
            @mouseenter="toggleHelpTooltip(true)"
            @mouseleave="toggleHelpTooltip(false)"
          >
            <button class="help-btn" @click.stop="goToHelp(helpUrl)">
              <HelpCircle class="icon" />
            </button>
            <div v-show="showHelpTooltip" class="help-tooltip">
              {{ t("common.help") }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="extra && extra.length > 0" class="header-extra">
        <slot name="extra">
          <template v-for="(item, _index) in extra" :key="_index">
            <component
              :is="item.component"
              v-bind="item.props || {}"
              @click.stop="item.onClick"
            >
              {{ item.text }}
            </component>
          </template>
        </slot>
      </div>
    </div>

    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<style lang="stylus" scoped>
// 设计变量
.back-page
  --pt-bg: #fff
  --pt-surface: #f8f9fa
  --pt-text: #212529
  --pt-text-light: #6c757d
  --pt-border: #dee2e6
  --pt-accent: #1971c2
  --pt-shadow: rgba(0, 0, 0, 0.1)
  width 100%
  min-width 800px

  // 暗黑模式变量覆盖
  html[data-theme-mode="dark"] &
    --pt-bg: #2d2d2d
    --pt-surface: #363636
    --pt-text: #f8f9fa
    --pt-text-light: #adb5bd
    --pt-border: #495057
    --pt-accent: #4dabf7
    --pt-shadow: rgba(0, 0, 0, 0.3)

  .page-header
    display flex
    align-items center
    justify-content space-between
    padding 12px 16px
    background var(--pt-bg)
    border-bottom 1px solid var(--pt-border)
    box-shadow 0 1px 2px 0 var(--pt-shadow)
    transition all 0.3s ease

    .header-left
      display flex
      align-items center

    .header-extra
      display flex
      align-items center
      gap 8px

    .back-btn
      display flex
      align-items center
      gap 6px
      padding 4px 8px
      border none
      background transparent
      border-radius 6px
      cursor pointer
      transition all 0.3s ease
      color var(--pt-text-light)
      font-size 14px

      &:hover
        background var(--pt-surface)
        color var(--pt-accent)

      .icon
        width 16px
        height 16px

    .title-group
      display flex
      align-items center
      gap 8px
      margin-left 12px

      .title
        margin 0
        font-size 18px
        font-weight 500
        color var(--pt-text)
        line-height 1.4

      .help-container
        position relative

        .help-btn
          display flex
          align-items center
          justify-content center
          width 28px
          height 28px
          padding 0
          border none
          background transparent
          border-radius 6px
          cursor pointer
          transition all 0.3s ease
          color var(--pt-text-light)

          &:hover
            background var(--pt-surface)
            color var(--pt-accent)

          .icon
            width 16px
            height 16px

        .help-tooltip
          position absolute
          top calc(100% + 2px)
          left 50%
          transform translateX(-50%)
          padding 2px 12px
          background var(--pt-surface)
          color var(--pt-text)
          font-size 12px
          border-radius 4px
          box-shadow 0 2px 8px var(--pt-shadow)
          border 1px solid var(--pt-border)
          white-space nowrap
          z-index 1000
          transition all 0.3s ease
          text-align center

          &::before
            content ''
            position absolute
            top -4px
            left 50%
            transform translateX(-50%)
            border-width 0 4px 4px
            border-style solid
            border-color transparent transparent var(--pt-border) transparent

          &::after
            content ''
            position absolute
            top -3px
            left 50%
            transform translateX(-50%)
            border-width 0 4px 4px
            border-style solid
            border-color transparent transparent var(--pt-surface) transparent

  .page-content
    padding 16px
    background var(--pt-bg)
    min-height calc(100vh - 64px)
</style>
