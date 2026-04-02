<template>
  <article class="syp-platform-card">
    <div class="syp-platform-card__icon">
      <span v-if="platformIcon" v-html="platformIcon"></span>
      <span v-else class="syp-platform-card__fallback">{{ platformName.slice(0, 1) }}</span>
    </div>
    <div class="syp-platform-card__body">
      <div class="syp-platform-card__name">{{ platformName }}</div>
      <div class="syp-platform-card__meta">
        <span class="syp-platform-card__status" :class="{ 'is-published': isPublished }">
          {{ isPublished ? "已发布" : "未发布" }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  platformName: string
  platformIcon?: string
  isPublished?: boolean
}>()
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
  background #f4f6f8
  color #7b8490
  font-size 12px

  &.is-published
    background rgba(52, 199, 36, 0.12)
    color #2f8b24
</style>
