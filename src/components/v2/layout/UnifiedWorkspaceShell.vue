<template>
  <div class="syp-shell" :class="shellClass">
    <nav v-if="isSettingsView" class="syp-shell__nav">
      <div class="syp-shell__section-title">设置导航</div>
      <button
        v-for="item in navItems"
        :key="item.key"
        type="button"
        class="syp-shell__nav-item"
        :class="{ 'is-active': item.key === activeNavKey }"
        @click="$emit('change-section', item.key as 'account' | 'picbed' | 'preference')"
      >
        {{ item.label }}
      </button>
    </nav>

    <main class="syp-shell__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  currentView?: "quick_publish" | "settings"
  activeSection?: "account" | "picbed" | "preference"
}>()

defineEmits<{
  (event: "change-section", section: "account" | "picbed" | "preference"): void
}>()

const isSettingsView = computed(() => props.currentView === "settings")
const shellClass = computed(() => (isSettingsView.value ? "is-settings" : "is-quick-publish"))

const navItems = [
  { key: "account", label: "账号设置" },
  { key: "image-hosting", label: "图床设置" },
  { key: "preference", label: "偏好设置" },
]

const activeNavKey = computed(() => props.activeSection ?? "account")
</script>

<style scoped lang="stylus">
.syp-shell
  display flex
  flex 1
  min-height 0
  overflow hidden

.syp-shell__main
  flex 1
  min-width 0
  min-height 0
  overflow-y auto
</style>
