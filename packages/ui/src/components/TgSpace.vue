<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div
    class="tg-space"
    :class="[
      `tg-space--${props.direction}`,
      { 'tg-space--align-center': props.align === 'center' },
      { 'tg-space--align-start': props.align === 'start' },
      { 'tg-space--align-end': props.align === 'end' },
      { 'tg-space--align-baseline': props.align === 'baseline' },
      { 'tg-space--align-stretch': props.align === 'stretch' },
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  direction?: "horizontal" | "vertical"
  size?: "small" | "medium" | "large" | number
  align?: "start" | "end" | "center" | "baseline" | "stretch"
  wrap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  direction: "horizontal",
  size: "medium",
  align: "start",
  wrap: false,
})
</script>

<style lang="stylus">
@import "../styles/components/space.styl"
</style>
