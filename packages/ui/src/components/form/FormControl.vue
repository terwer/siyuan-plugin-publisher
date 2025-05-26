<template>
  <div class="pt-form-control">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide } from "vue"

interface Props {
  name: string
  value?: any
  disabled?: boolean
  readonly?: boolean
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  disabled: false,
  readonly: false,
  validateOnChange: true,
  validateOnBlur: true
})

const emit = defineEmits<{
  (e: "update:value", value: any): void
  (e: "change", value: any): void
  (e: "blur", event: FocusEvent): void
  (e: "focus", event: FocusEvent): void
}>()

provide("formControlContext", {
  name: props.name,
  value: props.value,
  disabled: props.disabled,
  readonly: props.readonly,
  validateOnChange: props.validateOnChange,
  validateOnBlur: props.validateOnBlur,
  updateValue: (value: any) => {
    emit("update:value", value)
  },
  onChange: (value: any) => {
    emit("change", value)
  },
  onBlur: (event: FocusEvent) => {
    emit("blur", event)
  },
  onFocus: (event: FocusEvent) => {
    emit("focus", event)
  }
})
</script> 