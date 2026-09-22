<template>
  <section class="syp-batch-view" role="region" :aria-label="t('panel.batchPublish')">
    <div class="syp-batch-view__head">
      <button
        v-if="!embedded"
        type="button"
        class="syp-batch-view__back"
        :aria-label="t('batchPublish.back')"
        @click="$emit('back')"
      >
        <LucideChevronLeft />
      </button>
      <div>
        <div class="syp-batch-view__eyebrow">{{ t("panel.batchPublish") }}</div>
        <h2 class="syp-batch-view__title">{{ t("panel.batchPublish") }}</h2>
      </div>
    </div>

    <div class="syp-batch-view__body">
      <BatchPublishIndex :id="pageId" />
    </div>
  </section>
</template>

<script setup lang="ts">
import LucideChevronLeft from "~icons/lucide/chevron-left"
import BatchPublishIndex from "~/src/ui/components/bridge/publish/BatchPublishIndex.vue"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"

defineProps<{
  pageId: string
  embedded?: boolean
}>()

defineEmits<{
  (event: "back"): void
}>()

const { t } = useAppI18n()
</script>

<style scoped lang="stylus">
@import "../../assets/variables.styl"
@import "../../assets/legacy-bridge.styl"

.syp-batch-view
  display flex
  flex-direction column
  gap 12px

  // 内嵌的批量分发表单来自 V1，统一压到 紧凑尺寸
  syp-compact-legacy()

  &__head
    display flex
    align-items flex-start
    gap 10px

  &__back
    display inline-flex
    align-items center
    justify-content center
    width 28px
    height 28px
    border-radius 999px
    border 1px solid var(--b3-border-color, $syp-border-primary)
    background var(--b3-theme-surface, $syp-bg-primary)
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)
    cursor pointer
    flex-shrink 0

    &:hover
      color var(--b3-theme-primary, $syp-accent)
      border-color var(--b3-theme-primary, $syp-accent)

  &__eyebrow
    font-size 12px
    letter-spacing 0.08em
    text-transform uppercase
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)

  &__title
    margin 0
    font-size 18px
    line-height 1.3
    color var(--b3-theme-on-background, $syp-text-primary)

  &__body
    display flex
    flex-direction column
</style>
