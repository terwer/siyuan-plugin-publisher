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

  const props = withDefaults(
    defineProps<{
      tabs: { label: string; content: any; props?: Record<string, any> }[]
      activeTab?: number
      vertical?: boolean
      collapsed?: boolean
    }>(),
    {
      activeTab: 0,
      vertical: false,
      collapsed: false
    }
  )

  const emit = defineEmits<{
    (e: "tabChange", index: number): void
  }>()

  const activeIndex = ref(props.activeTab)
  const isCollapsed = ref(props.collapsed)

  watch(
    () => props.activeTab,
    newVal => {
      activeIndex.value = newVal
    }
  )

  watch(
    () => props.collapsed,
    newVal => {
      isCollapsed.value = newVal
    }
  )

  const handleTabClick = (index: number) => {
    if (index !== activeIndex.value) {
      activeIndex.value = index
      emit("tabChange", index)
    }
  }

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }
</script>

<template>
  <div id="publisherApp">
    <div :class="['pt-tabs', { vertical }]">
      <div class="pt-tabs-nav" :class="{ 'pt-tabs-nav-collapsed': isCollapsed }">
        <div class="pt-tabs-list">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            class="pt-tabs-item"
            :class="{ 'pt-tabs-item-active': index === activeIndex }"
            @click.stop="handleTabClick(index)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <button class="pt-tabs-handle" @click.stop="toggleCollapse">
        <svg class="pt-tabs-icon" viewBox="0 0 24 24">
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

      <div class="pt-tabs-content">
        <component
          v-if="tabs[activeIndex]?.content"
          :is="tabs[activeIndex].content"
          v-bind="tabs[activeIndex].props"
          class="pt-tabs-pane"
        />
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
  @import '../styles/components/tabs.styl'
</style>
