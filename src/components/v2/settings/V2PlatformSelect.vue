<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">{{ t("v2.platformSelect.eyebrow") }}</div>
        <h2 class="syp-settings-page__title">{{ t("v2.platformSelect.title") }}</h2>
        <p class="syp-settings-page__desc">{{ t("v2.platformSelect.desc") }}</p>
      </div>
    </div>

    <div class="syp-platform-select-list">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        class="syp-platform-select-item"
        @click="$emit('select', item)"
      >
        <div class="syp-platform-select-item__icon">
          <span v-if="item.platformIcon" v-html="item.platformIcon"></span>
          <span v-else>{{ item.platformName.slice(0, 1) }}</span>
        </div>
        <div class="syp-platform-select-item__info">
          <div class="syp-platform-select-item__name">{{ item.platformName }}</div>
          <div class="syp-platform-select-item__desc">{{ t("v2.platformSelect.itemDesc") }}</div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { V2SelectablePlatform } from "~/src/composables/v2/useV2Settings.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"

defineProps<{
  items: V2SelectablePlatform[]
}>()
const { t } = useV2I18n()

defineEmits<{
  (event: "select", item: V2SelectablePlatform): void
}>()
</script>

<style scoped lang="stylus">
.syp-platform-select-list
  display flex
  flex-direction column
  gap 12px

.syp-platform-select-item
  width 100%
  display flex
  gap 14px
  align-items center
  padding 18px
  border 1px solid #e6ebf2
  border-radius 16px
  background linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
  cursor pointer
  text-align left
  transition border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease

  &:hover
    border-color #c8d6ea
    background #fff
    box-shadow 0 6px 18px rgba(15, 23, 42, 0.08)

.syp-platform-select-item__icon
  width 44px
  height 44px
  border-radius 12px
  background #f2f5fa
  display flex
  align-items center
  justify-content center
  color #355d90
  flex-shrink 0

  :deep(svg), :deep(img)
    width 22px
    height 22px

.syp-platform-select-item__info
  min-width 0

.syp-platform-select-item__name
  font-size 16px
  font-weight 600
  color #1f2329

.syp-platform-select-item__desc
  margin-top 4px
  font-size 13px
  color #667085
</style>
