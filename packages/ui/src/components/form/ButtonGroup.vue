<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="pt-button-group">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// ButtonGroup 组件不需要额外的逻辑
</script>

<style lang="stylus" scoped>
@import '../../styles/global/index.styl'

.publisher-button-group
  display: inline-flex
  align-items: center

  :deep(.publisher-button)
    position: relative
    z-index: 1

    &:not(:first-child)
      margin-left: -1px

    &:not(:first-child):not(:last-child)
      border-radius: 0

    &:first-child
      border-top-right-radius: 0
      border-bottom-right-radius: 0

    &:last-child
      border-top-left-radius: 0
      border-bottom-left-radius: 0

    &:hover
      z-index: 2

    &:focus
      z-index: 2

    &:active
      z-index: 2

    &[disabled]
      z-index: 0
</style> 