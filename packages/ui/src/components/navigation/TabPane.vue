<template>
  <div
    class="pt-tab__pane"
    :class="{ 'pt-tab__pane--active': active }"
    v-show="active"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  label: string
  disabled?: boolean
}

defineProps<Props>()

const active = defineModel<boolean>("active", { default: false })
</script> 