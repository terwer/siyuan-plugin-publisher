<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { helpRegistry } from "~/src/helpConfigs/registry"

defineOptions({ name: "HelpPanel" })

const { t } = useVueI18n()

const props = defineProps({
  pageId: { type: String, required: true },
  pageTitle: { type: String, default: "" },
  triggerEl: { type: HTMLElement as any, default: null },
})

const emit = defineEmits(["close", "startTour"])

const panelRef = ref<HTMLElement | null>(null)

const config = computed(() => helpRegistry.get(props.pageId))
const isDefault = computed(() => !helpRegistry.hasConfig(props.pageId))
const panelTitle = computed(() => props.pageTitle || t("common.help"))
const hasTour = computed(() => {
  const tourData = config.value.tour
  return Array.isArray(tourData) && tourData.length > 0
})
const hasFaq = computed(() => {
  const faqData = config.value.faq
  return Array.isArray(faqData) && faqData.length > 0
})

// Find .syp-v2 as teleport target (avoids .syp-panel overflow:hidden clipping)
const teleportTarget = computed<HTMLElement | null>(() => {
  if (!props.triggerEl) return null
  return (props.triggerEl as HTMLElement).closest(".syp-v2") as HTMLElement | null
})

const PANEL_WIDTH = 380
const GAP = 4

const popoverStyle = ref<Record<string, string>>({})

const updatePosition = () => {
  if (!props.triggerEl || !teleportTarget.value) return
  const btnRect = (props.triggerEl as HTMLElement).getBoundingClientRect()
  const containerRect = teleportTarget.value.getBoundingClientRect()

  // Position below the ? button, extending rightward (like a dropdown)
  const relLeft = btnRect.left - containerRect.left
  let top = btnRect.bottom - containerRect.top + GAP

  // Clamp left so panel stays within container
  const maxLeft = containerRect.width - PANEL_WIDTH - 12
  const left = Math.max(12, Math.min(relLeft, maxLeft))

  // If too close to bottom edge, show above the button
  if (top + 320 > containerRect.height) {
    top = btnRect.top - containerRect.top - 320 - GAP
    if (top < 4) top = 4
  }

  popoverStyle.value = {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    width: `${PANEL_WIDTH}px`,
  }
}

const onDocumentMouseDown = (e: MouseEvent) => {
  const target = e.target as Node
  if (panelRef.value && !panelRef.value.contains(target)) {
    if (props.triggerEl && (props.triggerEl as HTMLElement).contains(target)) return
    emit("close")
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("close")
}

const onScroll = () => updatePosition()
const onResize = () => updatePosition()

onMounted(() => {
  document.addEventListener("mousedown", onDocumentMouseDown, true)
  document.addEventListener("keydown", onKeyDown)
  window.addEventListener("scroll", onScroll, true)
  window.addEventListener("resize", onResize)
  nextTick(() => updatePosition())
})

onUnmounted(() => {
  document.removeEventListener("mousedown", onDocumentMouseDown, true)
  document.removeEventListener("keydown", onKeyDown)
  window.removeEventListener("scroll", onScroll, true)
  window.removeEventListener("resize", onResize)
})

const onOpenHelpUrl = () => {
  const url = helpRegistry.getHelpUrl(props.pageId)
  if (url) window.open(url, "_blank")
}

const onStartTour = () => {
  emit("startTour")
  emit("close")
}
</script>

<template>
  <Teleport v-if="teleportTarget" :to="teleportTarget">
    <div ref="panelRef" class="syp-help-panel-popover" :style="popoverStyle">
      <div class="syp-help-panel-popover__header">
        <span class="syp-help-panel-popover__title">{{ panelTitle }}</span>
        <button type="button" class="syp-help-panel-popover__close" @click="emit('close')">&times;</button>
      </div>

      <div class="syp-help-panel-popover__body">
        <!-- Summary -->
        <div v-if="config.summary" class="syp-help-panel-popover__section">
          <p class="syp-help-panel-popover__summary">{{ config.summary }}</p>
        </div>

        <!-- Default fallback -->
        <div v-if="isDefault" class="syp-help-panel-popover__section">
          <p class="syp-help-panel-popover__fallback-text">{{ t("v2.help.notConfigured") }}</p>
        </div>

        <!-- Help URL link -->
        <div class="syp-help-panel-popover__section">
          <el-link type="primary" :underline="false" @click="onOpenHelpUrl">
            <span class="syp-help-panel-popover__link-text">{{ t("v2.help.viewFullDoc") }}</span>
            <el-icon class="syp-help-panel-popover__link-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M851.456 176.64H172.544A96 96 0 0 0 76.8 272.64v481.28a96 96 0 0 0 95.744 96h678.912a96 96 0 0 0 95.744-96V272.64a96 96 0 0 0-95.744-96M172.544 240.64h678.912a32 32 0 0 1 31.744 32v81.92H140.8v-81.92a32 32 0 0 1 31.744-32m678.912 544H172.544a32 32 0 0 1-31.744-32V420.48h742.4v332.16a32 32 0 0 1-31.744 32"/></svg>
            </el-icon>
          </el-link>
        </div>

        <!-- FAQ -->
        <div v-if="hasFaq" class="syp-help-panel-popover__section">
          <h4 class="syp-help-panel-popover__section-title">{{ t("v2.help.faq") }}</h4>
          <div v-for="(item, index) in config.faq" :key="index" class="syp-help-panel-popover__faq-item">
            <p class="syp-help-panel-popover__faq-q">{{ item.q }}</p>
            <p class="syp-help-panel-popover__faq-a">{{ item.a }}</p>
          </div>
        </div>

        <!-- Start Tour -->
        <div v-if="hasTour" class="syp-help-panel-popover__section syp-help-panel-popover__tour-section">
          <el-button type="primary" class="syp-help-panel-popover__tour-btn" @click="onStartTour">
            {{ t("v2.help.startTour") }}
          </el-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="stylus">
.syp-help-panel-popover
  display flex
  flex-direction column
  background var(--el-bg-color)
  border 1px solid var(--el-border-color-light)
  border-radius 12px
  box-shadow 0 8px 32px rgba(0, 0, 0, 0.14)
  z-index 1100
  overflow hidden
  max-height 60vh

  &__header
    display flex
    align-items center
    justify-content space-between
    padding 10px 14px
    border-bottom 1px solid var(--el-border-color-lighter)
    flex-shrink 0

  &__title
    font-size 14px
    font-weight 600
    color var(--el-text-color-primary)

  &__close
    width 24px
    height 24px
    display inline-flex
    align-items center
    justify-content center
    border none
    background transparent
    color var(--el-text-color-secondary)
    font-size 18px
    cursor pointer
    border-radius 6px
    padding 0
    line-height 1
    &:hover
      background var(--el-fill-color-light)
      color var(--el-text-color-primary)

  &__body
    padding 12px 14px
    overflow-y auto
    flex 1 1 auto

  &__section
    margin-bottom 14px
    &:last-child
      margin-bottom 0

  &__section-title
    font-size 13px
    font-weight 600
    color var(--el-text-color-primary)
    margin 0 0 8px 0

  &__summary
    font-size 13px
    color var(--el-text-color-regular)
    line-height 1.6
    margin 0

  &__fallback-text
    font-size 13px
    color var(--el-text-color-secondary)
    margin 0

  &__link-text
    font-size 13px

  &__link-icon
    margin-left 4px
    font-size 12px

  &__faq-item
    margin-bottom 10px
    &:last-child
      margin-bottom 0

  &__faq-q
    font-size 13px
    font-weight 500
    color var(--el-color-primary)
    margin 0 0 4px 0

  &__faq-a
    font-size 13px
    color var(--el-text-color-regular)
    margin 0
    line-height 1.5

  &__tour-section
    padding-top 8px
    border-top 1px solid var(--el-border-color-lighter)

  &__tour-btn
    width 100%
</style>