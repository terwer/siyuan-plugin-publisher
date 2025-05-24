<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"

const props = defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  rows?: number
  autoResize?: boolean
  error?: boolean
}>()

const emit = defineEmits(["update:modelValue"])
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// 默认行数
const DEFAULT_ROWS = 4

const resize = () => {
  if (textareaRef.value && props.autoResize) {
    const lineHeight = parseInt(getComputedStyle(textareaRef.value).lineHeight)
    const maxRows = props.rows || DEFAULT_ROWS
    const maxHeight = lineHeight * maxRows
    textareaRef.value.style.height = "auto"
    const scrollHeight = textareaRef.value.scrollHeight

    if (scrollHeight > maxHeight) {
      textareaRef.value.style.height = `${maxHeight}px`
      textareaRef.value.style.overflowY = "auto"
    } else {
      textareaRef.value.style.height = `${scrollHeight}px`
      textareaRef.value.style.overflowY = "hidden"
    }
  }
}

onMounted(resize)
watch(() => props.modelValue, resize)
</script>

<template>
  <div class="textarea-container">
    <textarea
      ref="textareaRef"
      class="custom-textarea"
      :class="{ 'error-state': error }"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="rows || DEFAULT_ROWS"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>

    <div v-if="maxlength" class="count-indicator">{{ modelValue.length }} / {{ maxlength }}</div>
  </div>
</template>

<style lang="stylus">
.textarea-container
  position relative
  width 100%
  min-width 350px

.custom-textarea
  --textarea-bg: var(--input-bg-color)
  --textarea-border: var(--input-border-color)
  --scrollbar-thumb: var(--scrollbar-thumb-color)

  width 100%
  padding 8px 12px
  background var(--textarea-bg)
  border 1px solid var(--textarea-border)
  border-radius 8px
  transition all 0.2s ease
  font-size 14px
  line-height 1.5
  word-wrap break-word
  white-space pre-wrap
  resize none

  // 自定义滚动条样式
  &::-webkit-scrollbar
    width 4px
    height 4px

  &::-webkit-scrollbar-track
    background transparent

  &::-webkit-scrollbar-thumb
    background var(--scrollbar-thumb)
    border-radius 2px

    &:hover
      background var(--scrollbar-thumb-hover)

  // 移除默认的拖拽手柄
  &::-webkit-resizer
    display none

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
  --scrollbar-thumb-color: #c1c1c1
  --scrollbar-thumb-hover: #a8a8a8

[data-theme-mode="dark"]
  --input-bg-color: #2d2d2d
  --input-border-color: #4a4a4a
  --focus-ring: rgba(144, 202, 249, 0.2)
  --error-color: #ff6b6b
  --error-focus-ring: rgba(255, 107, 107, 0.2)
  --text-secondary: rgba(255,255,255,0.6)
  --scrollbar-thumb-color: #4a4a4a
  --scrollbar-thumb-hover: #5a5a5a
</style>
