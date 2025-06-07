<script setup lang="ts">
import { computed } from "vue"

interface Option {
  label: string
  value: any
  disabled?: boolean
}

interface Props {
  modelValue: any[]
  options: Option[]
  disabled?: boolean
  size?: "large" | "default" | "small"
  buttonStyle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  options: () => [],
  disabled: false,
  size: "default",
  buttonStyle: false,
})

const emit = defineEmits<{
  (e: "update:modelValue", value: any[]): void
  (e: "change", value: any[]): void
}>()

const classes = computed(() => {
  return [
    "tg-checkbox-group",
    props.size !== "default" ? `tg-checkbox-group--${props.size}` : "",
    props.buttonStyle ? "tg-checkbox-group--button" : "",
  ].filter(Boolean)
})

const handleChange = (value: any, checked: boolean) => {
  if (!props.disabled) {
    const newValue = checked
      ? [...props.modelValue, value]
      : props.modelValue.filter((v) => v !== value)
    emit("update:modelValue", newValue)
    emit("change", newValue)
  }
}
</script>

<template>
  <div :class="classes">
    <label
      v-for="option in options"
      :key="option.value"
      class="tg-checkbox"
      :class="{
        'tg-checkbox--checked': modelValue.includes(option.value),
        'tg-checkbox--disabled': disabled || option.disabled,
        'tg-checkbox--button': buttonStyle,
      }"
    >
      <input
        type="checkbox"
        class="tg-checkbox__input"
        :value="option.value"
        :checked="modelValue.includes(option.value)"
        :disabled="disabled || option.disabled"
        @change="handleChange(option.value, ($event.target as HTMLInputElement).checked)"
      />
      <span class="tg-checkbox__label">{{ option.label }}</span>
    </label>
  </div>
</template> 