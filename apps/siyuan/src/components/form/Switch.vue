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
    class="switch"
    :class="{
      'switch-on': modelValue,
      disabled: disabled,
    }"
    @click="toggle"
  >
    <span class="slider"></span>
  </button>
</template>

<style lang="stylus">
.switch
  --switch-width: 44px
  --switch-height: 24px
  --slider-size: 20px
  --switch-padding: 2px
  --transition-duration: 0.3s

  position relative
  width var(--switch-width)
  height var(--switch-height)
  border none
  border-radius calc(var(--switch-height) / 2)
  background var(--switch-off-bg)
  cursor pointer
  transition background var(--transition-duration)

  &.switch-on
    background var(--switch-on-bg)

  .slider
    position absolute
    left var(--switch-padding)
    top 50%
    transform translateY(-50%)
    width var(--slider-size)
    height var(--slider-size)
    background var(--slider-bg)
    border-radius 50%
    transition transform var(--transition-duration)

  &.switch-on .slider
    transform translate(calc(var(--switch-width) - var(--slider-size) - var(--switch-padding)*2), -50%)

  &.disabled
    opacity 0.6
    cursor not-allowed

// 主题变量
:root
  --switch-off-bg: #e0e0e0
  --switch-on-bg: #1971c2
  --slider-bg: #ffffff

[data-theme-mode="dark"]
  --switch-off-bg: #4a4a4a
  --switch-on-bg: #90caf9
  --slider-bg: #2d2d2d
</style>
