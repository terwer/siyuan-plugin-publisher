<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <form
    class="pt-form"
    :class="[
      `pt-form--${layout}`,
      { 'pt-form--disabled': disabled }
    ]"
    @submit.prevent="handleSubmit"
  >
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { provide, reactive } from "vue"

interface Props {
  modelValue?: Record<string, any>
  layout?: "horizontal" | "vertical" | "inline"
  labelWidth?: string | number
  labelAlign?: "left" | "right"
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  layout: "horizontal",
  labelWidth: "80px",
  labelAlign: "right",
  disabled: false
})

const emit = defineEmits<{
  (e: "submit", values: Record<string, any>): void
  (e: "update:modelValue", value: Record<string, any>): void
}>()

// 提供表单上下文
const formContext = reactive({
  layout: props.layout,
  labelWidth: props.labelWidth,
  labelAlign: props.labelAlign,
  disabled: props.disabled,
  modelValue: props.modelValue
})

provide("formContext", formContext)

// 提交表单
const handleSubmit = () => {
  emit("submit", props.modelValue)
}
</script>

<style lang="stylus">
.pt-form
  width: 100%

  &--horizontal
    .pt-form-item
      display: flex
      align-items: flex-start

  &--vertical
    .pt-form-item
      display: flex
      flex-direction: column

  &--inline
    .pt-form-item
      display: inline-flex
      align-items: center
      margin-right: 16px
      margin-bottom: 0

  &--disabled
    opacity: 0.6
    pointer-events: none
</style> 