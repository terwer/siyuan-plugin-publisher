<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <button
    :class="[
      'pt-button',
      `pt-button-${type}`,
      `pt-button-${size}`,
      {
        'pt-button-loading': loading,
        'pt-button-disabled': disabled,
        'pt-button-danger': danger,
        'pt-button-ghost': ghost,
        'pt-button-block': block
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="pt-button-loading-icon">
      <span class="loading-spinner"></span>
    </span>
    <span v-if="$slots.icon" class="pt-button-icon">
      <slot name="icon"></slot>
    </span>
    <span class="pt-button-content">
      <slot></slot>
    </span>
    <span v-if="$slots.suffixIcon" class="pt-button-suffix-icon">
      <slot name="suffixIcon"></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'primary', 'dashed', 'text', 'link'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value: string) => ['small', 'default', 'large'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  danger: {
    type: Boolean,
    default: false
  },
  ghost: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  tooltip: {
    type: String,
    default: ''
  },
  tooltipPlacement: {
    type: String,
    default: 'top',
    validator: (value: string) => ['top', 'bottom', 'left', 'right'].includes(value)
  }
})

const emit = defineEmits(['click'])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style lang="stylus">
@import '../../styles/components/button.styl'
</style> 