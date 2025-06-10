<script setup lang="ts">
import { computed } from "vue"

interface Option {
  label: string
  value: any
  disabled?: boolean
}

interface Props {
  modelValue: any
  options: Option[] | (() => Option[])
  placeholder?: string
  disabled?: boolean
  size?: "large" | "default" | "small"
  clearable?: boolean
  status?: "error" | "warning" | "success"
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  options: () => [],
  placeholder: "请选择",
  disabled: false,
  size: "default",
  clearable: false,
})

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void
  (e: "change", value: any): void
  (e: "clear"): void
}>()

const classes = computed(() => {
  return [
    "tg-select",
    props.size !== "default" ? `tg-select--${props.size}` : "",
    props.disabled ? "tg-select--disabled" : "",
    props.status ? `tg-select--${props.status}` : "",
  ].filter(Boolean)
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit("update:modelValue", target.value)
  emit("change", target.value)
}

const handleClear = () => {
  emit("update:modelValue", "")
  emit("clear")
}

// 确保 options 始终是数组
const safeOptions = computed(() => {
  const options = typeof props.options === "function" ? props.options() : props.options
  return Array.isArray(options) ? options : []
})

// 确保 modelValue 有值
const safeModelValue = computed(() => {
  return props.modelValue ?? ""
})
</script>

<template>
  <div :class="classes">
    <div class="tg-select__wrapper">
      <select class="tg-select__inner" :value="safeModelValue" :disabled="disabled" @change="handleChange">
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="option in safeOptions" :key="option.value" :value="option.value" :disabled="option.disabled">
          {{ option.label }}
        </option>
      </select>
      <span v-if="clearable && safeModelValue" class="tg-select__clear" @click="handleClear">
        <i class="tg-icon-close"></i>
      </span>
      <span class="tg-select__arrow">
        <i class="tg-icon-arrow-down"></i>
      </span>
    </div>
  </div>
</template>
