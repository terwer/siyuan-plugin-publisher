<template>
  <article
    class="syp-platform-card"
    :class="{ 'is-disabled': !isAuthorized }"
    :aria-disabled="!isAuthorized"
    :title="!isAuthorized ? tooltipText : ''"
  >
    <div class="syp-platform-card__icon">
      <span v-if="platformIcon" v-html="platformIcon"></span>
      <span v-else class="syp-platform-card__fallback">{{ platformName.slice(0, 1) }}</span>
    </div>
    <div class="syp-platform-card__body">
      <div class="syp-platform-card__name">{{ platformName }}</div>
      <div class="syp-platform-card__meta">
        <span class="syp-platform-card__status" :class="{ 'is-ready': isAuthorized, 'is-disabled': !isAuthorized }">
          {{ isAuthorized ? t("v2.card.status.quickPublishReady") : t("v2.card.status.unauthorized") }}
        </span>
        <span v-if="isAuthorized" class="syp-platform-card__published">
          {{ isPublished ? t("v2.card.status.published") : t("v2.card.status.unpublished") }}
        </span>
      </div>
      <div class="syp-platform-card__actions">
        <button
          v-if="isAuthorized"
          type="button"
          class="syp-platform-card__action syp-platform-card__action--primary"
          :class="{ 'is-danger': isFailed, 'is-outline': isPublished && !isFailed }"
          :disabled="isProcessing"
          @click.stop="handlePrimary"
        >
          {{ primaryLabel }}
        </button>
        <button
          v-if="isPublished"
          type="button"
          class="syp-platform-card__action"
          :disabled="isProcessing"
          :aria-label="previewLink ? t('v2.card.action.previewAriaWithUrl', { url: previewLink }) : t('v2.card.action.preview')"
          @click.stop="handlePreview"
        >
          {{ t("v2.card.action.preview") }}
        </button>
        <button
          v-if="isPublished"
          type="button"
          class="syp-platform-card__action syp-platform-card__action--danger"
          :disabled="isProcessing"
          @click.stop="toggleDeleteConfirm"
        >
          {{ t("v2.card.action.delete") }}
        </button>
      </div>
      <SypConfirmBar
        :visible="showDeleteConfirm"
        :message="t('v2.card.confirm.deleteText')"
        :confirm-text="t('v2.card.confirm.delete')"
        :cancel-text="t('v2.card.confirm.cancel')"
        :loading="isProcessing"
        @confirm="confirmDelete"
        @cancel="toggleDeleteConfirm"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SypConfirmBar from "~/src/components/v2/common/SypConfirmBar.vue";
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts";

const props = defineProps<{
  platformName: string
  platformIcon?: string
  isAuthorized?: boolean
  isPublished?: boolean
  tooltipText?: string
  isProcessing?: boolean
  previewLink?: string
  isFailed?: boolean
}>()

const emit = defineEmits<{
  (event: "primary"): void
  (event: "preview"): void
  (event: "delete"): void
}>()
const { t } = useV2I18n()

const showDeleteConfirm = ref(false)

const handlePrimary = () => {
  if (props.isAuthorized === false) {
    return
  }
  emit("primary")
}

const handlePreview = () => {
  emit("preview")
}

const toggleDeleteConfirm = () => {
  showDeleteConfirm.value = !showDeleteConfirm.value
}

const confirmDelete = () => {
  showDeleteConfirm.value = false
  emit("delete")
}

const primaryLabel = computed(() => {
  if (props.isFailed) {
    return t("v2.card.action.retry")
  }
  return props.isPublished ? t("v2.card.action.update") : t("v2.card.action.publish")
})
</script>

<style scoped lang="stylus">
@import "../../../assets/v2/variables.styl"

.syp-platform-card
  display flex
  align-items center
  gap 10px
  padding 10px
  border 1px solid $syp-border-primary
  border-radius $syp-sm-card-radius
  background $syp-card-bg-gradient
  &.is-disabled
    opacity 0.72

.syp-platform-card__icon
  width $syp-sm-icon-size
  height $syp-sm-icon-size
  border-radius $syp-sm-icon-radius
  background $syp-icon-bg
  display flex
  align-items center
  justify-content center
  color $syp-icon-color

  :deep(svg)
    width $syp-sm-icon-inner
    height $syp-sm-icon-inner

  :deep(img)
    width $syp-sm-icon-inner
    height $syp-sm-icon-inner
    object-fit contain

.syp-platform-card__fallback
  font-size 14px
  font-weight 700

.syp-platform-card__body
  min-width 0
  display flex
  flex-direction column
  gap 4px

.syp-platform-card__name
  font-size $syp-sm-name-size
  font-weight 600
  color $syp-text-primary

.syp-platform-card__status
  display inline-flex
  align-items center
  width fit-content
  padding 2px 7px
  border-radius 999px
  font-size $syp-sm-badge-font

  &.is-ready
    background $syp-badge-ready-bg
    color $syp-badge-ready-text

  &.is-disabled
    background $syp-badge-disabled-bg
    color $syp-badge-disabled-text

.syp-platform-card__published
  font-size 12px
  color $syp-text-tertiary

.syp-platform-card__actions
  margin-top 4px
  display flex
  flex-wrap wrap
  gap 6px

.syp-platform-card__action
  padding 0
  border none
  background transparent
  color $syp-action-primary
  font-size 12px
  cursor pointer

  &:hover
    text-decoration underline

  &:disabled
    color $syp-text-disabled
    cursor not-allowed
    text-decoration none

.syp-platform-card__action--danger
  color $syp-action-danger

.syp-platform-card__action--primary
  padding 2px 8px
  border-radius $syp-radius-sm
  border 1px solid $syp-action-primary
  background $syp-action-primary
  color #fff
  font-size 12px
  line-height 1.4

  &:hover
    text-decoration none
    background $syp-action-primary-hover
    border-color $syp-action-primary-hover

  &:disabled
    opacity 0.6
    cursor not-allowed

  &.is-danger
    border-color $syp-action-danger
    background $syp-action-danger

    &:hover
      background $syp-action-danger-hover
      border-color $syp-action-danger-hover

  &.is-outline
    background transparent
    color $syp-action-primary
    border-color $syp-action-primary

    &:hover
      background rgba(47, 109, 213, 0.1)
      border-color $syp-action-primary-hover
</style>
