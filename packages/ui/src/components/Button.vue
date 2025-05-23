<template>
  <button
    :class="[
      'siyuan-button',
      `siyuan-button--${type}`,
      `siyuan-button--${size}`,
      { 'siyuan-button--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  type?: 'primary' | 'secondary' | 'text'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style>
.siyuan-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.siyuan-button--primary {
  background-color: var(--b3-theme-primary);
  color: white;
}

.siyuan-button--secondary {
  background-color: var(--b3-theme-secondary);
  color: white;
}

.siyuan-button--text {
  background-color: transparent;
  color: var(--b3-theme-on-surface);
}

.siyuan-button--small {
  padding: 4px 8px;
  font-size: 12px;
}

.siyuan-button--medium {
  padding: 8px 16px;
  font-size: 14px;
}

.siyuan-button--large {
  padding: 12px 24px;
  font-size: 16px;
}

.siyuan-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.siyuan-button:hover:not(.siyuan-button--disabled) {
  opacity: 0.8;
}
</style> 