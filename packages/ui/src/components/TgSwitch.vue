<script setup lang="ts">
import { computed } from "vue"

interface Props {
  modelValue: boolean
  disabled?: boolean
  size?: "large" | "default" | "small"
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: "default",
  loading: false,
})

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "change", value: boolean): void
}>()

const classes = computed(() => {
  return [
    "tg-switch",
    props.size !== "default" ? `tg-switch--${props.size}` : "",
    props.disabled ? "tg-switch--disabled" : "",
    props.loading ? "tg-switch--loading" : "",
    props.modelValue ? "tg-switch--checked" : "",
  ].filter(Boolean)
})

const handleChange = (event: Event) => {
  if (!props.disabled && !props.loading) {
    const target = event.target as HTMLInputElement
    emit("update:modelValue", target.checked)
    emit("change", target.checked)
  }
}
</script>

<template>
  <label :class="classes">
    <input
      type="checkbox"
      class="tg-switch__input"
      :checked="modelValue"
      :disabled="disabled || loading"
      @change="handleChange"
    />
    <span class="tg-switch__slider">
      <span v-if="loading" class="tg-switch__loading">
        <i class="tg-icon-loading"></i>
      </span>
    </span>
  </label>
</template>
