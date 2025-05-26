<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
interface Option {
  label: string
  value: any
}

const props = defineProps<{
  modelValue: any
  options: Option[]
  disabled?: boolean
  onChange?: (value: any) => void
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void
}>()

const handleChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  emit("update:modelValue", value)
  if (props.onChange) {
    props.onChange(value)
  }
}
</script>

<template>
  <select class="pt-select" :value="modelValue" @change="handleChange" :disabled="disabled">
    <option v-for="(option, index) in options" :key="index" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<style lang="stylus" scoped>
@import '../../styles/global/index.styl'

.pt-select
  --select-height: 32px
  --select-padding: 4px 32px 4px 12px
  --select-bg: var(--select-bg-color)
  --select-border: var(--select-border-color)
  --select-radius: 8px

  width 100%
  min-width 250px
  height var(--select-height)
  padding var(--select-padding)
  background var(--select-bg)
  border 1px solid var(--select-border)
  border-radius var(--select-radius)
  appearance none
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")
  background-repeat: no-repeat
  background-position: right 0.75rem center
  background-size: 1.2em
  cursor pointer
  transition all 0.2s ease

  &:disabled
    opacity 0.6
    cursor not-allowed

  &:focus
    outline none
    border-color var(--primary-color)
    box-shadow 0 0 0 2px var(--focus-ring)

// 主题变量
:root
  --select-bg-color: #ffffff
  --select-border-color: #e0e0e0
  --focus-ring: rgba(25, 113, 194, 0.2)

[data-theme-mode="dark"]
  --select-bg-color: #2d2d2d
  --select-border-color: #4a4a4a
  --focus-ring: rgba(144, 202, 249, 0.2)
</style>
