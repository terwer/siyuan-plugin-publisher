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
        @click="$emit('change-section', item.key)"
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

type V2SettingsSection = "account" | "picbed" | "preference"

const props = defineProps<{
  currentView?: "quick_publish" | "settings"
  activeSection?: V2SettingsSection
}>()

defineEmits<{
  (event: "change-section", section: V2SettingsSection): void
}>()

const isSettingsView = computed(() => props.currentView === "settings")
const shellClass = computed(() => (isSettingsView.value ? "is-settings" : "is-quick-publish"))

const navItems: Array<{ key: V2SettingsSection; label: string }> = [
  { key: "account", label: "账号设置" },
  { key: "picbed", label: "图床设置" },
  { key: "preference", label: "偏好设置" },
]

const activeNavKey = computed(() => props.activeSection ?? "account")
</script>
