<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <section class="pt-tab" :class="{ 'pt-tab--vertical': vertical }">
    <div class="pt-tab__header" :class="{ 'pt-tab__header--collapsed': isCollapsed }">
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
    <button class="pt-tab__collapse-handle" @click="toggleCollapse">
      <svg class="pt-tab__collapse-icon" viewBox="0 0 24 24">
        <path
          v-if="isCollapsed"
          d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01z"
        />
        <path
          v-else
          d="M14.71 6.71a1 1 0 0 0-1.41 0L8.71 11.3a1 1 0 0 0 0 1.41l4.59 4.59a1 1 0 1 0 1.41-1.41L10.83 12l3.88-3.88a1 1 0 0 0 0-1.41z"
        />
      </svg>
    </button>
    <div class="pt-tab__content" :class="{ 'pt-tab__content--collapsed': isCollapsed }">
      <slot></slot>
    </div>
  </section>
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
  vertical?: boolean
  collapsed?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "collapse", value: boolean): void
}>()

const panes = ref<TabPane[]>([])
const isCollapsed = ref(props.collapsed || false)

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

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  emit("collapse", isCollapsed.value)
}

provide("tabContext", {
  activeName: props.modelValue,
  addPane,
  removePane
})
</script> 