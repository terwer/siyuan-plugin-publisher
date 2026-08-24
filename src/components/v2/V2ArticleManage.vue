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
        <div class="syp-manage-shell__eyebrow">{{ t("v2.articleManage.eyebrow") }}</div>
        <h2 class="syp-manage-shell__title">{{ t("v2.articleManage.title") }}</h2>
        <p class="syp-manage-shell__desc">{{ t("v2.articleManage.desc") }}</p>
      </div>
    </div>

    <div class="syp-manage-shell__body">
      <ArticleManageList :enableView="isBlogInstalled" :enablePicgo="isPicgoInstalled" @action="handleAction" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import ArticleManageList from "~/src/components/common/ArticleManageList.vue"
import { ArticleManageAction } from "~/src/composables/useArticleManage.ts"
import { useV2ArticleManage } from "~/src/composables/v2/useV2ArticleManage.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import { getSiyuanPageId } from "~/src/utils/siyuanUtils.ts"
import { PluginUtils } from "~/src/utils/pluginUtils.ts"

const emit = defineEmits<{
  openSingle: [pageId: string, platformKey?: string, title?: string]
  openBatch: [pageId: string, title?: string]
  openFlash: [pageId: string, title?: string]
}>()

const { t } = useV2I18n()
const { publishToSinglePlatform, viewArticle, openPicgo } = useV2ArticleManage()

const isPicgoInstalled = ref(false)
const isBlogInstalled = ref(false)

onMounted(async () => {
  isPicgoInstalled.value = await PluginUtils.preCheckPicgoPlugin()
  isBlogInstalled.value = await PluginUtils.preCheckBlogPlugin()
})

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
    case "view": {
      if (pageId) {
        await viewArticle(pageId)
      }
      break
    }
    case "picgo": {
      if (pageId) {
        await openPicgo(pageId)
      }
      break
    }
    case "platform-single": {
      if (pageId && action.platformKey) {
        await publishToSinglePlatform(action.platformKey, pageId)
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
@import "../../assets/v2/variables.styl"

.syp-manage-shell
  display flex
  flex-direction column
  gap 12px

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
