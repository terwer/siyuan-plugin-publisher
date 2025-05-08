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
  modelValue: boolean
  disabled?: boolean
}>()

const emit = defineEmits(["update:modelValue"])

const toggle = () => {
  if (!props.disabled) {
    emit("update:modelValue", !props.modelValue)
  }
}
</script>

<template>
  <button
    class="pt-switch"
    :class="{
      'switch-on': modelValue,
      disabled: disabled,
    }"
    @click.stop="toggle"
  >
    <span class="slider"></span>
  </button>
</template>

<style lang="stylus">
.pt-switch
  --switch-width: 40px
  --switch-height: 20px
  --slider-size: 16px
  --switch-padding: 2px
  --transition-duration: 0.2s

  position: relative
  width: var(--switch-width)
  height: var(--switch-height)
  border: none
  border-radius: calc(var(--switch-height) / 2)
  background: var(--switch-off-bg)
  cursor: pointer
  transition: background var(--transition-duration)

  &.switch-on
    background: var(--switch-on-bg)

  .slider
    position: absolute
    left: var(--switch-padding)
    top: 50%
    transform: translateY(-50%)
    width: var(--slider-size)
    height: var(--slider-size)
    background: var(--slider-bg)
    border-radius: 50%
    box-shadow: var(--slider-shadow)
    transition: transform var(--transition-duration) ease-in-out

  &.switch-on .slider
    transform: translate(calc(var(--switch-width) - var(--slider-size) - var(--switch-padding)*2), -50%)

  &.disabled
    cursor: not-allowed
    background: var(--switch-disabled-off-bg)
    &.switch-on
      background: var(--switch-disabled-on-bg)
    .slider
      background: var(--slider-disabled-bg)

// 主题变量
:root
  --switch-off-bg: #bfbfbf
  --switch-on-bg: #1890ff
  --switch-disabled-off-bg: #f5f5f5
  --switch-disabled-on-bg: #bae0ff
  --slider-bg: #ffffff
  --slider-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
  --slider-disabled-bg: #ffffff

[data-theme-mode="dark"]
  --switch-off-bg: #434343
  --switch-on-bg: #177ddc
  --switch-disabled-off-bg: rgba(255, 255, 255, 0.12)
  --switch-disabled-on-bg: rgba(24, 144, 255, 0.3)
  --slider-bg: #ffffff
  --slider-shadow: 0 2px 4px rgba(0, 0, 0, 0.2)
  --slider-disabled-bg: rgba(255, 255, 255, 0.3)
</style>
