<template>
  <div class="syp-shell" :class="shellClass">
    <aside class="syp-shell__brand">
      <div class="syp-brand-card">
        <div class="syp-brand-chip">SiYuan Plugin</div>
        <div class="syp-brand-title">发布工具改版 V2.0</div>
        <div class="syp-brand-meta">Publisher DOM Runtime</div>
      </div>
    </aside>

    <nav v-if="isSettingsView" class="syp-shell__nav">
      <div class="syp-shell__section-title">设置导航</div>
      <button
        v-for="item in navItems"
        :key="item.key"
        type="button"
        class="syp-shell__nav-item"
        :class="{ 'is-active': item.key === activeNavKey }"
      >
        {{ item.label }}
      </button>
    </nav>

    <main class="syp-shell__main">
      <slot name="main" />
    </main>

    <section v-if="isSettingsView" class="syp-shell__detail">
      <slot name="detail" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  initialView?: "quick_publish" | "settings"
}>()

const isSettingsView = computed(() => props.initialView === "settings")
const shellClass = computed(() => (isSettingsView.value ? "is-settings" : "is-quick-publish"))

const navItems = [
  { key: "account", label: "账号设置" },
  { key: "image-hosting", label: "图床设置" },
  { key: "preference", label: "偏好设置" },
]

const activeNavKey = computed(() => (isSettingsView.value ? "account" : ""))
</script>
