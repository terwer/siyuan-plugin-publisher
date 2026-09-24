<template>
  <div class="syp-shell" :class="shellClass">
    <nav v-if="isSettingsView" class="syp-shell__nav">
      <div class="syp-shell__section-title">{{ t("nav.title") }}</div>
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
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import type { SettingsSection } from "~/src/ui/composables/useSettings.ts"

export type AppView = "quick_publish" | "settings" | "manage" | "single_publish" | "batch_publish" | "ai_chat"
const { t } = useAppI18n()

const props = defineProps<{
  currentView?: AppView
  activeSection?: SettingsSection
}>()

defineEmits<{
  (event: "change-section", section: SettingsSection): void
}>()

const isSettingsView = computed(() => props.currentView === "settings")
const shellClass = computed(() => (isSettingsView.value ? "is-settings" : "is-quick-publish"))

const navItems: Array<{ key: SettingsSection; label: string }> = [
  { key: "account", label: t("nav.account") },
  { key: "picbed", label: t("nav.picbed") },
  { key: "preference", label: t("nav.preference") },
  { key: "repair", label: t("nav.repair") },
  { key: "ai", label: t("nav.ai") },
  { key: "about", label: t("nav.about") },
]

const activeNavKey = computed(() => props.activeSection ?? "account")
</script>
