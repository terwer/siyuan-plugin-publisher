<template>
  <label
    class="pt-form-label"
    :class="{ 'pt-form-label--required': required }"
    :style="labelStyle"
  >
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
import { computed, inject } from "vue"

interface Props {
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

interface FormContext {
  layout: string
  labelWidth: string | number
  labelAlign: "left" | "right"
}

const formContext = inject<FormContext>("formContext", {
  layout: "horizontal",
  labelWidth: "80px",
  labelAlign: "right"
})

const labelStyle = computed(() => {
  if (formContext.layout === "horizontal") {
    return {
      width: typeof formContext.labelWidth === "number" ? `${formContext.labelWidth}px` : formContext.labelWidth,
      textAlign: formContext.labelAlign
    }
  }
  return {}
})
</script>

<style lang="stylus">
.pt-form-label
  display: inline-block
  color: var(--pt-text-color)
  font-size: 14px
  line-height: 1.5
  white-space: nowrap

  &--required::before
    content: "*"
    color: var(--pt-error-color)
    margin-right: 4px
</style> 