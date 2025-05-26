<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="pt-form-item">
    <div class="pt-form-item__label" :class="{ 'pt-form-item__label--required': required }">
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="pt-form-item__control">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue"

interface Props {
  label?: string
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  label: "",
  required: false
})

// 注入表单上下文
interface FormContext {
  layout: "horizontal" | "vertical" | "inline"
  labelWidth?: string | number
  labelAlign?: "left" | "right"
}

const formContext = inject<FormContext>("formContext", {
  layout: "horizontal",
  labelWidth: "80px",
  labelAlign: "right"
})
</script>

<style lang="stylus" scoped>
@import '../../styles/global/index.styl'

.pt-form-item
  margin-bottom: 24px

  &:last-child
    margin-bottom: 0

  &__label
    display: inline-block
    color: var(--pt-text-color)
    font-size: 14px
    line-height: 1.5
    white-space: nowrap
    margin-bottom: 8px

    &--required::before
      content: "*"
      color: var(--pt-error-color)
      margin-right: 4px

  &__control
    position: relative
    width: 100%

// 水平布局
.pt-form--horizontal
  .pt-form-item
    display: flex
    align-items: flex-start

    .pt-form-item__label
      flex: none
      text-align: right
      padding-right: 12px
      margin-bottom: 0

    .pt-form-item__control
      flex: 1
      min-width: 0

// 垂直布局
.pt-form--vertical
  .pt-form-item
    display: flex
    flex-direction: column

    .pt-form-item__label
      text-align: left

// 行内布局
.pt-form--inline
  .pt-form-item
    display: inline-flex
    align-items: center
    margin-right: 16px
    margin-bottom: 0

    .pt-form-item__label
      margin-right: 8px
      margin-bottom: 0
</style> 