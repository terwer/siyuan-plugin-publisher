<script setup lang="ts">
import { computed } from "vue"

interface Props {
  type?: "primary" | "secondary" | "text" | "danger" | "success" | "warning"
  size?: "large" | "default" | "small"
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
  shape?: "default" | "circle" | "round"
}

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  size: "default",
  disabled: false,
  loading: false,
  block: false,
  shape: "default"
})

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void
}>()

const classes = computed(() => {
  return [
    "tg-button",
    props.type !== "default" ? `tg-button--${props.type}` : "",
    props.size !== "default" ? `tg-button--${props.size}` : "",
    props.disabled ? "tg-button--disabled" : "",
    props.loading ? "tg-button--loading" : "",
    props.block ? "tg-button--block" : "",
    props.shape !== "default" ? `tg-button--${props.shape}` : "",
  ].filter(Boolean)
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event)
  }
}
</script>

<template>
  <button :class="classes" :disabled="disabled || loading" @click="handleClick">
    <span v-if="loading" class="tg-button__loading-icon">
      <i class="tg-icon-loading"></i>
    </span>
    <span v-if="icon && !loading" class="tg-button__icon">
      <i :class="icon"></i>
    </span>
    <span class="tg-button__content">
      <slot></slot>
    </span>
  </button>
</template>
