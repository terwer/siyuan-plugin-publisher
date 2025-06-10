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
      `tg-space--${direction}`,
      { 'tg-space--align-center': align === 'center' },
      { 'tg-space--align-start': align === 'start' },
      { 'tg-space--align-end': align === 'end' },
      { 'tg-space--align-baseline': align === 'baseline' },
      { 'tg-space--align-stretch': align === 'stretch' },
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