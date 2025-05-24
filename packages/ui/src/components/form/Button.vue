<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
  type?: "primary" | "default" | "dashed" | "text" | "link"
  size?: "large" | "default" | "small"
  shape?: "default" | "circle" | "round"
  danger?: boolean
  ghost?: boolean
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
  href?: string
  target?: string
}>()

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event)
  }
}

const isLink = props.type === "link" && props.href
const Tag = isLink ? "a" : "button"
</script>

<template>
  <component
    :is="Tag"
    class="pt-button"
    :class="[
      `button-${type || 'default'}`,
      `button-${size || 'default'}`,
      `button-${shape || 'default'}`,
      { 'button-disabled': disabled },
      { 'button-loading': loading },
      { 'button-danger': danger },
      { 'button-ghost': ghost },
      { 'button-block': block },
      { 'button-icon-only': icon && !$slots.default },
    ]"
    :disabled="disabled || loading"
    :href="isLink ? href : undefined"
    :target="isLink ? target : undefined"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-icon"></span>
    <span v-if="icon" class="button-icon">
      <i :class="icon"></i>
    </span>
    <slot></slot>
  </component>
</template>

<style lang="stylus">
  @import "../../styles/components/button.styl"
</style>