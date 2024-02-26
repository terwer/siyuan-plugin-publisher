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
import MaterialSymbolsCreditCard from "~icons/material-symbols/credit-card"
import MaterialSymbolsAddPhotoAlternateOutline from "~icons/material-symbols/add-photo-alternate-outline"

// uses
const { t } = useVueI18n()
const { kernelApi, blogApi } = useSiyuanApi()
const { isInSiyuanWidget } = useSiyuanDevice()

// vars
const logger = createAppLogger("admin")
const isDataBoxLoading = ref(false)
const dataLayout = ref("prev,pager,next")

const showHome = ref(true)
const showDetail = ref(false)
const showPublish = ref(false)
const showAnki = ref(false)
const showPicgo = ref(false)

const postDetail = ref()
const publishData = ref()
const isInSiyuanEnv = ref(false)
const isNewWin = ref(true)

const state = ref("")
const links = ref([])

const tableData = []
const MAX_PAGE_SIZE = 5
const num = ref(0)
const total = ref(0)
const currentPage = ref(1)

// methods
const initPage = async () => {
  // isInSiyuanEnv.value = isInSiyuanWidget()
  //
  // const publishCfg = getPublishCfg()
  // isNewWin.value = parseBoolean(publishCfg.newWin)

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
    if (StrUtil.isEmptyString(pageId)) {
      postCount = await blogApi.getRecentPostsCount(state.value)
      postList = await blogApi.getRecentPosts(MAX_PAGE_SIZE, currentPage.value - 1, state.value)
      logger.warn("无法获取页面ID，可能是浏览器环境或者浏览器插件展示文档列表")
      logger.debug("postList=>", postList)
    } else {
      // 检测子文档
      postCount = await kernelApi.getSubdocCount(pageId)
      if (postCount > 0) {
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
      }
      logger.warn("思源笔记内部展示子文档")
    }

    // =======================================================================

    // 总数
    total.value = postCount

    // 渲染table
    tableData.splice(0, tableData.length)
    for (let i = 0; i < postList.length; i++) {
      const item = postList[i]

      let title = item.title
      const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()
      const pref = getReadOnlyPublishPreferenceSetting()
      if (pref.value.fixTitle) {
        title = HtmlUtil.removeTitleNumber(title).replace(/\.md/g, "")
      }
      const shortTitle = StrUtil.getByLength(title, MAX_TITLE_LENGTH, false)
      const content = LuteUtil.mdToHtml(item.description)

      const tableRow = {
        postid: item.postid,
        title,
        shortTitle,
        dateCreated: DateUtil.formatIsoToZhDate(item.dateCreated.toISOString(), true),
        mt_keywords: item.mt_keywords,
        description: content.trim() === "" ? "暂无内容" : content,
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
    <div id="post-list" v-if="showHome">
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
              <el-tooltip
                :content="$t('siyuan.browser.menu.publish.btn')"
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                  <MaterialSymbolsDriveFolderUpload />
                  &nbsp;发布
                </el-button>
              </el-tooltip>

              <!-- 预览 -->
              <el-tooltip
                :content="$t('siyuan.browser.menu.preview.btn')"
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
                <el-button size="small" @click="handleView(scope.$index, scope.row)">
                  <Fa6SolidBookOpenReader />
                  &nbsp;预览
                </el-button>
              </el-tooltip>

              <!-- picgo -->
              <el-tooltip
                :content="$t('siyuan.browser.menu.picture.btn')"
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
                <el-button size="small" @click="handlePicgo(scope.$index, scope.row)">
                  <MaterialSymbolsAddPhotoAlternateOutline />
                  &nbsp;图床
                </el-button>
              </el-tooltip>
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
          :title="isInSiyuanEnv ? $t('blog.top-data-tip.siyuan') : $t('blog.top-data-tip')"
          type="info"
          :closable="false"
        />
      </div>
    </div>

    <!-- 文章详情 -->
    <div id="post-detail" v-if="showDetail">
      <single-blog-detail :post="postDetail" @on-change="emitBackFn" @on-publish-change="emitPublishPageFn" />
    </div>

    <!-- 文章发布 -->
    <div id="post-publisher" v-if="showPublish">
      <single-publish :publish-data="publishData" @on-change="emitBackFn" />
    </div>

    <!-- Anki -->
    <div class="post-anki" v-if="showAnki">
      <single-anki :post="postDetail" @on-change="emitBackFn" />
    </div>

    <!-- Picgo -->
    <div class="post-picgo" v-if="showPicgo">
      <single-picgo :post="postDetail" @on-change="emitBackFn" />
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
