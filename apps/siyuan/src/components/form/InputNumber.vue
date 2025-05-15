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
  modelValue: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}>()

const emit = defineEmits(["update:modelValue"])

const handleInput = (event: Event) => {
  const value = parseFloat((event.target as HTMLInputElement).value)
  if (!isNaN(value)) {
    updateValue(value)
  }
}

const increment = () => {
  updateValue(props.modelValue + (props.step || 1))
}

const decrement = () => {
  updateValue(props.modelValue - (props.step || 1))
}

const updateValue = (newValue: number) => {
  let finalValue = newValue
  if (props.min !== undefined) finalValue = Math.max(props.min, finalValue)
  if (props.max !== undefined) finalValue = Math.min(props.max, finalValue)
  emit("update:modelValue", finalValue)
}
</script>

<template>
  <div class="number-input">
    <button class="step-btn" @click.stop="decrement" :disabled="disabled">
      -
    </button>
    <input
      type="number"
      :value="modelValue"
      @input="handleInput"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
    />
    <button class="step-btn" @click.stop="increment" :disabled="disabled">
      +
    </button>
  </div>
</template>

<style lang="stylus">
.number-input
  display flex
  align-items center
  width 100%
  height 36px

  input
    flex 1
    width 100%
    height 100%
    padding 0 8px
    border 1px solid var(--input-border)
    background var(--input-bg)
    text-align center
    -moz-appearance textfield

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button
      -webkit-appearance none
      margin 0

  .step-btn
    width 32px
    height 100%
    border 1px solid var(--input-border)
    background var(--button-bg)
    cursor pointer
    transition all 0.2s

    &:disabled
      opacity 0.6
      cursor not-allowed

    &:hover:not(:disabled)
      background var(--button-hover-bg)

// 主题变量
:root
  --input-border: #e0e0e0
  --input-bg: #ffffff
  --button-bg: #f8f9fa
  --button-hover-bg: #e9ecef

[data-theme-mode="dark"]
  --input-border: #4a4a4a
  --input-bg: #2d2d2d
  --button-bg: #363636
  --button-hover-bg: #4a4a4a
</style>
