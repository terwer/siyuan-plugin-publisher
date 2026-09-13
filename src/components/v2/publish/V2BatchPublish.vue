<template>
  <section class="syp-batch-view" role="region" :aria-label="t('v2.panel.batchPublish')">
    <div class="syp-batch-view__head">
      <button
        v-if="!embedded"
        type="button"
        class="syp-batch-view__back"
        :aria-label="t('v2.batchPublish.back')"
        @click="$emit('back')"
      >
        <LucideChevronLeft />
      </button>
      <div>
        <div class="syp-batch-view__eyebrow">{{ t("v2.panel.batchPublish") }}</div>
        <h2 class="syp-batch-view__title">{{ t("v2.panel.batchPublish") }}</h2>
      </div>
    </div>

    <div class="syp-batch-view__body">
      <BatchPublishIndex :id="pageId" />
    </div>
  </section>
</template>

<script setup lang="ts">
import LucideChevronLeft from "~icons/lucide/chevron-left"
import BatchPublishIndex from "~/src/components/publish/BatchPublishIndex.vue"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"

defineProps<{
  pageId: string
  embedded?: boolean
}>()

defineEmits<{
  (event: "back"): void
}>()

const { t } = useV2I18n()
</script>

<style scoped lang="stylus">
@import "../../../assets/v2/variables.styl"

.syp-batch-view
  display flex
  flex-direction column
  gap 12px

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
