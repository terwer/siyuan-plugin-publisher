<script setup lang="ts">
import { computed } from "vue"

interface Option {
  label: string
  value: any
  disabled?: boolean
}

interface Props {
  modelValue: any
  options: Option[]
  disabled?: boolean
  size?: "large" | "default" | "small"
  buttonStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  options: () => [],
  disabled: false,
  size: "default",
  buttonStyle: false,
})

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void
  (e: "change", value: any): void
}>()

const classes = computed(() => {
  return [
    "tg-radio-group",
    props.size !== "default" ? `tg-radio-group--${props.size}` : "",
    props.buttonStyle ? "tg-radio-group--button" : "",
  ].filter(Boolean)
})

const handleChange = (value: any) => {
  if (!props.disabled) {
    emit("update:modelValue", value)
    emit("change", value)
  }
}
</script>

<template>
  <div :class="classes">
    <label
      v-for="option in options"
      :key="option.value"
      class="tg-radio"
      :class="{
        'tg-radio--checked': modelValue === option.value,
        'tg-radio--disabled': disabled || option.disabled,
        'tg-radio--button': buttonStyle,
      }"
    >
      <input
        type="radio"
        class="tg-radio__input"
        :value="option.value"
        :checked="modelValue === option.value"
        :disabled="disabled || option.disabled"
        @change="handleChange(option.value)"
      />
      <span class="tg-radio__label">{{ option.label }}</span>
    </label>
  </div>
</template>
