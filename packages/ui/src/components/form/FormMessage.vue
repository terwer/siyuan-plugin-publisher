<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="pt-form-message" :class="{ 'pt-form-message--error': type === 'error' }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'error' | 'warning' | 'info'
}>()
</script>

<style lang="stylus">
.pt-form-message
  margin-top: 4px
  font-size: 12px
  line-height: 1.5
  color: var(--pt-text-color-secondary)

  &--error
    color: var(--pt-error-color)
</style> 