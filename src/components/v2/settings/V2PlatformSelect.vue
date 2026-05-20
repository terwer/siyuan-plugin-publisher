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
            :aria-label="`${item.platformName}，${item.description}`"
            @click="$emit('select', item)"
          >
            <div class="syp-platform-select-item__icon">
              <span v-if="item.platformIcon" v-html="item.platformIcon"></span>
              <span v-else>{{ item.platformName.slice(0, 1) }}</span>
            </div>
            <div class="syp-platform-select-item__info">
              <SypTooltip
                :content="item.platformName"
                ellipsis
                block
                trigger-class="syp-platform-select-item__name"
              />
              <SypTooltip
                :content="item.description"
                ellipsis
                block
                trigger-class="syp-platform-select-item__desc"
              />
            </div>
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import SypTooltip from "~/src/components/v2/common/SypTooltip.vue"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import type { V2SelectablePlatform } from "~/src/composables/v2/useV2Settings.ts"
import { V2_PLATFORM_SELECT_GROUP_DEFS } from "~/src/components/v2/settings/v2PlatformSelectGroups.ts"

const props = defineProps<{
  items: V2SelectablePlatform[]
}>()
const { t } = useV2I18n()

const groupDefs = V2_PLATFORM_SELECT_GROUP_DEFS

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
  color var(--b3-theme-on-surface-light, $syp-text-secondary)
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
  border 1px solid var(--b3-border-color, $syp-border-primary)
  border-radius $syp-sm-card-radius
  background $syp-card-bg-gradient
  color var(--b3-theme-on-surface, $syp-text-primary)
  cursor pointer
  text-align left
  transition border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease

  &:hover
    border-color var(--b3-theme-primary, $syp-primary)
    background var(--b3-theme-surface-light, $syp-bg-secondary)
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.12)

  &:focus-visible
    border-color var(--b3-theme-primary, $syp-primary)
    background var(--b3-theme-surface-light, $syp-bg-secondary)
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.12)
    outline 2px solid var(--b3-theme-primary, $syp-primary)
    outline-offset 2px

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
  flex 1

.syp-platform-select-item__name
  font-size $syp-sm-name-size
  font-weight 600
  color var(--b3-theme-on-surface, $syp-text-primary)

.syp-platform-select-item__desc
  margin-top 2px
  font-size 12px
  color var(--b3-theme-on-surface-light, $syp-text-secondary)

@media (max-width: 960px)
  .syp-platform-select-group__grid
    grid-template-columns 1fr
</style>
