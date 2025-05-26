<template>
  <label class="pt-form-label" :class="{ 'pt-form-label--required': required }">
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  required?: boolean
}>()
</script>

<style lang="stylus" scoped>
@import '../../styles/global/index.styl'

.pt-form-label
  display inline-block
  margin-bottom 8px
  color var(--b3-theme-on-background)
  font-size 14px

  &--required
    &::before
      content "*"
      color var(--b3-theme-error)
      margin-right 4px
</style> 