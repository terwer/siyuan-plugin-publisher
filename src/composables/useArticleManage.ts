/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { computed, reactive } from "vue"
import { DateUtil, HtmlUtil, JsonUtil, StrUtil } from "zhi-common"
import { useNotebookOptions, NotebookOption } from "~/src/composables/useNotebookOptions.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { LuteUtil } from "~/src/utils/luteUtil.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { getDynCfgByKey, DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { Utils } from "~/src/utils/utils.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { getSiyuanPageId } from "~/src/utils/siyuanUtils.ts"
import { DYNAMIC_CONFIG_KEY, MAX_TITLE_LENGTH } from "~/src/utils/constants.ts"

/**
 * 文章管理某一行（供共享组件渲染）。
 *
 * @public
 */
export interface ArticleManageRow {
  postid: string
  title: string
  shortTitle: string
  content: string
  shortDesc: string
  dateCreated: string
  mt_keywords?: string
  isShared: boolean
  yamlCount: number
  yamlAttrs: Record<string, string>
  dynCfgs: Record<string, DynamicConfig>
}

/**
 * 共享组件抛出的导航动作。
 *
 * @public
 */
export type ArticleManageActionType =
  | "quick"
  | "single"
  | "batch"
  | "view"
  | "picgo"
  | "platform-single"
  | "widget-empty"

export interface ArticleManageAction {
  type: ArticleManageActionType
  row?: ArticleManageRow
  platformKey?: string
}

const MAX_PAGE_SIZE = 8

/**
 * 无 router 依赖的文章管理组合式函数。
 *
 * 数据获取（含 notebookIds 过滤）、分页、搜索、已发布、展开行、yaml 徽标、
 * 发布源笔记本多选（初值取偏好、变更持久化并刷新）。
 * 所有导航动作以事件抛出，不含 router/iframe。
 *
 * V1 `Admin.vue` 与 V2 管理视图均为薄封装，共用此组合式函数。
 *
 * @public
 */
export const useArticleManage = () => {
  const logger = createAppLogger("use-article-manage")
  const { blogApi, kernelApi } = useSiyuanApi()
  const { isInSiyuanWidget } = useSiyuanDevice()
  const { options: notebookOptions, load: loadNotebookOptions } = useNotebookOptions()
  const { getPublishPreferenceSetting } = usePreferenceSettingStore()
  const { getSetting } = usePublishSettingStore()
  const pref = getPublishPreferenceSetting()

  const state = reactive({
    isLoading: false,
    mode: "list" as "list" | "widget",
    pageId: "",
    hasSubdoc: false,
    keyword: "",
    showPublished: false,
    currentPage: 1,
    pageSize: MAX_PAGE_SIZE,
    total: 0,
    rows: [] as ArticleManageRow[],
    selectedNotebookIds: [] as string[],
    notebookOptions: [] as NotebookOption[],
    dynamicConfigArray: [] as DynamicConfig[],
  })

  const createRow = (post: any, dynamicConfigArray: DynamicConfig[]): ArticleManageRow => {
    let title = post.title
    if (pref.value.fixTitle) {
      title = HtmlUtil.removeTitleNumber(title).replace(/\.md/g, "")
    }
    const shortTitle = StrUtil.getByLength(title, MAX_TITLE_LENGTH, false)
    const content = LuteUtil.mdToHtml(post.description)
    const shortDesc = post?.shortDesc
    const attrs = JsonUtil.safeParse(post.attrs, {})
    const isPublished = attrs["custom-publish-status"] === "publish"
    const isExpired = attrs["custom-expires"] && attrs["custom-expires"] - Date.now() < 0
    const yamlAttrs: Record<string, string> = {}
    const dynCfgs: Record<string, DynamicConfig> = {}
    return {
      postid: post.postid,
      title,
      shortTitle,
      content,
      shortDesc: Utils.emptyOrDefault(shortDesc, "暂无内容"),
      dateCreated: DateUtil.formatIsoToZhDate(post.dateCreated.toISOString(), true),
      mt_keywords: post.mt_keywords,
      isShared: isPublished && !isExpired,
      yamlCount: Object.keys(yamlAttrs).length,
      yamlAttrs,
      dynCfgs,
    }
  }

  const enrichYaml = (row: ArticleManageRow, pageAttrs: Record<string, string>, dynamicConfigArray: DynamicConfig[]) => {
    const yamlAttrs: Record<string, string> = {}
    const dynCfgs: Record<string, DynamicConfig> = {}
    for (const key of Object.keys(pageAttrs)) {
      if (!key.startsWith("custom-")) {
        continue
      }
      if (!key.endsWith("-yaml")) {
        continue
      }
      const newKey = key.replace("-yaml", "").replace("custom-", "").replace("-", "_")
      yamlAttrs[newKey] = pageAttrs[key]
      dynCfgs[newKey] = getDynCfgByKey(dynamicConfigArray, newKey)
    }
    row.yamlCount = Object.keys(yamlAttrs).length
    row.yamlAttrs = yamlAttrs
    row.dynCfgs = dynCfgs
  }

  const loadNotebooks = async () => {
    state.selectedNotebookIds = Array.isArray(pref.value.publishSourceNotebooks)
      ? [...(pref.value.publishSourceNotebooks ?? [])]
      : []
    await loadNotebookOptions()
    state.notebookOptions = notebookOptions.value.map((item) => ({ ...item }))
  }

  const loadData = async () => {
    state.isLoading = true
    try {
      let postCount = 1
      let postList: any[] = []

      const setting = await getSetting()
      const dynJsonCfg = JsonUtil.safeParse<{ totalCfg?: DynamicConfig[] }>(setting[DYNAMIC_CONFIG_KEY], {})
      const dynamicConfigArray = dynJsonCfg?.totalCfg || []
      state.dynamicConfigArray = dynamicConfigArray

      const pageId = await getSiyuanPageId()
      if (isInSiyuanWidget() && !StrUtil.isEmptyString(pageId)) {
        state.mode = "widget"
        state.pageId = pageId
        postCount = await kernelApi.getSubdocCount(pageId, state.showPublished, state.selectedNotebookIds)
        state.hasSubdoc = postCount > 1
        if (state.hasSubdoc) {
          const subdocInfoList = await kernelApi.getSubdocs(
            pageId,
            state.currentPage - 1,
            state.pageSize,
            state.keyword,
            state.showPublished,
            state.selectedNotebookIds
          )
          for (let i = 0; i < subdocInfoList.length; i++) {
            const postId = subdocInfoList[i].root_id
            const post = await blogApi.getPost(postId)
            postList.push(post)
          }
        }
      } else {
        state.mode = "list"
        state.pageId = ""
        state.hasSubdoc = false
        postCount = await blogApi.getRecentPostsCount(state.keyword, state.showPublished, state.selectedNotebookIds)
        postList = await blogApi.getRecentPosts(
          state.pageSize,
          state.currentPage - 1,
          state.keyword,
          state.showPublished,
          state.selectedNotebookIds
        )
      }

      state.total = postCount
      const rows = postList.map((post) => createRow(post, dynamicConfigArray)).filter((r) => r.postid)
      for (const row of rows) {
        try {
          const pageAttrs = await kernelApi.getBlockAttrs(row.postid)
          enrichYaml(row, pageAttrs, dynamicConfigArray)
        } catch (e) {
          logger.warn(`getBlockAttrs failed for ${row.postid}=>`, e)
        }
      }
      state.rows = rows
    } catch (e) {
      logger.error("load article manage data failed=>", e)
      state.total = 0
      state.rows = []
    } finally {
      state.isLoading = false
    }
  }

  const reload = async () => {
    await loadNotebooks()
    await loadData()
  }

  const setKeyword = (value: string) => {
    state.keyword = value
    state.currentPage = 1
  }

  const setShowPublished = (value: boolean) => {
    state.showPublished = value
    state.currentPage = 1
  }

  const setPage = async (page: number) => {
    state.currentPage = Math.max(1, page)
    await loadData()
  }

  const setNotebooks = async (ids: string[]) => {
    state.selectedNotebookIds = [...ids]
    state.currentPage = 1
    pref.value.publishSourceNotebooks = [...ids]
    await loadData()
  }

  const isWidgetEmpty = computed(() => state.mode === "widget" && !state.hasSubdoc && !state.isLoading)

  return {
    state,
    isWidgetEmpty,
    reload,
    loadData,
    loadNotebooks,
    setKeyword,
    setShowPublished,
    setPage,
    setNotebooks,
  }
}
