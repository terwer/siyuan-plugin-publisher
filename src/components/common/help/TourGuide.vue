<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { helpRegistry } from "~/src/helpConfigs/registry"
import type { TourStep } from "~/src/types/IPageHelpConfig"

defineOptions({ name: "TourGuide" })

const { t } = useVueI18n()

const props = defineProps({
  pageId: { type: String, required: true },
  triggerEl: { type: HTMLElement as any, default: null },
})

const emit = defineEmits(["close", "complete"])

const COMPLETED_KEY = `tour:completed:${props.pageId}`

const steps = computed<TourStep[]>(() => helpRegistry.getTour(props.pageId) ?? [])
const currentIndex = ref(0)
const currentStep = computed(() => steps.value[currentIndex.value] ?? null)
const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value >= steps.value.length - 1)
const isMissing = ref(false)

const teleportTarget = computed<HTMLElement | null>(() => {
  if (!props.triggerEl) return null
  return (props.triggerEl as HTMLElement).closest(".syp-v2") as HTMLElement | null
})

// Position state
const highlightStyle = ref<Record<string, string>>({})
const popoverStyle = ref<Record<string, string>>({})

const completeAndClose = () => {
  localStorage.setItem(COMPLETED_KEY, "completed")
  emit("complete")
  emit("close")
}

const cancel = () => {
  localStorage.setItem(COMPLETED_KEY, "completed")
  emit("close")
}

const clampIndex = () => {
  const max = steps.value.length - 1
  if (currentIndex.value > max) currentIndex.value = Math.max(0, max)
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    isMissing.value = false
  }
}

const next = () => {
  const maxIndex = steps.value.length - 1
  if (currentIndex.value >= maxIndex) {
    completeAndClose()
    return
  }
  currentIndex.value = Math.min(currentIndex.value + 1, maxIndex)
  isMissing.value = false
}

const skipToNext = () => {
  const maxIndex = steps.value.length - 1
  // Find next step with a valid target in the container
  for (let i = currentIndex.value + 1; i <= maxIndex; i++) {
    const target = findTarget(steps.value[i].target)
    if (target) {
      currentIndex.value = i
      isMissing.value = false
      return
    }
  }
  // No valid steps remaining
  completeAndClose()
}

const findTarget = (selector: string): HTMLElement | null => {
  if (!teleportTarget.value) return null
  return teleportTarget.value.querySelector(selector) as HTMLElement | null
}

const isCompleted = (): boolean => {
  try {
    return localStorage.getItem(COMPLETED_KEY) === "completed"
  } catch {
    return false
  }
}

const updatePosition = () => {
  const step = currentStep.value
  if (!step || !teleportTarget.value) return

  const targetEl = findTarget(step.target)
  if (!targetEl) {
    isMissing.value = true
    highlightStyle.value = { display: "none" }
    return
  }

  isMissing.value = false
  const targetRect = targetEl.getBoundingClientRect()
  const containerRect = teleportTarget.value.getBoundingClientRect()
  const padding = 8
  const popoverWidth = 320
  const gap = 12

  highlightStyle.value = {
    position: "absolute",
    left: `${targetRect.left - containerRect.left - padding}px`,
    top: `${targetRect.top - containerRect.top - padding}px`,
    width: `${targetRect.width + padding * 2}px`,
    height: `${targetRect.height + padding * 2}px`,
    borderRadius: "8px",
    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
    pointerEvents: "none",
    zIndex: "10001",
    transition: "all 0.3s ease",
  }

  const placement = step.placement ?? "bottom"
  let top = targetRect.bottom - containerRect.top + gap
  if (placement === "top" || top + 200 > containerRect.height) {
    top = targetRect.top - containerRect.top - 200 - gap
    if (top < 0) top = gap
  }

  let left = targetRect.left - containerRect.left
  if (left + popoverWidth > containerRect.width) {
    left = containerRect.width - popoverWidth - 16
  }
  if (left < 8) left = 8

  popoverStyle.value = {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
    width: `${popoverWidth}px`,
    zIndex: "10002",
    transition: "all 0.3s ease",
  }

  targetEl.scrollIntoView({ behavior: "smooth", block: "center" })
}

let resizeObserver: ResizeObserver | null = null

const observeTarget = () => {
  resizeObserver?.disconnect()
  const target = currentStep.value?.target ? findTarget(currentStep.value.target) : null
  if (target) resizeObserver?.observe(target)
}

onMounted(() => {
  // Clamp index on mount in case of stale state
  clampIndex()
  nextTick(() => updatePosition())

  resizeObserver = new ResizeObserver(() => updatePosition())
  observeTarget()

  window.addEventListener("scroll", updatePosition, true)
  window.addEventListener("resize", updatePosition)
})

watch(currentIndex, () => {
  nextTick(() => updatePosition())
  observeTarget()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener("scroll", updatePosition, true)
  window.removeEventListener("resize", updatePosition)
})

defineExpose({ isCompleted })
</script>

<template>
  <Teleport v-if="teleportTarget && steps.length > 0" :to="teleportTarget">
    <div class="syp-tour-overlay">
      <div class="syp-tour-overlay__backdrop" @click="cancel" />

      <div class="syp-tour-overlay__highlight" :style="highlightStyle" />

      <div v-if="currentStep" class="syp-tour-overlay__popover" :style="popoverStyle">
        <div class="syp-tour-overlay__popover-header">
          <span class="syp-tour-overlay__popover-step">{{ currentIndex + 1 }} / {{ steps.length }}</span>
          <span class="syp-tour-overlay__popover-title">{{ currentStep.title }}</span>
        </div>
        <div class="syp-tour-overlay__popover-body">
          <p class="syp-tour-overlay__popover-content">{{ currentStep.content }}</p>
        </div>
        <div class="syp-tour-overlay__popover-footer">
          <el-button size="small" @click="cancel">{{ t("common.skip") }}</el-button>
          <div class="syp-tour-overlay__popover-nav">
            <el-button v-if="!isFirst" size="small" @click="prev">{{ t("common.prev") }}</el-button>
            <el-button size="small" type="primary" @click="next">
              {{ isLast ? t("common.done") : t("common.next") }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- Fallback when target element is missing -->
      <div v-else-if="isMissing" class="syp-tour-overlay__popover syp-tour-overlay__popover--missing" :style="popoverStyle">
        <div class="syp-tour-overlay__popover-header">
          <span class="syp-tour-overlay__popover-title">{{ t("v2.help.tourStepNotFound") }}</span>
        </div>
        <div class="syp-tour-overlay__popover-body">
          <p class="syp-tour-overlay__popover-content">{{ t("v2.help.tourStepNotFoundDesc") }}</p>
        </div>
        <div class="syp-tour-overlay__popover-footer">
          <el-button size="small" @click="cancel">{{ t("common.skip") }}</el-button>
          <el-button size="small" type="primary" @click="skipToNext">{{ t("v2.help.tourSkipStep") }}</el-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="stylus">
.syp-tour-overlay
  position absolute
  inset 0
  z-index 10000
  pointer-events auto

  &__backdrop
    position absolute
    inset 0
    background rgba(0, 0, 0, 0.45)
    cursor pointer

  &__popover
    background var(--el-bg-color)
    border-radius 12px
    box-shadow 0 6px 24px rgba(0, 0, 0, 0.15)
    padding 16px

    &--missing
      left 50%
      top 50%
      transform translate(-50%, -50%)
      width 340px
      z-index 10002

    &-header
      margin-bottom 8px

    &-step
      font-size 12px
      color var(--el-text-color-secondary)
      display block
      margin-bottom 4px

    &-title
      font-size 15px
      font-weight 600
      color var(--el-text-color-primary)

    &-body
      margin-bottom 12px

    &-content
      font-size 13px
      color var(--el-text-color-regular)
      line-height 1.5
      margin 0

    &-footer
      display flex
      justify-content space-between
      align-items center

    &-nav
      display flex
      gap 8px
</style>