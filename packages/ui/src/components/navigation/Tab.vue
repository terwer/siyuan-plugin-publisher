<template>
  <div class="pt-tab">
    <div class="pt-tab__header">
      <ul class="pt-tab__nav">
        <li
          v-for="pane in panes"
          :key="pane.name"
          class="pt-tab__item"
          :class="{
            'pt-tab__item--active': modelValue === pane.name,
            'pt-tab__item--disabled': pane.disabled
          }"
          @click="handleTabClick(pane)"
        >
          {{ pane.label }}
        </li>
      </ul>
    </div>
    <div class="pt-tab__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from "vue"

interface TabPane {
  name: string
  label: string
  disabled?: boolean
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const panes = ref<TabPane[]>([])

const addPane = (pane: TabPane) => {
  panes.value.push(pane)
}

const removePane = (name: string) => {
  const index = panes.value.findIndex(pane => pane.name === name)
  if (index !== -1) {
    panes.value.splice(index, 1)
  }
}

const handleTabClick = (pane: TabPane) => {
  if (pane.disabled) return
  emit("update:modelValue", pane.name)
}

provide("tabContext", {
  activeName: props.modelValue,
  addPane,
  removePane
})
</script> 