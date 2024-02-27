<!--
  - Copyright (c) 2024, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ElMessage } from "element-plus"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { getSiyuanPageId } from "~/src/utils/siyuanUtils.ts"
import { DateUtil, HtmlUtil, StrUtil } from "zhi-common"
import { LuteUtil } from "~/src/utils/luteUtil.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { MAX_TITLE_LENGTH } from "~/src/utils/constants.ts"
import MaterialSymbolsDriveFolderUpload from "~icons/material-symbols/drive-folder-upload"
import Fa6SolidBookOpenReader from "~icons/fa6-solid/book-open-reader"
import MaterialSymbolsAddPhotoAlternateOutline from "~icons/material-symbols/add-photo-alternate-outline"
import { Utils } from "~/src/utils/utils.ts"
import { useRouter } from "vue-router"
import { PluginUtils } from "~/src/utils/pluginUtils.ts"

// uses
const { t } = useVueI18n()
const { kernelApi, blogApi } = useSiyuanApi()
const { isInSiyuanWidget } = useSiyuanDevice()
const router = useRouter()
const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()

// vars
const logger = createAppLogger("admin")
const isDataBoxLoading = ref(false)
const dataLayout = ref("prev,pager,next")

const state = ref("")
const links = ref([])

const tableData = []
const MAX_PAGE_SIZE = 5
const num = ref(0)
const total = ref(0)
const currentPage = ref(1)

const isPicgoInstalled = ref(false)
const isBlogInstalled = ref(false)

// methods
const querySearch = (queryString: string, cb: any) => {
  const results = queryString ? links.value.filter(createFilter(queryString)) : links.value
  cb(results)
}
const createFilter = (queryString: string) => {
  return (value: any) => {
    return value.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const handleSelect = (item: any) => {}

const handleBtnSearch = () => {
  reloadTableData()
}

const handlePrevPage = async (curPage: number) => {
  currentPage.value = curPage
  await reloadTableData()
}
const handleNextPage = async (curPage: number) => {
  currentPage.value = curPage
  await reloadTableData()
}
const handleCurrentPage = async (curPage: number) => {
  currentPage.value = curPage
  await reloadTableData()
}

const handleView = (index: number, row: any) => {
  handleNewWinView(index, row)
}

const handleNewWinView = async (index: number, row: any) => {
  alert("blog plugin is not installed")

  // 阻止事件冒泡
  const win = window as any
  win.event.stopPropagation()
}

const handleEdit = (index: number, row: any) => {
  handleNewWinEdit(index, row)
}

const handleNewWinEdit = async (index: number, row: any) => {
  await router.push({
    path: "/publish/singlePublish",
    query: {
      id: row.postid,
      showBack: "true",
    },
  })
}

const handleRowClick = async (row: any, column: any, event: any) => {
  handleEdit(column.index, row)
  // console.log("handleRowClick", row)
}

const handlePicgo = (index: number, row: any) => {
  handleNewWinPicgo(index, row)
}

const handleNewWinPicgo = (index: number, row: any) => {
  alert("picgo is not installed")

  // 阻止事件冒泡
  const win = window as any
  win.event.stopPropagation()
}

const initPage = async () => {
  isPicgoInstalled.value = await PluginUtils.preCheckPicgoPlugin()
  isBlogInstalled.value = await PluginUtils.preCheckBlogPlugin()

  await reloadTableData()
  logger.debug("Post init page=>", tableData)
}

const reloadTableData = async () => {
  isDataBoxLoading.value = true

  let postCount = 1
  let postList = []
  let hasSubdoc = false

  try {
    const pageId = await getSiyuanPageId()
    // 挂件里面才展示子文档
    if (isInSiyuanWidget() && !StrUtil.isEmptyString(pageId)) {
      // 检测子文档
      postCount = await kernelApi.getSubdocCount(pageId)
      if (postCount > 1) {
        hasSubdoc = true
      }

      if (hasSubdoc) {
        const subdocInfoList = await kernelApi.getSubdocs(pageId, currentPage.value - 1, MAX_PAGE_SIZE, state.value)
        for (let i = 0; i < subdocInfoList.length; i++) {
          const subdocInfo = subdocInfoList[i]
          const postId = subdocInfo.root_id
          const post = await blogApi.getPost(postId)
          postList.push(post)
        }
        logger.info("挂件模式，有子文档，展示子文档")
      } else {
        logger.info("挂件模式，没有子文档，直接显示发布页面")
        await router.push({
          path: "/publish/singlePublish",
          query: {
            id: pageId,
          },
        })
      }
    } else {
      postCount = await blogApi.getRecentPostsCount(state.value)
      postList = await blogApi.getRecentPosts(MAX_PAGE_SIZE, currentPage.value - 1, state.value)
      logger.warn("无法获取页面ID，可能是浏览器环境或者浏览器插件展示文档列表")
    }

    // =======================================================================

    // 总数
    total.value = postCount

    // 渲染table
    tableData.splice(0, tableData.length)
    for (let i = 0; i < postList.length; i++) {
      const item = postList[i]

      let title = item.title
      const pref = getReadOnlyPublishPreferenceSetting()
      if (pref.value.fixTitle) {
        title = HtmlUtil.removeTitleNumber(title).replace(/\.md/g, "")
      }
      const shortTitle = StrUtil.getByLength(title, MAX_TITLE_LENGTH, false)
      const content = LuteUtil.mdToHtml(item.description)
      const shortDesc = item?.shortDesc

      const tableRow = {
        postid: item.postid,
        title,
        shortTitle,
        dateCreated: DateUtil.formatIsoToZhDate(item.dateCreated.toISOString(), true),
        mt_keywords: item.mt_keywords,
        description: Utils.emptyOrDefault(content, "暂无内容"),
        shortDesc: Utils.emptyOrDefault(shortDesc, "暂无内容"),
      }
      tableData.push(tableRow)
    }
  } catch (e) {
    logger.error(t("main.opt.failure") + "=>", e)
    ElMessage.error(t("main.opt.failure") + "=>" + e)
  } finally {
    isDataBoxLoading.value = false
  }

  // table的key改变才会刷新
  num.value++
}

onBeforeMount(async () => {
  await initPage()
})
</script>

<template>
  <div class="admin-box">
    <!-- 文章列表 -->
    <div id="post-list">
      <!-- 搜索 -->
      <div class="search-btn">
        <el-autocomplete
          class="s-input"
          v-model="state"
          :fetch-suggestions="querySearch"
          popper-class="my-autocomplete"
          placeholder="请输入关键字"
          @change="handleBtnSearch"
          @select="handleSelect"
        >
          <template #default="{ item }">
            <div class="value">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <el-button class="s-btn" type="primary" @click="handleBtnSearch">搜索</el-button>
      </div>

      <!-- 表格数据展示 -->
      <div class="data-empty-box" v-if="isDataBoxLoading">
        <el-skeleton :loading="isDataBoxLoading" :rows="5" animated />
      </div>
      <div class="data-box" v-else>
        <el-table
          class="tb-data"
          :data="tableData"
          :key="num"
          border
          stripe
          highlight-current-row
          empty-text="笔记数据为空或者思源笔记未启动！"
          @row-click="handleRowClick"
          style="width: 100%; min-width: 600px"
        >
          <el-table-column type="expand">
            <template #default="props">
              <div m="4" style="padding-left: 10px">
                <p m="t-0 b-2">ID: {{ props.row.postid }}</p>
                <p m="t-0 b-2">发布时间: {{ props.row.dateCreated }}</p>
                <p m="t-0 b-2">标题: {{ props.row.title }}</p>
                <p m="t-0 b-2">
                  标签:
                  {{ props.row.mt_keywords === "" ? "暂无标签" : props.row.mt_keywords }}
                </p>
                <p m="t-0 b-2">摘要: {{ props.row.shortDesc }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" />
          <el-table-column align="center" width="350">
            <template #header>
              <div style="text-align: center">操作</div>
            </template>
            <template #default="scope">
              <!-- 发布 -->
              <!--
              <el-tooltip
                :content="t('siyuan.browser.menu.publish.btn')"
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
              </el-tooltip>
              -->
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                <MaterialSymbolsDriveFolderUpload />
                &nbsp;发布
              </el-button>

              <!-- 预览 -->
              <!--
              <el-tooltip
                :content="t('siyuan.browser.menu.preview.btn')"
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
               </el-tooltip>
               -->
              <el-button size="small" @click="handleView(scope.$index, scope.row)" v-if="isBlogInstalled">
                <Fa6SolidBookOpenReader />
                &nbsp;详情
              </el-button>

              <!-- picgo -->
              <!--
              <el-tooltip
                :content="t('siyuan.browser.menu.picture.btn')"
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
              </el-tooltip>
              -->
              <el-button size="small" @click="handlePicgo(scope.$index, scope.row)" v-if="isPicgoInstalled">
                <MaterialSymbolsAddPhotoAlternateOutline />
                &nbsp;图床
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          small
          background
          :layout="dataLayout"
          :total="total"
          class="mt-4"
          :page-size="MAX_PAGE_SIZE"
          @prev-click="handlePrevPage"
          @next-click="handleNextPage"
          :current-page="currentPage"
          @current-change="handleCurrentPage"
        />
      </div>

      <!-- 操作指南 -->
      <div class="blog-tip">
        <el-alert
          class="top-data-tip"
          :title="isInSiyuanWidget() ? t('blog.top-data-tip.siyuan') : t('blog.top-data-tip')"
          type="info"
          :closable="false"
        />
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.admin-box
  font-family: var(--g-font-family)
  padding: 0 10px

:deep(.search-btn .s-input)
  min-width: 400px !important

#post-list
  margin-top: 20px

.top-data-tip
  margin-top: 32px !important
  margin-bottom: 10px
  padding-left: 4px

/* search */
.my-autocomplete li
  line-height: normal
  padding: 7px

  &.name
    text-overflow: ellipsis
    overflow: hidden

  &.addr
    font-size: 12px
    color: #b4b4b4

    &.highlighted
      color: #ddd

.s-btn
  margin-left: 20px

/* table */
.tb-data
  margin-top: 10px

.el-pagination
  text-align: center
  margin-top: 20px
  justify-content: center

.data-empty-box
  margin: 16px 0
</style>
