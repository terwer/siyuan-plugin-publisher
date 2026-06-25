<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <Transition name="syp-error-details-panel">
    <div
      v-if="visible"
      ref="layerRef"
      class="syp-error-details-panel"
      tabindex="0"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      @click.self="emitClose"
      @keydown.esc.stop.prevent="emitClose"
    >
      <section class="syp-error-details-panel__card" @click.stop>
        <header class="syp-error-details-panel__header">
          <div class="syp-error-details-panel__title-group">
            <div class="syp-error-details-panel__title">{{ title }}</div>
            <p v-if="showSummary" class="syp-error-details-panel__summary">{{ summary }}</p>
          </div>
          <div class="syp-error-details-panel__actions">
            <button
              type="button"
              class="syp-error-details-panel__btn"
              data-testid="syp-error-details-copy"
              @click="copyDetails"
            >
              {{ copyButtonText }}
            </button>
            <button
              type="button"
              class="syp-error-details-panel__btn is-close"
              data-testid="syp-error-details-close"
              :aria-label="closeLabel"
              @click="emitClose"
            >
              {{ closeLabel }}
            </button>
          </div>
        </header>

        <pre class="syp-error-details-panel__details" data-testid="syp-error-details-content">{{ detailsText }}</pre>
      </section>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue"

const props = defineProps<{
  visible: boolean
  title: string
  summary: string
  details: string
  copyLabel: string
  copySuccessText: string
  copyFailureText: string
  closeLabel: string
}>()

const emit = defineEmits<{
  (event: "close"): void
}>()

const layerRef = ref<HTMLElement | null>(null)
const copyState = ref<"idle" | "success" | "failure">("idle")
let copyStateTimer: number | undefined

const detailsText = computed(() => props.details || props.summary || "")
const showSummary = computed(() => {
  const s = (props.summary || "").trim()
  if (!s) return false
  // Hide summary when it's identical to the details box content —
  // the full details already show the same text.
  return s !== detailsText.value.trim()
})
const copyButtonText = computed(() => {
  if (copyState.value === "success") {
    return props.copySuccessText
  }
  if (copyState.value === "failure") {
    return props.copyFailureText
  }
  return props.copyLabel
})

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) {
      resetCopyState()
      return
    }
    resetCopyState()
    await nextTick()
    layerRef.value?.focus()
  }
)

const emitClose = () => {
  emit("close")
}

const resetCopyState = () => {
  if (copyStateTimer) {
    window.clearTimeout(copyStateTimer)
    copyStateTimer = undefined
  }
  copyState.value = "idle"
}

const markCopyState = (state: "success" | "failure") => {
  copyState.value = state
  if (copyStateTimer) {
    window.clearTimeout(copyStateTimer)
  }
  copyStateTimer = window.setTimeout(() => {
    copyState.value = "idle"
    copyStateTimer = undefined
  }, 1800)
}

const copyWithFallback = async (text: string) => {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard API is unavailable")
  }

  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "true")
  textarea.style.position = "fixed"
  textarea.style.left = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()

  try {
    const copied = document.execCommand("copy")
    if (!copied) {
      throw new Error("execCommand copy returned false")
    }
  } finally {
    document.body.removeChild(textarea)
  }
}

const copyDetails = async () => {
  try {
    await copyWithFallback(detailsText.value)
    markCopyState("success")
  } catch {
    markCopyState("failure")
  }
}
</script>

<style scoped lang="stylus">
@import "../../../assets/v2/variables.styl"

.syp-error-details-panel
  position absolute
  inset 0
  z-index 10000
  display flex
  align-items center
  justify-content center
  padding 14px
  background rgba(15, 23, 42, 0.14)
  backdrop-filter blur(1px)
  outline none

.syp-error-details-panel__card
  width min(620px, 100%)
  max-height calc(100% - 12px)
  padding 12px
  display flex
  flex-direction column
  gap 10px
  border-radius 14px
  border 1px solid var(--b3-border-color, rgba(222, 224, 227, 0.96))
  background $syp-card-bg-gradient
  box-shadow 0 18px 42px rgba(15, 23, 42, 0.18)

.syp-error-details-panel__header
  display flex
  align-items flex-start
  justify-content space-between
  gap 12px

.syp-error-details-panel__title-group
  min-width 0
  display flex
  flex-direction column
  gap 4px

.syp-error-details-panel__title
  font-size 14px
  font-weight 700
  color var(--b3-theme-on-background, $syp-text-primary)
  line-height 1.35

.syp-error-details-panel__summary
  margin 0
  color var(--b3-theme-on-surface-light, $syp-text-secondary)
  font-size 12px
  line-height 1.5
  word-break break-word

.syp-error-details-panel__actions
  flex-shrink 0
  display flex
  align-items center
  gap 6px

.syp-error-details-panel__btn
  min-height 24px
  padding 0 8px
  border-radius 7px
  border 1px solid var(--b3-border-color, $syp-border-primary)
  background var(--b3-theme-surface, $syp-bg-primary)
  color var(--b3-theme-primary, $syp-action-primary)
  font-size 12px
  font-weight 600
  cursor pointer
  transition background 0.15s ease, border-color 0.15s ease, color 0.15s ease

  &:hover
    background var(--b3-theme-surface-light, $syp-bg-secondary)
    border-color var(--b3-theme-primary, $syp-action-primary)

  &.is-close
    color var(--b3-theme-on-surface-light, $syp-text-secondary)
    border-color var(--b3-border-color, rgba(222, 224, 227, 0.96))

    &:hover
      color var(--b3-theme-on-surface, $syp-text-primary)
      border-color var(--b3-border-color, $syp-border-primary)

.syp-error-details-panel__details
  max-height min(42vh, 320px)
  overflow auto
  margin 0
  padding 10px 12px
  border-radius 10px
  border 1px solid var(--b3-border-color, rgba(222, 224, 227, 0.96))
  background var(--b3-theme-surface-light, #f7f8fa)
  color var(--b3-theme-on-surface, $syp-text-primary)
  font-size 12px
  line-height 1.55
  white-space pre-wrap
  word-break break-word

.syp-error-details-panel-enter-active,
.syp-error-details-panel-leave-active
  transition opacity 0.16s ease

.syp-error-details-panel-enter-from,
.syp-error-details-panel-leave-to
  opacity 0
</style>
