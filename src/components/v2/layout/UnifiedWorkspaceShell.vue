<template>
  <div class="syp-shell" :class="shellClass">
    <nav v-if="isSettingsView" class="syp-shell__nav">
      <div class="syp-shell__section-title">{{ t("v2.nav.title") }}</div>
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
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"

type V2SettingsSection = "account" | "picbed" | "preference"
const { t } = useV2I18n()

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
  { key: "account", label: t("v2.nav.account") },
  { key: "picbed", label: t("v2.nav.picbed") },
  { key: "preference", label: t("v2.nav.preference") },
]

const activeNavKey = computed(() => props.activeSection ?? "account")
</script>
