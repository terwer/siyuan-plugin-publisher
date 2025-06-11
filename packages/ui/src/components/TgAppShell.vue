<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ref, watch } from "vue"
import type { AppShellProps, AppShellEmits, AppShellNavItem } from "../types"

const props = withDefaults(defineProps<AppShellProps>(), {
  collapsed: false,
  navWidth: 200,
  showCollapseButton: true,
  fixed: false,
  showNav: true,
})

const emit = defineEmits<AppShellEmits>()

const isCollapsed = ref(props.collapsed)

watch(
  () => props.collapsed,
  (newVal) => {
    isCollapsed.value = newVal
  },
)

const handleNavClick = (route: string) => {
  emit("navChange", route)
  console.log(`Navigation changed to route: ${route}`)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  emit("collapseChange", isCollapsed.value)
}
</script>

<template>
  <div class="tg-app-shell" :class="{ fixed }">
    <div v-if="showNav" class="tg-app-shell__nav" :class="{ 'tg-app-shell__nav--collapsed': isCollapsed }">
      <div class="tg-app-shell__nav-header">
        <slot name="nav-header"></slot>
      </div>
      <div class="tg-app-shell__nav-content">
        <slot name="nav-content"></slot>
      </div>
      <div class="tg-app-shell__collapse-handle" @click="toggleCollapse">
        <span>{{ isCollapsed ? "→" : "←" }}</span>
      </div>
    </div>

    <div class="tg-app-shell__content" :class="{ 'tg-app-shell__content--collapsed': isCollapsed }">
      <div v-if="$slots.header" class="tg-app-shell__header">
        <slot name="header"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
