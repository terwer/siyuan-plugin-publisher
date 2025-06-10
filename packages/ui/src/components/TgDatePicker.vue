<script setup lang="ts">
import { computed } from "vue"

interface Props {
  modelValue: string
  disabled?: boolean
  size?: "large" | "default" | "small"
  clearable?: boolean
  status?: "error" | "warning" | "success"
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  disabled: false,
  size: "default",
  clearable: false,
  placeholder: "请选择日期",
})

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "change", value: string): void
  (e: "clear"): void
}>()

const classes = computed(() => {
  return [
    "tg-date-picker",
    props.size !== "default" ? `tg-date-picker--${props.size}` : "",
    props.disabled ? "tg-date-picker--disabled" : "",
    props.status ? `tg-date-picker--${props.status}` : "",
  ].filter(Boolean)
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit("update:modelValue", target.value)
  emit("change", target.value)
}

const handleClear = () => {
  emit("update:modelValue", "")
  emit("clear")
}
</script>

<template>
  <div :class="classes">
    <div class="tg-date-picker__wrapper">
      <input
        type="date"
        class="tg-date-picker__input"
        :value="modelValue"
        :disabled="disabled"
        :placeholder="placeholder"
        @change="handleChange"
      />
      <span v-if="clearable && modelValue" class="tg-date-picker__clear" @click="handleClear">
        <i class="tg-icon-close"></i>
      </span>
      <span class="tg-date-picker__icon">
        <i class="tg-icon-calendar"></i>
      </span>
    </div>
  </div>
</template>
