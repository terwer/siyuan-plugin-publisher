<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  size: 'default'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const classes = computed(() => {
  return [
    'tg-input',
    props.size !== 'default' ? `tg-input--${props.size}` : '',
    props.disabled ? 'tg-input--disabled' : ''
  ].filter(Boolean)
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('change', target.value)
}
</script>

<template>
  <div :class="classes">
    <div class="tg-input__wrapper">
      <span v-if="prefix" class="tg-input__prefix">
        {{ prefix }}
      </span>
      <input
        class="tg-input__inner"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
      >
      <span v-if="suffix" class="tg-input__suffix">
        {{ suffix }}
      </span>
    </div>
  </div>
</template> 