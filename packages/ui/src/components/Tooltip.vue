<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="pt-tooltip" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div ref="triggerRef" class="pt-tooltip__trigger">
      <slot></slot>
    </div>
    <Transition name="pt-fade">
      <div
        v-show="visible"
        ref="tooltipRef"
        class="pt-tooltip__content"
        :class="[`pt-tooltip__content--${placement}`, { 'pt-tooltip__content--arrow': showArrow }]"
        :style="tooltipStyle"
      >
        <div class="pt-tooltip__inner">
          <slot name="title">{{ title }}</slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue"

type Placement = "top" | "bottom" | "left" | "right"

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  placement: {
    type: String as () => Placement,
    default: "top",
    validator: (v: string) => ["top", "bottom", "left", "right"].includes(v),
  },
  showArrow: {
    type: Boolean,
    default: true,
  },
  mouseEnterDelay: {
    type: Number,
    default: 0.5,
  },
  mouseLeaveDelay: {
    type: Number,
    default: 0.1,
  },
})

const visible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
let enterTimer: number | null = null
let leaveTimer: number | null = null

const tooltipStyle = computed(() => {
  if (!visible.value || !triggerRef.value || !tooltipRef.value) return {}

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()

  const baseStyle = {
    position: "fixed",
    zIndex: 1000,
  }

  const placementMap = {
    top: {
      left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
      top: triggerRect.top - tooltipRect.height - 8,
    },
    bottom: {
      left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
      top: triggerRect.bottom + 8,
    },
    left: {
      left: triggerRect.left - tooltipRect.width - 8,
      top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
    },
    right: {
      left: triggerRect.right + 8,
      top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
    },
  }

  return {
    ...baseStyle,
    ...placementMap[props.placement],
  }
})

const handleMouseEnter = () => {
  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = null
  }
  enterTimer = window.setTimeout(() => {
    visible.value = true
  }, props.mouseEnterDelay * 1000)
}

const handleMouseLeave = () => {
  if (enterTimer) {
    clearTimeout(enterTimer)
    enterTimer = null
  }
  leaveTimer = window.setTimeout(() => {
    visible.value = false
  }, props.mouseLeaveDelay * 1000)
}

const handleScroll = () => {
  if (visible.value) {
    nextTick(() => {
      // 触发重新计算位置
      visible.value = false
      nextTick(() => {
        visible.value = true
      })
    })
  }
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, true)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll, true)
  if (enterTimer) clearTimeout(enterTimer)
  if (leaveTimer) clearTimeout(leaveTimer)
})
</script>

<style lang="stylus" scoped>
.pt-tooltip
  display: inline-block
  position: relative

  &__trigger
    display: inline-block
    position: relative

  &__content
    position: fixed
    max-width: 200px
    padding: 4px 8px
    color: #fff
    text-align: left
    text-decoration: none
    white-space: normal
    background-color: rgba(0, 0, 0, 0.75)
    border-radius: 2px
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)
    z-index: 1000

    &--arrow
      &::before
        content: ""
        position: absolute
        width: 0
        height: 0
        border: 4px solid transparent

      &--top::before
        bottom: -8px
        left: 50%
        margin-left: -4px
        border-top-color: rgba(0, 0, 0, 0.75)

      &--topLeft::before
        bottom: -8px
        left: 12px
        border-top-color: rgba(0, 0, 0, 0.75)

      &--topRight::before
        bottom: -8px
        right: 12px
        border-top-color: rgba(0, 0, 0, 0.75)

      &--bottom::before
        top: -8px
        left: 50%
        margin-left: -4px
        border-bottom-color: rgba(0, 0, 0, 0.75)

      &--bottomLeft::before
        top: -8px
        left: 12px
        border-bottom-color: rgba(0, 0, 0, 0.75)

      &--bottomRight::before
        top: -8px
        right: 12px
        border-bottom-color: rgba(0, 0, 0, 0.75)

      &--left::before
        right: -8px
        top: 50%
        margin-top: -4px
        border-left-color: rgba(0, 0, 0, 0.75)

      &--leftTop::before
        right: -8px
        top: 12px
        border-left-color: rgba(0, 0, 0, 0.75)

      &--leftBottom::before
        right: -8px
        bottom: 12px
        border-left-color: rgba(0, 0, 0, 0.75)

      &--right::before
        left: -8px
        top: 50%
        margin-top: -4px
        border-right-color: rgba(0, 0, 0, 0.75)

      &--rightTop::before
        left: -8px
        top: 12px
        border-right-color: rgba(0, 0, 0, 0.75)

      &--rightBottom::before
        left: -8px
        bottom: 12px
        border-right-color: rgba(0, 0, 0, 0.75)

  &__inner
    font-size: 12px
    line-height: 1.5715
    white-space: normal
    word-break: break-word

.pt-fade-enter-active,
.pt-fade-leave-active
  transition: opacity 0.2s ease-in-out

.pt-fade-enter-from,
.pt-fade-leave-to
  opacity: 0
</style>
