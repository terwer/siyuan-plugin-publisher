<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
const props = defineProps<{
  type?: "default" | "primary" | "success" | "warning" | "danger"
  size?: "small" | "default" | "large"
  disabled?: boolean
  loading?: boolean
}>()
</script>

<template>
  <button
    class="pt-button"
    :class="[
      `button-${type || 'default'}`,
      `button-${size || 'default'}`,
      { 'button-disabled': disabled },
      { 'button-loading': loading },
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="loading-icon"></span>
    <slot></slot>
  </button>
</template>

<style lang="stylus">
.pt-button
  --button-height: 32px
  --button-padding: 0 16px
  --button-font-size: 14px
  --button-radius: 6px
  --button-transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)

  position: relative
  display: inline-flex
  align-items: center
  justify-content: center
  height: var(--button-height)
  padding: var(--button-padding)
  font-size: var(--button-font-size)
  border-radius: var(--button-radius)
  border: 1px solid transparent
  cursor: pointer
  transition: var(--button-transition)
  white-space: nowrap
  user-select: none
  outline: none

  // 类型样式
  &.button-default
    background: var(--button-default-bg)
    border-color: var(--button-default-border)
    color: var(--button-default-color)

    &:hover:not(.button-disabled)
      background: var(--button-default-hover-bg)
      border-color: var(--button-default-hover-border)
      color: var(--button-default-hover-color)

  &.button-primary
    background: var(--button-primary-bg)
    border-color: var(--button-primary-border)
    color: var(--button-primary-color)

    &:hover:not(.button-disabled)
      background: var(--button-primary-hover-bg)
      border-color: var(--button-primary-hover-border)

  &.button-success
    background: var(--button-success-bg)
    border-color: var(--button-success-border)
    color: var(--button-success-color)

    &:hover:not(.button-disabled)
      background: var(--button-success-hover-bg)
      border-color: var(--button-success-hover-border)

  &.button-warning
    background: var(--button-warning-bg)
    border-color: var(--button-warning-border)
    color: var(--button-warning-color)

    &:hover:not(.button-disabled)
      background: var(--button-warning-hover-bg)
      border-color: var(--button-warning-hover-border)

  &.button-danger
    background: var(--button-danger-bg)
    border-color: var(--button-danger-border)
    color: var(--button-danger-color)

    &:hover:not(.button-disabled)
      background: var(--button-danger-hover-bg)
      border-color: var(--button-danger-hover-border)

  // 尺寸样式
  &.button-small
    --button-height: 24px
    --button-padding: 0 12px
    --button-font-size: 12px
    --button-radius: 4px

  &.button-large
    --button-height: 40px
    --button-padding: 0 20px
    --button-font-size: 16px
    --button-radius: 8px

  // 禁用状态
  &.button-disabled
    opacity: 0.6
    cursor: not-allowed

  // 加载状态
  &.button-loading
    cursor: wait

    .loading-icon
      display: inline-block
      width: 14px
      height: 14px
      margin-right: 8px
      border: 2px solid currentColor
      border-radius: 50%
      border-top-color: transparent
      animation: button-loading 0.8s linear infinite

@keyframes button-loading
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)

// 主题变量
:root
  // 默认按钮
  --button-default-bg: #ffffff
  --button-default-border: #d9d9d9
  --button-default-color: rgba(0, 0, 0, 0.88)
  --button-default-hover-bg: #f5f5f5
  --button-default-hover-border: #d9d9d9
  --button-default-hover-color: rgba(0, 0, 0, 0.88)

  // 主要按钮
  --button-primary-bg: #1677ff
  --button-primary-border: #1677ff
  --button-primary-color: #ffffff
  --button-primary-hover-bg: #4096ff
  --button-primary-hover-border: #4096ff

  // 成功按钮
  --button-success-bg: #52c41a
  --button-success-border: #52c41a
  --button-success-color: #ffffff
  --button-success-hover-bg: #73d13d
  --button-success-hover-border: #73d13d

  // 警告按钮
  --button-warning-bg: #faad14
  --button-warning-border: #faad14
  --button-warning-color: #ffffff
  --button-warning-hover-bg: #ffc53d
  --button-warning-hover-border: #ffc53d

  // 危险按钮
  --button-danger-bg: #ff4d4f
  --button-danger-border: #ff4d4f
  --button-danger-color: #ffffff
  --button-danger-hover-bg: #ff7875
  --button-danger-hover-border: #ff7875

[data-theme-mode="dark"]
  // 默认按钮
  --button-default-bg: rgba(255, 255, 255, 0.08)
  --button-default-border: rgba(255, 255, 255, 0.15)
  --button-default-color: rgba(255, 255, 255, 0.85)
  --button-default-hover-bg: rgba(255, 255, 255, 0.12)
  --button-default-hover-border: rgba(255, 255, 255, 0.2)
  --button-default-hover-color: rgba(255, 255, 255, 0.85)

  // 主要按钮
  --button-primary-bg: #177ddc
  --button-primary-border: #177ddc
  --button-primary-color: #ffffff
  --button-primary-hover-bg: #3c9ae8
  --button-primary-hover-border: #3c9ae8

  // 成功按钮
  --button-success-bg: #49aa19
  --button-success-border: #49aa19
  --button-success-color: #ffffff
  --button-success-hover-bg: #6abe39
  --button-success-hover-border: #6abe39

  // 警告按钮
  --button-warning-bg: #d89614
  --button-warning-border: #d89614
  --button-warning-color: #ffffff
  --button-warning-hover-bg: #e8b339
  --button-warning-hover-border: #e8b339

  // 危险按钮
  --button-danger-bg: #a61d24
  --button-danger-border: #a61d24
  --button-danger-color: #ffffff
  --button-danger-hover-bg: #c1353d
  --button-danger-hover-border: #c1353d
</style>
