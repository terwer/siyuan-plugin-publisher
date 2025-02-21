<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import {defineEmits, defineProps, ref} from "vue"

const props = withDefaults(
    defineProps<{
      tabs: { label: string; content: any; props?: Record<string, any> }[];
      activeTab: number;
      vertical: boolean;
    }>(),
    {
      tabs: [] as any,
      activeTab: 0,
      vertical: false,
    }
)


const emit = defineEmits<{
  (event: "tabChange", index: number): void;
}>()

const activeIndex = ref(props.activeTab)

function handleTabClick(index: number) {
  if (index !== activeIndex.value) {
    activeIndex.value = index
    emit("tabChange", index)
  }
}
</script>

<template>
  <div :class="['tabs', { vertical }]">
    <div class="tab-list">
      <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab"
          :class="{ active: index === activeIndex }"
          @click="handleTabClick(index)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <template v-if=" tabs[activeIndex]">
        <component
            v-if="typeof tabs[activeIndex].content === 'function' || typeof tabs[activeIndex].content === 'object'"
            :is="tabs[activeIndex].content"
            v-bind="tabs[activeIndex].props"
        />
        <template v-else>
          {{ tabs[activeIndex].content }}
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.tabs
  display flex
  flex-direction column
  border-radius 8px
  overflow hidden
  background-color #fff
  box-shadow 0 1px 3px rgba(0, 0, 0, 0.1)
  margin 10px

.tabs.vertical
  flex-direction row

.tabs:not(.vertical)
  flex-direction column

.tab-list
  display flex
  flex-wrap wrap
  border-bottom 1px solid #e0e0e0

.tabs.vertical .tab-list
  flex-direction column
  border-right 1px solid #e0e0e0
  border-bottom none

.tabs:not(.vertical) .tab-list
  flex-direction row

.tab
  padding 12px 16px
  border none
  background-color transparent
  cursor pointer
  position relative
  font-size 14px
  color #555
  transition background-color 0.2s ease

.tabs.vertical .tab:not(:last-child)
  border-bottom 1px solid #e0e0e0

.tabs:not(.vertical) .tab:not(:last-child)
  border-right 1px solid #e0e0e0

.tab.active, .tab:active
  background-color var(--b3-list-hover)
  color var(--b3-theme-on-background)

.tab-content
  padding 16px
  background-color #fff

.tabs.vertical .tab-content
  flex 1

.tabs:not(.vertical) .tab-content
  flex 1

html[data-theme-mode="dark"] .tabs
  background-color: var(--b3-theme-background);

  .tab-content
    background-color: var(--b3-theme-background);

html[data-theme-mode="dark"] .tab-list
  border-bottom 1px solid var(--b3-theme-surface-lighter)

html[data-theme-mode="dark"] .tabs.vertical .tab-list
  border-right 1px solid var(--b3-theme-surface-lighter)

html[data-theme-mode="dark"] .tabs.vertical .tab:not(:last-child)
  border-bottom 1px solid var(--b3-theme-surface-lighter)

html[data-theme-mode="dark"] .tabs:not(.vertical) .tab:not(:last-child)
  border-right 1px solid var(--b3-theme-surface-lighter)
</style>
