<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'primary' | 'text'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'default',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const classes = computed(() => {
  return [
    'tg-button',
    props.type !== 'default' ? `tg-button--${props.type}` : '',
    props.size !== 'default' ? `tg-button--${props.size}` : '',
    props.disabled ? 'tg-button--disabled' : ''
  ].filter(Boolean)
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template> 