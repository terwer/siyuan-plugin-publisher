<template>
  <div
    class="pt-setting-panel"
    :class="{ 'pt-setting-panel--visible': modelValue }"
  >
    <div class="pt-setting-panel__header">
      <h3 class="pt-setting-panel__title">{{ title }}</h3>
      <span class="pt-setting-panel__close" @click="handleClose">
        <slot name="close-icon">×</slot>
      </span>
    </div>
    <div class="pt-setting-panel__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="pt-setting-panel__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: "设置"
})

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const handleClose = () => {
  emit("update:modelValue", false)
}
</script> 