<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { getSiyuanPageId } from "~/src/utils/siyuanUtils.ts"
import { useSiyuanSettingStore } from "~/src/stores/useSiyuanSettingStore.ts"
import { PluginUtils } from "~/src/utils/pluginUtils.ts"
import { appBase } from "~/src/utils/constants.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import DrawerBoxBridge from "~/src/components/common/DrawerBoxBridge.vue"
import ArticleManageList from "~/src/components/common/ArticleManageList.vue"
import { ArticleManageAction } from "~/src/composables/useArticleManage.ts"

// uses
const { t } = useVueI18n()
const { isInSiyuanWidget, isInSiyuanOrSiyuanNewWin } = useSiyuanDevice()
const { getReadOnlySiyuanSetting } = useSiyuanSettingStore()

// vars
const logger = createAppLogger("admin")
const siyuanSetting = getReadOnlySiyuanSetting()
const isPicgoInstalled = ref(false)
const isBlogInstalled = ref(false)
const showDrawer = ref(false)
const drawerTitle = ref("")
const drawerSrc = ref("")

// =====================================================================================================================
/**
 * 打开抽屉 - 通用
 *
 * @param title 标题
 * @param url 地址
 */
const goToDrawer = (title: string, url: string) => {
  drawerTitle.value = title
  drawerSrc.value = url
  showDrawer.value = true
}

/**
 * 打开抽屉 - 发布工具内部
 *
 * @param title 标题
 * @param pageUrl 内部地址，包括参数
 */
const goToPublisherDrawer = (title: string, pageUrl: string) => {
  const win = window as any
  const url = `${win.origin}${appBase}#${pageUrl}`
  logger.debug(`Publisher will go to ${url}`)

  goToDrawer(title, url)
}

/**
 * 打开抽屉 - 在线分享内部
 *
 * @param title 标题
 * @param pageUrl 内部地址，包括参数
 */
const goToBlogDrawer = (title: string, pageUrl: string) => {
  const url = `${siyuanSetting.value.apiUrl}/plugins/siyuan-blog/app/#${pageUrl}`
  logger.debug(`Blog will go to ${url}`)

  goToDrawer(title, url)
}

/**
 * 打开抽屉 - Picgo 内部
 *
 * @param title 标题
 * @param pageUrl 内部地址，包括参数
 */
const goToPicgoDrawer = (title: string, pageUrl: string) => {
  const url = `${siyuanSetting.value.apiUrl}/plugins/siyuan-plugin-picgo/#${pageUrl}`
  logger.debug(`Picgo will go to ${url}`)

  goToDrawer(title, url)
}
const goToPicgoNewWin = (pageUrl: string) => {
  const url = `${siyuanSetting.value.apiUrl}/plugins/siyuan-plugin-picgo/#${pageUrl}`
  logger.debug(`Picgo will go to ${url}`)

  const win = window as any
  win.open(url)
}
// =====================================================================================================================

/**
 * 处理共享组件抛出的导航动作（V1 落地：router 跳转 + DrawerBoxBridge iframe）。
 *
 * @param action 动作负载
 */
const handleAction = async (action: ArticleManageAction) => {
  const row = action.row
  switch (action.type) {
    case "quick":
      goToPublisherDrawer("极速发布", `/publish/quickSelect?id=${row?.postid}`)
      break
    case "single":
      goToPublisherDrawer("单个发布", `/publish/singlePublish?id=${row?.postid}`)
      break
    case "batch":
      goToPublisherDrawer("批量发布", `/publish/batchPublish?id=${row?.postid}`)
      break
    case "view":
      goToBlogDrawer("文章预览", `/post/${row?.postid}`)
      break
    case "picgo": {
      const pageId = row?.postid
      if (isInSiyuanOrSiyuanNewWin()) {
        goToPicgoDrawer("图床", `/?pageId=${pageId}`)
      } else {
        goToPicgoNewWin(`/?pageId=${pageId}`)
      }
      break
    }
    case "platform-single":
      goToPublisherDrawer(
        "常规发布",
        `/publish/singlePublish/doPublish/${action.platformKey}/${row?.postid}?method=edit`
      )
      break
    case "widget-empty": {
      const pageId = await getSiyuanPageId()
      goToPublisherDrawer("单个发布", `/publish/singlePublish?id=${pageId}`)
      break
    }
  }
}

const initPage = async () => {
  isPicgoInstalled.value = await PluginUtils.preCheckPicgoPlugin()
  isBlogInstalled.value = await PluginUtils.preCheckBlogPlugin()
}

onBeforeMount(async () => {
  await initPage()
})
</script>

<template>
  <div class="admin-box">
    <!-- 文章列表：共用层组件（V1 薄封装） -->
    <ArticleManageList :enableView="isBlogInstalled" :enablePicgo="isPicgoInstalled" @action="handleAction" />

    <!-- 抽屉占位 -->
    <el-drawer v-model="showDrawer" size="85%" :title="drawerTitle" direction="rtl" :destroy-on-close="true">
      <DrawerBoxBridge :src="drawerSrc" />
    </el-drawer>
  </div>
</template>

<style lang="stylus" scoped>
.admin-box
  font-family var(--g-font-family)
  padding 0 10px
</style>
