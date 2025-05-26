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
      'publisher-button',
      `publisher-button-${type}`,
      `publisher-button-${size}`,
      {
        'publisher-button-loading': loading,
        'publisher-button-disabled': disabled,
        'publisher-button-danger': danger,
        'publisher-button-ghost': ghost,
        'publisher-button-block': block
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="publisher-button-loading-icon">
      <span class="loading-spinner"></span>
    </span>
    <span v-if="$slots.icon" class="publisher-button-icon">
      <slot name="icon"></slot>
    </span>
    <span class="publisher-button-content">
      <slot></slot>
    </span>
    <span v-if="$slots.suffixIcon" class="publisher-button-suffix-icon">
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

<style lang="stylus" scoped>
.publisher-button
  position: relative
  display: inline-flex
  align-items: center
  justify-content: center
  font-weight: 400
  white-space: nowrap
  text-align: center
  background-image: none
  border: 1px solid transparent
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015)
  cursor: pointer
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)
  user-select: none
  touch-action: manipulation
  height: 32px
  padding: 4px 15px
  font-size: 14px
  border-radius: 2px
  color: rgba(0, 0, 0, 0.85)
  background: #fff
  border-color: #d9d9d9

  &:hover
    color: #40a9ff
    background: #fff
    border-color: #40a9ff

  &:active
    color: #096dd9
    background: #fff
    border-color: #096dd9

  &-primary
    color: #fff
    background: #1890ff
    border-color: #1890ff
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12)
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045)

    &:hover
      background: #40a9ff
      border-color: #40a9ff
      color: #fff

    &:active
      background: #096dd9
      border-color: #096dd9
      color: #fff

  &-dashed
    color: rgba(0, 0, 0, 0.85)
    background: #fff
    border-color: #d9d9d9
    border-style: dashed

    &:hover
      color: #40a9ff
      background: #fff
      border-color: #40a9ff

    &:active
      color: #096dd9
      background: #fff
      border-color: #096dd9

  &-text
    color: rgba(0, 0, 0, 0.85)
    background: transparent
    border-color: transparent
    box-shadow: none

    &:hover
      color: rgba(0, 0, 0, 0.85)
      background: rgba(0, 0, 0, 0.018)
      border-color: transparent

    &:active
      color: rgba(0, 0, 0, 0.85)
      background: rgba(0, 0, 0, 0.028)
      border-color: transparent

  &-link
    color: #1890ff
    background: transparent
    border-color: transparent
    box-shadow: none

    &:hover
      color: #40a9ff
      background: transparent
      border-color: transparent

    &:active
      color: #096dd9
      background: transparent
      border-color: transparent

  &-small
    height: 24px
    padding: 0 7px
    font-size: 14px
    border-radius: 2px

  &-large
    height: 40px
    padding: 6.4px 15px
    font-size: 16px
    border-radius: 2px

  &-loading
    position: relative
    cursor: default

    &:before
      position: absolute
      top: -1px
      right: -1px
      bottom: -1px
      left: -1px
      z-index: 1
      display: block
      background: #fff
      border-radius: inherit
      opacity: 0.35
      transition: opacity 0.2s
      content: ''
      pointer-events: none

  &-disabled
    color: rgba(0, 0, 0, 0.25)
    background: #f5f5f5
    border-color: #d9d9d9
    text-shadow: none
    box-shadow: none
    cursor: not-allowed

    &:hover
      color: rgba(0, 0, 0, 0.25)
      background: #f5f5f5
      border-color: #d9d9d9

    &:active
      color: rgba(0, 0, 0, 0.25)
      background: #f5f5f5
      border-color: #d9d9d9

  &-danger
    color: #ff4d4f
    background: #fff
    border-color: #ff4d4f

    &:hover
      color: #ff7875
      background: #fff
      border-color: #ff7875

    &:active
      color: #d9363e
      background: #fff
      border-color: #d9363e

    &.publisher-button-primary
      color: #fff
      background: #ff4d4f
      border-color: #ff4d4f
      text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12)
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045)

      &:hover
        background: #ff7875
        border-color: #ff7875
        color: #fff

      &:active
        background: #d9363e
        border-color: #d9363e
        color: #fff

  &-ghost
    color: #fff
    background: transparent
    border-color: #fff

    &:hover
      color: #40a9ff
      background: transparent
      border-color: #40a9ff

    &:active
      color: #096dd9
      background: transparent
      border-color: #096dd9

  &-block
    width: 100%

  &-icon
    margin-right: 8px
    font-size: 14px
    line-height: 1

  &-suffix-icon
    margin-left: 8px
    font-size: 14px
    line-height: 1

  &-loading-icon
    margin-right: 8px
    font-size: 14px
    line-height: 1

    .loading-spinner
      display: inline-block
      width: 14px
      height: 14px
      border: 2px solid #fff
      border-radius: 50%
      border-top-color: transparent
      animation: button-loading-spin 1s infinite linear

@keyframes button-loading-spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)
</style> 