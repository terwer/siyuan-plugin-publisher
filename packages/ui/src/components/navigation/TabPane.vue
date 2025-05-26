<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <section
    class="pt-tab-pane"
    :class="{ 'pt-tab-pane--active': active }"
    v-show="active"
  >
    <slot></slot>
  </section>
</template>

<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount } from "vue"

interface Props {
  name: string
  label: string
  disabled?: boolean
}

interface TabContext {
  activeName: string
  addPane: (pane: { name: string; label: string; disabled?: boolean }) => void
  removePane: (name: string) => void
}

const props = defineProps<Props>()
const active = defineModel<boolean>("active", { default: false })

const tabContext = inject<TabContext>("tabContext")

onMounted(() => {
  tabContext?.addPane({
    name: props.name,
    label: props.label,
    disabled: props.disabled
  })
})

onBeforeUnmount(() => {
  tabContext?.removePane(props.name)
})
</script> 