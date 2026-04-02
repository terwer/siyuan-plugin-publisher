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
          {{ isAuthorized ? "可快速发布" : "未授权" }}
        </span>
        <span v-if="isAuthorized" class="syp-platform-card__published">
          {{ isPublished ? "已发布" : "未发布" }}
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
          :aria-label="previewLink ? `查看文章：${previewLink}` : '查看文章'"
          @click.stop="handlePreview"
        >
          查看文章
        </button>
        <button
          v-if="isPublished"
          type="button"
          class="syp-platform-card__action syp-platform-card__action--danger"
          :disabled="isProcessing"
          @click.stop="toggleDeleteConfirm"
        >
          删除
        </button>
      </div>
      <div v-if="showDeleteConfirm" class="syp-platform-card__confirm" @click.stop>
        <div class="syp-platform-card__confirm-text">确认删除这篇已发布内容？删除后需要重新发布。</div>
        <div class="syp-platform-card__confirm-actions">
          <button type="button" class="syp-platform-card__confirm-btn" :disabled="isProcessing" @click="confirmDelete">
            确认删除
          </button>
          <button type="button" class="syp-platform-card__confirm-btn ghost" @click="toggleDeleteConfirm">
            取消
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

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
    return "重试"
  }
  return props.isPublished ? "更新" : "发布"
})
</script>

<style scoped lang="stylus">
.syp-platform-card
  display flex
  align-items center
  gap 14px
  padding 18px
  border 1px solid #e6ebf2
  border-radius 16px
  background linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
  &.is-disabled
    opacity 0.72

.syp-platform-card__icon
  width 44px
  height 44px
  border-radius 12px
  background #f2f5fa
  display flex
  align-items center
  justify-content center
  color #355d90

  :deep(svg)
    width 22px
    height 22px

  :deep(img)
    width 22px
    height 22px
    object-fit contain

.syp-platform-card__fallback
  font-size 18px
  font-weight 700

.syp-platform-card__body
  min-width 0
  display flex
  flex-direction column
  gap 6px

.syp-platform-card__name
  font-size 16px
  font-weight 600
  color #1f2329

.syp-platform-card__status
  display inline-flex
  align-items center
  width fit-content
  padding 4px 9px
  border-radius 999px
  font-size 12px

  &.is-ready
    background rgba(52, 199, 36, 0.12)
    color #2f8b24

  &.is-disabled
    background rgba(245, 74, 69, 0.12)
    color #b33d39

.syp-platform-card__published
  font-size 12px
  color #7b8490

.syp-platform-card__actions
  margin-top 6px
  display flex
  flex-wrap wrap
  gap 8px

.syp-platform-card__action
  padding 0
  border none
  background transparent
  color #2f6dd5
  font-size 12px
  cursor pointer

  &:hover
    text-decoration underline

  &:disabled
    color #98a2b3
    cursor not-allowed
    text-decoration none

.syp-platform-card__action--danger
  color #d92d20

.syp-platform-card__action--primary
  padding 4px 10px
  border-radius 999px
  border 1px solid #2f6dd5
  background #2f6dd5
  color #fff
  font-size 12px

  &:hover
    text-decoration none
    background #2b62c0
    border-color #2b62c0

  &:disabled
    opacity 0.6
    cursor not-allowed

  &.is-danger
    border-color #d92d20
    background #d92d20

    &:hover
      background #c6281d
      border-color #c6281d

  &.is-outline
    background transparent
    color #2f6dd5
    border-color #2f6dd5

    &:hover
      background rgba(47, 109, 213, 0.1)
      border-color #2b62c0

.syp-platform-card__confirm
  margin-top 10px
  padding 10px
  border-radius 10px
  border 1px solid #f2d6d6
  background #fff5f5
  display flex
  flex-direction column
  gap 8px

.syp-platform-card__confirm-text
  font-size 12px
  color #912018

.syp-platform-card__confirm-actions
  display flex
  gap 8px

.syp-platform-card__confirm-btn
  padding 4px 10px
  border-radius 8px
  border 1px solid #d92d20
  background #d92d20
  color #fff
  font-size 12px
  cursor pointer

  &.ghost
    background transparent
    color #d92d20

  &:disabled
    opacity 0.6
    cursor not-allowed
</style>
