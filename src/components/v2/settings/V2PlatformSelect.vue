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
      <section v-for="group in groupedItems" :key="group.key" class="syp-platform-select-group">
        <div class="syp-platform-select-group__title">{{ group.label }}</div>

        <div class="syp-platform-select-group__grid">
          <button
            v-for="item in group.items"
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts";
import type { V2SelectablePlatform } from "~/src/composables/v2/useV2Settings.ts";
import { PlatformType } from "~/src/platforms/dynamicConfig.ts";

const props = defineProps<{
  items: V2SelectablePlatform[]
}>()
const { t } = useV2I18n()

const groupDefs: Array<{ key: PlatformType; labelKey: string }> = [
  { key: PlatformType.Common, labelKey: "setting.platform.universal" },
  { key: PlatformType.Github, labelKey: "setting.platform.github" },
  { key: PlatformType.Gitlab, labelKey: "setting.platform.gitlab" },
  { key: PlatformType.Metaweblog, labelKey: "setting.platform.metaweblog" },
  { key: PlatformType.Wordpress, labelKey: "setting.platform.wordpress" },
  { key: PlatformType.Fs, labelKey: "setting.platform.fs" },
]

const groupedItems = computed(() => {
  return groupDefs
    .map((group) => ({
      key: group.key,
      label: t(group.labelKey),
      items: props.items.filter((item) => item.platformType === group.key),
    }))
    .filter((group) => group.items.length > 0)
})

defineEmits<{
  (event: "select", item: V2SelectablePlatform): void
}>()
</script>

<style scoped lang="stylus">
@import "../../../assets/v2/variables.styl"

.syp-platform-select-list
  display flex
  flex-direction column
  gap 12px

.syp-platform-select-group
  display flex
  flex-direction column
  gap 6px

.syp-platform-select-group__title
  font-size 13px
  font-weight 600
  color $syp-text-secondary
  letter-spacing 0.04em
  text-transform uppercase

.syp-platform-select-group__grid
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 8px

.syp-platform-select-item
  width 100%
  display flex
  gap 10px
  align-items center
  padding 10px
  border 1px solid $syp-border-primary
  border-radius $syp-sm-card-radius
  background $syp-card-bg-gradient
  cursor pointer
  text-align left
  transition border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease

  &:hover
    border-color #c8d6ea
    background $syp-bg-primary
    box-shadow 0 6px 18px rgba(15, 23, 42, 0.08)

.syp-platform-select-item__icon
  width $syp-sm-icon-size
  height $syp-sm-icon-size
  border-radius $syp-sm-icon-radius
  background $syp-icon-bg
  display flex
  align-items center
  justify-content center
  color $syp-icon-color
  flex-shrink 0

  :deep(svg), :deep(img)
    width $syp-sm-icon-inner
    height $syp-sm-icon-inner

.syp-platform-select-item__info
  min-width 0

.syp-platform-select-item__name
  font-size $syp-sm-name-size
  font-weight 600
  color $syp-text-primary

.syp-platform-select-item__desc
  margin-top 2px
  font-size 12px
  color $syp-text-secondary

@media (max-width: 960px)
  .syp-platform-select-group__grid
    grid-template-columns 1fr
</style>
