<template>
  <div>
    <div id="post-list" v-if="showHome">
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

      <el-table class="tb-data" :data="tableData" :key="num" border stripe highlight-current-row
                empty-text="笔记数据为空或者思源笔记未启动！"
                @row-click="handleRowClick" style="width: 100%;min-width: 600px;">
        <el-table-column type="expand">
          <template #default="props">
            <div m="4" style="padding-left: 10px;">
              <p m="t-0 b-2">ID: {{ props.row.postid }}</p>
              <p m="t-0 b-2">发布时间: {{ props.row.dateCreated }}</p>
              <p m="t-0 b-2">标题: {{ props.row.title }}</p>
              <p m="t-0 b-2">标签: {{ props.row.mt_keywords == "" ? "暂无标签" : props.row.mt_keywords }}</p>
            </div>
          </template>
        </el-table-column>
        <!--
        <el-table-column prop="postid" label="ID" width="200"/>
        -->
        <el-table-column prop="shortTitle" label="标题"/>
        <!--
        <el-table-column prop="dateCreated" label="发布时间" width="150"/>
        -->
        <el-table-column align="right" width="350">
          <template #header>
            <div style="text-align: center;">操作</div>
          </template>
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.$index, scope.row)">预览</el-button>
            <el-button size="small" type="primary" @click="handleNewWinView(scope.$index, scope.row)">新窗口预览
            </el-button>
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">发布</el-button>
            <el-button size="small" type="primary" @click="handleNewWinEdit(scope.$index, scope.row)">新窗口发布
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          small
          background
          layout="prev, pager, next"
          :total="total"
          class="mt-4"
          :page-size="MAX_PAGE_SIZE"
          @prev-click="handlePrevPage"
          @next-click="handleNextPage"
          @current-change="handleCurrentPage"
      />

      <div v-if="!isInSiyuan">
        <el-alert class="top-data-tip" :title="$t('blog.top-data-tip')" type="info" :closable="false"/>
      </div>
    </div>

    <div id="post-detail" v-if="showDetail">
      <DefaultPostDetail :post="postDetail" @on-change="emitFn" @on-publish-change="emitPublishPageFn"/>
    </div>

    <div id="post-publisher" v-if="showPublish">
      <default-publish :publish-data="publishData" @on-change="emitPublishBackFn"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import logUtil from "~/utils/logUtil";
import {onMounted, ref} from "vue";
import {formatIsoToZhDate} from "~/utils/util";
import {API} from "~/utils/api";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {mdToHtml, removeTitleNumber} from "~/utils/htmlUtil";
import {useI18n} from "vue-i18n";
import {getRootBlocksCount} from "~/utils/platform/siyuan/siYuanApi";
import {Post} from "~/utils/common/post";
import DefaultPostDetail from "./DefaultPostDetail.vue";
import DefaultPublish from "./DefaultPublish.vue";
import {goToPage} from "~/utils/browser/ChromeUtil";
import {ElMessageBox} from "element-plus";
import {getPageId, inSiyuan} from "~/utils/platform/siyuan/siyuanUtil";
import {getByLength} from "~/utils/strUtil";
import {SiYuanApiAdaptor} from "~/utils/platform/siyuan/siYuanApiAdaptor";
import {CONSTANTS} from "~/utils/constants/constants";

const {t} = useI18n()

const showHome = ref(true)
const showDetail = ref(false)
const showPublish = ref(false)
const postDetail = ref()
const publishData = ref()
const isInSiyuan = ref(false)

// search
interface LinkItem {
  value: string
  link: string
}

const state = ref('')
const links = ref<LinkItem[]>([])

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
      ? links.value.filter(createFilter(queryString))
      : links.value
  // call callback function to return suggestion objects
  cb(results)
}
const createFilter = (queryString: any) => {
  return (restaurant: any) => {
    return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item: LinkItem) => {
  console.log(item)
}

const handleBtnSearch = () => {
  console.log("handleBtnSearch")
  reloadTableData()
}
let tableData: Array<any> = []
const MAX_PAGE_SIZE = 5;
const num = ref(0)
const total = ref(0)
const currentPage = ref(1)

const handlePrevPage = async (curPage: number) => {
  currentPage.value = curPage;
  logUtil.logInfo("handlePrevPage, currentPage=>", currentPage.value)
  await reloadTableData();
}
const handleNextPage = async (curPage: number) => {
  currentPage.value = curPage;
  logUtil.logInfo("handleNextPage, currentPage=>", currentPage.value)
  await reloadTableData();
}
const handleCurrentPage = async (curPage: number) => {
  currentPage.value = curPage;
  logUtil.logInfo("handleCurrentPage, currentPage=>", currentPage.value)
  await reloadTableData();
}

const handleView = (index: number, row: any) => {
  // goToPage("/detail/index.html?id=" + row.postid)
  // ElMessageBox.confirm(
  //     "预览会打开新页面，此窗口将关闭，是否继续？",
  //     t('main.opt.warning'),
  //     {
  //       confirmButtonText: t('main.opt.ok'),
  //       cancelButtonText: t('main.opt.cancel'),
  //       type: 'warning',
  //     }
  // ).then(async () => {
  //   console.log(index, row)
  // }).catch(() => {
  //   // ElMessage({
  //   //   type: 'error',
  //   //   message: t("main.opt.failure"),
  //   // })
  //   logUtil.logInfo("操作已取消")
  // });
  const post = new Post();
  post.postid = row.postid
  post.title = row.title
  post.dateCreated = row.dateCreated
  post.mt_keywords = row.mt_keywords
  post.description = row.description
  postDetail.value = post

  showPublish.value = false;
  showHome.value = false;
  showDetail.value = true;
}
const handleNewWinView = (index: number, row: any) => {
  ElMessageBox.confirm(
      "预览会打开新页面，此窗口将关闭，是否继续？",
      t('main.opt.warning'),
      {
        confirmButtonText: t('main.opt.ok'),
        cancelButtonText: t('main.opt.cancel'),
        type: 'warning',
      }
  ).then(async () => {
    goToPage("/detail/index.html?id=" + row.postid)
    // console.log(index, row)
  }).catch(() => {
    // ElMessage({
    //   type: 'error',
    //   message: t("main.opt.failure"),
    // })
    logUtil.logInfo("操作已取消")
  });
}

const emitFn = () => {
  showPublish.value = false;
  showHome.value = true;
  showDetail.value = false;
  // console.log("emitFn");
}

const emitPublishBackFn = () => {
  emitFn()
}

const emitPublishPageFn = (post: Post) => {
  post.postid = post.postid
  post.title = post.title
  publishData.value = post

  showPublish.value = true;
  showHome.value = false;
  showDetail.value = false;
}

const handleEdit = (index: number, row: any) => {
  // goToPage("/index.html?id=" + row.postid)
  // console.log(index, row)
  const post = new Post();
  post.postid = row.postid
  post.title = row.title
  publishData.value = post

  showPublish.value = true;
  showHome.value = false;
  showDetail.value = false;
}

const handleNewWinEdit = (index: number, row: any) => {
  ElMessageBox.confirm(
      "此操作会打开新页面，此窗口将关闭，是否继续？",
      t('main.opt.warning'),
      {
        confirmButtonText: t('main.opt.ok'),
        cancelButtonText: t('main.opt.cancel'),
        type: 'warning',
      }
  ).then(async () => {
      goToPage("/publish/index.html?id=" + row.postid, "/")
      // console.log(index, row)
  }).catch(() => {
    // ElMessage({
    //   type: 'error',
    //   message: t("main.opt.failure"),
    // })
    logUtil.logInfo("操作已取消")
  });
}

const handleRowClick = (row: any, column: any, event: any) => {
  // goToPage("/index.html?id=aaa")
  // console.log("handleRowClick", row)
}

const initPage = async () => {
  isInSiyuan.value = await inSiyuan();
  await reloadTableData()
  // logUtil.logInfo("Post init page=>", tableData)
}

const reloadTableData = async () => {
  let postCount: number = 1
  let postList: Array<Post> = []
  let hasSubdoc = false

  if (isInSiyuan.value) {
    const postid = await getPageId()

    const siyuanApi = new SiYuanApiAdaptor()
    postCount = await siyuanApi.getSubPostCount(postid)
    if (postCount > 1) {
      hasSubdoc = true
    }

    if (hasSubdoc) {
      postList = await siyuanApi.getSubPosts(postid, MAX_PAGE_SIZE, currentPage.value - 1, state.value)
    }
  } else {
    const api = new API(API_TYPE_CONSTANTS.API_TYPE_SIYUAN)
    postCount = await getRootBlocksCount(state.value)
    postList = await api.getRecentPosts(MAX_PAGE_SIZE, currentPage.value - 1, state.value)
    // console.log("postList=>", postList)
  }

  // =======================================================================

  // 总数
  total.value = postCount

  // 渲染table
  tableData.splice(0, tableData.length);
  for (let i = 0; i < postList.length; i++) {
    let item = postList[i]

    let title = removeTitleNumber(item.title)
    let shortTitle = getByLength(title, CONSTANTS.MAX_TITLE_LENGTH, false)
    let content = mdToHtml(item.description)

    const tableRow = {
      postid: item.postid,
      title: title,
      shortTitle: shortTitle,
      dateCreated: formatIsoToZhDate(item.dateCreated.toISOString(), true, true),
      mt_keywords: item.mt_keywords,
      description: content.trim() == "" ? "暂无内容" : content
    }
    tableData.push(tableRow)
  }

  // table的key改变才会刷新
  num.value++;
}

onMounted(async () => {
  await initPage()
})
</script>

<script lang="ts">
export default {
  name: "DefaultMain"
}
</script>

<style>
.s-input {
  min-width: 500px !important;
}
</style>
<style scoped>
.top-data-tip {
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
</style>