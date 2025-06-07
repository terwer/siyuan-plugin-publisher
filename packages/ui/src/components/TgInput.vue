<script setup lang="ts">
import { computed, ref } from "vue"

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  size?: "large" | "default" | "small"
  prefix?: string
  suffix?: string
  type?: "text" | "password" | "number" | "email" | "tel" | "url" | "textarea"
  maxlength?: number
  minlength?: number
  clearable?: boolean
  showPassword?: boolean
  status?: "error" | "warning" | "success"
  readonly?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "",
  disabled: false,
  size: "default",
  type: "text",
  clearable: false,
  showPassword: false,
  readonly: false,
  rows: 3,
})

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "change", value: string): void
  (e: "clear"): void
  (e: "focus", event: FocusEvent): void
  (e: "blur", event: FocusEvent): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isPasswordVisible = ref(false)

const classes = computed(() => {
  return [
    "tg-input",
    props.size !== "default" ? `tg-input--${props.size}` : "",
    props.disabled ? "tg-input--disabled" : "",
    props.status ? `tg-input--${props.status}` : "",
    props.readonly ? "tg-input--readonly" : "",
    props.type === "textarea" ? "tg-input--textarea" : "",
  ].filter(Boolean)
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit("update:modelValue", target.value)
  emit("change", target.value)
}

const handleClear = () => {
  emit("update:modelValue", "")
  emit("clear")
  inputRef.value?.focus()
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const handleFocus = (event: FocusEvent) => {
  emit("focus", event)
}

const handleBlur = (event: FocusEvent) => {
  emit("blur", event)
}
</script>

<template>
  <div :class="['tg-input', type === 'textarea' ? 'tg-input--textarea' : '', size !== 'default' ? `tg-input--${size}` : '', disabled ? 'tg-input--disabled' : '', status ? `tg-input--${status}` : '', readonly ? 'tg-input--readonly' : '']">
    <template v-if="type === 'textarea'">
      <textarea
        ref="inputRef"
        class="tg-input__textarea"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :rows="rows"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      ></textarea>
    </template>
    <template v-else>
      <div class="tg-input__wrapper">
        <span v-if="prefix" class="tg-input__prefix">{{ prefix }}</span>
        <input
          ref="inputRef"
          class="tg-input__inner"
          :type="type === 'password' && isPasswordVisible ? 'text' : type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :minlength="minlength"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <span v-if="suffix" class="tg-input__suffix">{{ suffix }}</span>
        <span v-if="clearable && modelValue" class="tg-input__clear" @click="handleClear">
          <i class="tg-icon-close"></i>
        </span>
        <span v-if="type === 'password'" class="tg-input__password-toggle" @click="togglePasswordVisibility">
          <i :class="isPasswordVisible ? 'tg-icon-eye' : 'tg-icon-eye-close'"></i>
        </span>
      </div>
    </template>
  </div>
</template>
