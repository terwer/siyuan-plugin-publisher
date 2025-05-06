<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  type?: ControlType
  inputType?: InputType
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  showCount?: boolean
  error?: boolean
}>()

const model = defineModel<string>({ required: true })
const computedType = computed(() => {
  if (props.type === "number") {
    return "number"
  }
  if (props.type === "input") {
    return props.inputType || "text"
  }
  return "text"
})
</script>

<template>
  <div class="input-container">
    <input
      v-model="model"
      class="pt-input"
      :class="{ 'error-state': error }"
      :type="computedType"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
    />

    <div v-if="showCount && maxlength" class="count-indicator">
      {{ model.length }} / {{ maxlength }}
    </div>
  </div>
</template>

<style lang="stylus">
.input-container
  position relative
  width 100%
  max-width 400px /* 添加最大宽度限制 */
  min-width 350px

.pt-input
  --input-height: 32px /* 调小高度 */
  --input-padding: 4px 12px /* 紧凑的内边距 */
  --input-bg: var(--input-bg-color)
  --input-border: var(--input-border-color)
  --input-radius: 4px /* 圆角调整 */

  width 100%
  height var(--input-height)
  padding var(--input-padding)
  background var(--input-bg)
  border 1px solid var(--input-border)
  border-radius var(--input-radius)
  transition all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) /* Ant Design 的缓动函数 */
  font-size 14px
  color var(--text-primary) /* 明确文字颜色 */

  &::placeholder
    color var(--text-placeholder)

  &:focus
    outline none
    border-color var(--primary-color)
    box-shadow 0 0 0 2px var(--focus-ring)

  &:hover
    border-color var(--primary-color-hover)

  &:disabled
    background var(--input-bg-disabled)
    cursor not-allowed

  &.error-state
    border-color var(--error-color)
    &:focus
      box-shadow 0 0 0 2px var(--error-focus-ring)

.count-indicator
  position absolute
  right 8px
  bottom 6px /* 位置微调 */
  font-size 12px
  color var(--text-tertiary) /* 更淡的颜色 */
  background var(--input-bg) /* 防止文字重叠 */
  padding-left 4px

// 主题变量
:root
  --input-bg-color: #ffffff
  --input-border-color: #d9d9d9 /* Ant Design 默认边框色 */
  --input-bg-disabled: #f5f5f5
  --primary-color: #1890ff /* Ant Design 主题色 */
  --primary-color-hover: #40a9ff
  --focus-ring: rgba(24, 144, 255, 0.2)
  --text-primary: rgba(0, 0, 0, 0.88)
  --text-placeholder: #bfbfbf
  --text-tertiary: #8c8c8c

[data-theme-mode="dark"]
  --input-bg-color: rgba(255,255,255,0.04)
  --input-border-color: #424242
  --input-bg-disabled: rgba(255,255,255,0.08)
  --primary-color: #177ddc
  --primary-color-hover: #3c9ae8
  --text-primary: rgba(255,255,255,0.85)
  --text-placeholder: rgba(255,255,255,0.3)
  --text-tertiary: rgba(255,255,255,0.3)
</style>
