<template>
  <div>
    <div id="post-list" v-if="!showDetail">
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
        <el-table-column prop="title" label="标题"/>
        <!--
        <el-table-column prop="dateCreated" label="发布时间" width="150"/>
        -->
        <el-table-column align="right" width="150">
          <template #header>
            <div style="text-align: center;">操作</div>
          </template>
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.$index, scope.row)">预览</el-button>
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">发布</el-button>
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

      <el-alert class="top-data-tip"
                title="温馨提示：1. 请保证思源笔记启动并且打开伺服，默认伺服地址：http://127.0.0.1:6806。2. 发布操作会打开新页面，此窗口将关闭。"
                type="info" :closable="false"/>
    </div>

    <div id="post-detail" v-else>
      <DefaultPostDetail :post="postDetail" @on-change="emitFn"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import logUtil from "../../../../lib/logUtil";
import {onMounted, ref} from "vue";
import {formatIsoToZhDate} from "../../../../lib/util";
import {API} from "../../../../lib/api";
import {API_TYPE_CONSTANTS} from "../../../../lib/constants/apiTypeConstants";
import {mdToHtml, removeTitleNumber} from "../../../../lib/htmlUtil";
import {goToPage} from "../../../../lib/chrome/ChromeUtil";
import {ElMessageBox} from "element-plus/es";
import {useI18n} from "vue-i18n";
import {getRootBlocksCount} from "../../../../lib/platform/siyuan/siYuanApi";
import DefaultPostDetail from "./DefaultPostDetail.vue";
import {Post} from "../../../../lib/common/post";

const {t} = useI18n()
const showDetail = ref(false)
const postDetail = ref()

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

  showDetail.value = true;
}

const emitFn = () => {
  showDetail.value = false;
  // console.log("emitFn");
}

const handleEdit = (index: number, row: any) => {
  goToPage("/service/index.html?id=" + row.postid)
  console.log(index, row)
}

const handleRowClick = (row: any, column: any, event: any) => {
  // goToPage("/service/index.html?id=aaa")
  // console.log("handleRowClick", row)
}

const initPage = async () => {
  await reloadTableData()
  logUtil.logInfo("Post init page=>", tableData)
}

const reloadTableData = async () => {
  const api = new API(API_TYPE_CONSTANTS.API_TYPE_SIYUAN)
  const postList = await api.getRecentPosts(MAX_PAGE_SIZE, currentPage.value - 1, state.value)
  // console.log("postList=>", postList)

  // 总数
  total.value = await getRootBlocksCount(state.value)

  // 渲染table
  tableData.splice(0, tableData.length);
  for (let i = 0; i < postList.length; i++) {
    let item = postList[i]

    let title = removeTitleNumber(item.title)
    let shortTitle = title
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

/* 预览样式 */
.tb-preview-body {

}

.tb-preview-body img {
  max-width: 99%;
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