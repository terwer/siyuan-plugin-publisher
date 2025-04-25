<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
defineProps<{
  type?: "text" | "password" | "email" | "search"
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  showCount?: boolean
  error?: boolean
}>()

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <div class="input-container">
    <input
      v-model="modelValue"
      class="custom-input"
      :class="{ 'error-state': error }"
      :type="type || 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
    />

    <div v-if="showCount && maxlength" class="count-indicator">
      {{ modelValue.length }} / {{ maxlength }}
    </div>
  </div>
</template>

<style lang="stylus">
.input-container
  position relative
  width 100%

.custom-input
  --input-height: 36px
  --input-padding: 8px 12px
  --input-bg: var(--input-bg-color)
  --input-border: var(--input-border-color)

  width 100%
  height var(--input-height)
  padding var(--input-padding)
  background var(--input-bg)
  border 1px solid var(--input-border)
  border-radius 8px
  transition all 0.2s ease
  font-size 14px

  &:focus
    outline none
    border-color var(--primary-color)
    box-shadow 0 0 0 2px var(--focus-ring)

  &:disabled
    opacity 0.6
    cursor not-allowed

  &.error-state
    border-color var(--error-color)
    &:focus
      box-shadow 0 0 0 2px var(--error-focus-ring)

.count-indicator
  position absolute
  right 8px
  bottom 8px
  font-size 12px
  color var(--text-secondary)

// 主题变量
:root
  --input-bg-color: #ffffff
  --input-border-color: #e0e0e0
  --focus-ring: rgba(25, 113, 194, 0.2)
  --error-color: #dc3545
  --error-focus-ring: rgba(220, 53, 69, 0.2)
  --text-secondary: #666666

[data-theme-mode="dark"]
  --input-bg-color: #2d2d2d
  --input-border-color: #4a4a4a
  --focus-ring: rgba(144, 202, 249, 0.2)
  --error-color: #ff6b6b
  --error-focus-ring: rgba(255, 107, 107, 0.2)
  --text-secondary: rgba(255,255,255,0.6)
</style>
