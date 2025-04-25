<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"

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

const resize = () => {
  if (textareaRef.value && props.autoResize) {
    textareaRef.value.style.height = "auto"
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
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
      :rows="rows || 3"
      @input="
        emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
    ></textarea>

    <div v-if="maxlength" class="count-indicator">
      {{ modelValue.length }} / {{ maxlength }}
    </div>
  </div>
</template>

<style lang="stylus">
.textarea-container
  position relative
  width 100%

.custom-textarea
  --textarea-bg: var(--input-bg-color)
  --textarea-border: var(--input-border-color)

  width 100%
  min-height 100px
  padding 8px 12px
  background var(--textarea-bg)
  border 1px solid var(--textarea-border)
  border-radius 8px
  transition all 0.2s ease
  resize vertical
  font-size 14px
  line-height 1.5

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
