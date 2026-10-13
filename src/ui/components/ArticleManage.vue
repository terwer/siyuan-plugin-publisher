<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <section class="syp-manage-shell">
    <div class="syp-manage-shell__header">
      <div>
        <div class="syp-manage-shell__eyebrow">{{ t("articleManage.eyebrow") }}</div>
        <h2 class="syp-manage-shell__title">{{ t("articleManage.title") }}</h2>
        <p class="syp-manage-shell__desc">{{ t("articleManage.desc") }}</p>
      </div>
    </div>

    <div class="syp-manage-shell__body">
      <ArticleManageList @action="handleAction" />
    </div>
  </section>
</template>

<script setup lang="ts">
import ArticleManageList from "~/src/ui/components/bridge/common/ArticleManageList.vue"
import { ArticleManageAction } from "~/src/composables/useArticleManage.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { getSiyuanPageId } from "~/src/utils/siyuanUtils.ts"

const emit = defineEmits<{
  openSingle: [pageId: string, platformKey?: string, title?: string]
  openBatch: [pageId: string, title?: string]
  openFlash: [pageId: string, title?: string]
}>()

const { t } = useAppI18n()
const handleAction = async (action: ArticleManageAction) => {
  const pageId = action.row?.postid ?? ""
  const title = action.row?.title ?? ""
  switch (action.type) {
    case "quick": {
      if (pageId) {
        emit("openFlash", pageId, title)
      }
      break
    }
    case "single": {
      if (pageId) {
        emit("openSingle", pageId, undefined, title)
      }
      break
    }
    case "batch": {
      if (pageId) {
        emit("openBatch", pageId, title)
      }
      break
    }
    case "platform-single": {
      if (pageId && action.platformKey) {
        emit("openSingle", pageId, action.platformKey, title)
      }
      break
    }
    case "widget-empty": {
      const currentPageId = await getSiyuanPageId()
      if (currentPageId) {
        emit("openFlash", currentPageId, "")
      }
      break
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../assets/variables.styl"
@import "../assets/bridge.styl"

.syp-manage-shell
  display flex
  flex-direction column
  gap 12px

  // 文章管理列表与筛选是复用组件，统一压到紧凑尺寸
  syp-compact-bridge()

  &__header
    display flex
    flex-direction column
    gap 4px

  &__eyebrow
    font-size 12px
    letter-spacing 0.08em
    text-transform uppercase
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)

  &__title
    margin 0
    font-size 20px
    line-height 1.3
    color var(--b3-theme-on-background, $syp-text-primary)

  &__desc
    margin 0
    font-size 13px
    color var(--b3-theme-on-surface-light, $syp-text-secondary)

  &__body
    overflow-y auto
    max-height calc(100vh - 320px)
</style>
