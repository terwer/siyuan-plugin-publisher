<template>
  <div
    class="pt-tooltip"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot></slot>
    <div
      class="pt-tooltip__content"
      :class="[
        `pt-tooltip__content--${placement}`,
        { 'pt-tooltip__content--visible': visible }
      ]"
    >
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface Props {
  content?: string
  placement?: "top" | "bottom" | "left" | "right"
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  content: "",
  placement: "top",
  delay: 0
})

const visible = ref(false)
let timer: number | null = null

const handleMouseEnter = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  timer = window.setTimeout(() => {
    visible.value = true
  }, props.delay)
}

const handleMouseLeave = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  visible.value = false
}
</script> 