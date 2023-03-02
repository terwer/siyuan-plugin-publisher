<!--
  - Copyright (c) 2022-2023, Terwer . All rights reserved.
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

<template>
  <div>
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
        <el-button class="s-btn" type="primary" @click="handleBtnSearch"
          >搜索
        </el-button>
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
                  {{
                    props.row.mt_keywords === ""
                      ? "暂无标签"
                      : props.row.mt_keywords
                  }}
                </p>
              </div>
            </template>
          </el-table-column>
          <!--
          <el-table-column prop="postid" label="ID" width="200"/>
          -->
          <el-table-column prop="shortTitle" label="标题" />
          <!--
          <el-table-column prop="dateCreated" label="发布时间" width="150"/>
          -->
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
                <el-button
                  size="small"
                  @click="handleEdit(scope.$index, scope.row)"
                >
                  <font-awesome-icon icon="fa-solid fa-upload" />
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
                <el-button
                  size="small"
                  @click="handleView(scope.$index, scope.row)"
                >
                  <font-awesome-icon icon="fa-solid fa-book-open-reader" />
                </el-button>
              </el-tooltip>

              <!-- anki -->
              <el-tooltip
                :content="$t('siyuan.browser.menu.anki.btn')"
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
                <el-button
                  size="small"
                  @click="handleAnki(scope.$index, scope.row)"
                >
                  <font-awesome-icon icon="fa-solid fa-credit-card" />
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
                <el-button
                  size="small"
                  @click="handlePicgo(scope.$index, scope.row)"
                >
                  <font-awesome-icon icon="fa-solid fa-image" />
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
          :title="
            isInSiyuanEnv
              ? $t('blog.top-data-tip.siyuan')
              : $t('blog.top-data-tip')
          "
          type="info"
          :closable="false"
        />
      </div>
    </div>

    <!-- 文章详情 -->
    <div id="post-detail" v-if="showDetail">
      <single-blog-detail
        :post="postDetail"
        @on-change="emitBackFn"
        @on-publish-change="emitPublishPageFn"
      />
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

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { onMounted, ref, toRaw } from "vue";
import { LogFactory } from "~/utils/logUtil";
import { Post } from "~/utils/models/post";
import { goToPage } from "~/utils/otherlib/ChromeUtil";
import { getPageId, isInSiyuanWidget } from "~/utils/platform/siyuan/siyuanUtil";
import { SiYuanApiAdaptor } from "~/utils/platform/siyuan/siYuanApiAdaptor";
import { mdToHtml, removeTitleNumber } from "~/utils/htmlUtil";
import { getByLength } from "~/utils/strUtil";
import { CONSTANTS } from "~/utils/constants/constants";
import { formatIsoToZhDate } from "~/utils/dateUtil";
import { ElMessage, ElMessageBox } from "element-plus";
import SingleBlogDetail from "~/components/blog/singleWin/SingleBlogDetail.vue";
import SinglePublish from "~/components/blog/singleWin/singlePublish.vue";
import { getPublishCfg } from "~/utils/publishUtil";
import { isEmptyString, parseBoolean } from "~/utils/util";
import { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil";
import SingleAnki from "~/components/blog/singleWin/SingleAnki.vue";
import SinglePicgo from "~/components/blog/singleWin/SinglePicgo.vue";

const logger = LogFactory.getLogger()
const { t } = useI18n()
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

const querySearch = (queryString, cb) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value
  cb(results)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item) => {}

const handleBtnSearch = () => {
  reloadTableData()
}
const tableData = []
const MAX_PAGE_SIZE = 5
const num = ref(0)
const total = ref(0)
const currentPage = ref(1)

const handlePrevPage = async (curPage) => {
  currentPage.value = curPage
  await reloadTableData()
}
const handleNextPage = async (curPage) => {
  currentPage.value = curPage
  await reloadTableData()
}
const handleCurrentPage = async (curPage) => {
  currentPage.value = curPage
  await reloadTableData()
}

const handleView = (index, row) => {
  if (isNewWin.value) {
    handleNewWinView(index, row)
  } else {
    const post = new Post()
    post.postid = row.postid
    post.title = row.title
    post.dateCreated = row.dateCreated
    post.mt_keywords = row.mt_keywords
    post.description = row.description
    postDetail.value = post

    showPublish.value = false
    showHome.value = false
    showAnki.value = false
    showPicgo.value = false
    showDetail.value = true
  }
}
const handleNewWinView = (index, row) => {
  ElMessageBox.confirm(
    "预览会打开新页面，此窗口将关闭，是否继续？",
    t("main.opt.warning"),
    {
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
      type: "warning",
    }
  )
    .then(async () => {
      goToPage("/detail/index.html?id=" + row.postid)
      // console.log(index, row)
    })
    .catch(() => {
      // ElMessage({
      //   type: 'error',
      //   message: t("main.opt.failure"),
      // })
    })
}

const emitFn = () => {
  showPublish.value = false
  showHome.value = true
  showDetail.value = false
  showAnki.value = false
  showPicgo.value = false
  // console.log("emitFn");
}

const emitBackFn = () => {
  emitFn()
}

const emitPublishPageFn = (post) => {
  publishData.value = post

  showPublish.value = true
  showHome.value = false
  showDetail.value = false
  showAnki.value = false
  showPicgo.value = false
}

const handleEdit = (index, row) => {
  if (isNewWin.value) {
    handleNewWinEdit(index, row);
  } else {
    const post = new Post();
    post.postid = row.postid;
    post.title = row.title;
    publishData.value = post;

    showPublish.value = true;
    showHome.value = false;
    showDetail.value = false
    showAnki.value = false
    showPicgo.value = false
  }
}
const handleNewWinEdit = (index, row) => {
  ElMessageBox.confirm(
    "此操作会打开新页面，此窗口将关闭，是否继续？",
    t("main.opt.warning"),
    {
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
      type: "warning",
    }
  )
    .then(async () => {
      goToPage("/publish/index.html?id=" + row.postid)
      // console.log(index, row)
    })
    .catch(() => {
      // ElMessage({
      //   type: 'error',
      //   message: t("main.opt.failure"),
      // })
    })
}

const handleRowClick = (row, column, event) => {
  // goToPage("/index.html?id=aaa")
  // console.log("handleRowClick", row)
}

const handleAnki = (index, row) => {
  if (isNewWin.value) {
    handleNewWinAnki(index, row)
  } else {
    const post = new Post()
    post.postid = row.postid
    post.title = row.title
    post.dateCreated = row.dateCreated
    post.mt_keywords = row.mt_keywords
    post.description = row.description
    postDetail.value = post

    showPublish.value = false
    showHome.value = false
    showPicgo.value = false
    showDetail.value = false
    showAnki.value = true
  }
}
const handleNewWinAnki = (index, row) => {
  ElMessageBox.confirm(
    "此操作会打开新页面，此窗口将关闭，是否继续？",
    t("main.opt.warning"),
    {
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
      type: "warning",
    }
  )
    .then(async () => {
      goToPage("/anki/index.html?id=" + row.postid)
      // console.log(index, row)
    })
    .catch(() => {
      // ElMessage({
      //   type: 'error',
      //   message: t("main.opt.failure"),
      // })
    })
}

const handlePicgo = (index, row) => {
  if (isNewWin.value) {
    handleNewWinPicgo(index, row)
  } else {
    const post = new Post()
    post.postid = row.postid
    post.title = row.title
    post.dateCreated = row.dateCreated
    post.mt_keywords = row.mt_keywords
    post.description = row.description
    postDetail.value = post

    showPublish.value = false
    showHome.value = false
    showAnki.value = false
    showDetail.value = false
    showPicgo.value = true
  }
}
const handleNewWinPicgo = (index, row) => {
  ElMessageBox.confirm(
    "此操作会打开新页面，此窗口将关闭，是否继续？",
    t("main.opt.warning"),
    {
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
      type: "warning",
    }
  )
    .then(async () => {
      goToPage("/picgo/index.html?id=" + row.postid)
      // console.log(index, row)
    })
    .catch(() => {
      // ElMessage({
      //   type: 'error',
      //   message: t("main.opt.failure"),
      // })
    })
}

const initPage = async () => {
  isInSiyuanEnv.value = isInSiyuanWidget()

  const publishCfg = getPublishCfg()
  isNewWin.value = parseBoolean(publishCfg.newWin)

  await reloadTableData()
  // logUtil.logInfo("Post init page=>", tableData)
}

const reloadTableData = async () => {
  isDataBoxLoading.value = true

  let postCount = 1
  let postList = []
  let hasSubdoc = false

  try {
    const siyuanApi = new SiYuanApiAdaptor()
    if (isInSiyuanEnv.value || isInSiyuanNewWinBrowser()) {
      const postid = await getPageId()
      logger.warn("处于生产环境，父文档ID为=>", postid)

      if (!isEmptyString(postid)) {
        // 检测子文档
        postCount = await siyuanApi.getSubPostCount(postid)
        if (postCount > 1) {
          hasSubdoc = true
        }

        if (hasSubdoc) {
          postList = await siyuanApi.getSubPosts(
            postid,
            MAX_PAGE_SIZE,
            currentPage.value - 1,
            state.value
          )
        }
        logger.warn("思源笔记内部展示子文档")
      } else {
        postCount = await siyuanApi.getRecentPostsCount(state.value)
        postList = await siyuanApi.getRecentPosts(
          MAX_PAGE_SIZE,
          currentPage.value - 1,
          state.value
        )
        logger.warn("思源笔记内部展示文档列表")
      }
    } else {
      postCount = await siyuanApi.getRecentPostsCount(state.value)
      postList = await siyuanApi.getRecentPosts(
        MAX_PAGE_SIZE,
        currentPage.value - 1,
        state.value
      )
      logger.warn("浏览器环境或者浏览器插件展示文档列表")
      logger.debug("postList=>", postList)
    }

    // =======================================================================

    // 总数
    total.value = postCount

    // 渲染table
    tableData.splice(0, tableData.length)
    for (let i = 0; i < postList.length; i++) {
      const item = postList[i]

      const title = removeTitleNumber(item.title)
      const shortTitle = getByLength(title, CONSTANTS.MAX_TITLE_LENGTH, false)
      const content = mdToHtml(item.description)

      const tableRow = {
        postid: item.postid,
        title,
        shortTitle,
        dateCreated: formatIsoToZhDate(
          item.dateCreated.toISOString(),
          true,
          true
        ),
        mt_keywords: item.mt_keywords,
        description: content.trim() === "" ? "暂无内容" : content,
      }
      tableData.push(tableRow)
    }
  } catch (e) {
    isDataBoxLoading.value = false
    ElMessage.error("数据加载失败，=>" + e)
  }

  // table的key改变才会刷新
  num.value++

  isDataBoxLoading.value = false
}

onMounted(async () => {
  await initPage()
})
</script>

<style>
.s-input {
  min-width: 400px !important;
}
</style>
<style scoped>
#post-list {
  margin-top: 20px;
}

.top-data-tip {
  margin-top: 32px !important;
  margin-bottom: 10px;
  padding-left: 4px;
}

/* search */
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}

.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}

.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}

.my-autocomplete li .highlighted .addr {
  color: #ddd;
}

.s-btn {
  margin-left: 20px;
}

/* table */
.tb-data {
  margin-top: 10px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
  justify-content: center;
}

.data-empty-box {
  margin: 16px 0;
}
</style>
