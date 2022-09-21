<template>
  <div>
    <el-alert class="top-data-tip" :title="$t('blog.list.toptip')" type="info" :closable="false" v-if="false"/>

    <el-table class="tb-data" :data="tableData" :key="num" border stripe highlight-current-row
              @row-click="handleRowClick" style="width: 100%;min-width: 600px;">
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
        :total="num"
        class="mt-4"
    />
  </div>
</template>

<script lang="ts" setup>
import logUtil from "../../../../lib/logUtil";
import {onMounted, ref} from "vue";
import {formatIsoToZhDate} from "../../../../lib/util";
import {API} from "../../../../lib/api";
import {API_TYPE_CONSTANTS} from "../../../../lib/constants/apiTypeConstants";
import {removeTitleNumber} from "../../../../lib/htmlUtil";
import {goToPage} from "../../../../lib/chrome/ChromeUtil";

const tableData: Array<any> = []
const num = ref(0)

const search = ref('')
const filterTableData = () => {
  console.log("filterTableData")
}

const handleView = (index: number, row: any) => {
  // goToPage("/detail/index.html?id=" + row.postid)
  console.log(index, row)
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
  const api = new API(API_TYPE_CONSTANTS.API_TYPE_SIYUAN)
  const postList = await api.getRecentPosts(5, 0)
  console.log("postList=>", postList)

  // 渲染table
  for (let i = 0; i < postList.length; i++) {
    let item = postList[i]

    let title = removeTitleNumber(item.title)
    let shortTitle = title
    const tableRow = {
      postid: item.postid,
      title: title,
      shortTitle: shortTitle,
      dateCreated: formatIsoToZhDate(item.dateCreated.toISOString(), true, true)
    }
    tableData.push(tableRow)
  }
  num.value = tableData.length + 100

  logUtil.logInfo("Post init page=>", tableData)
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

<style scoped>
.top-data-tip {
  margin-bottom: 10px;
}

.tb-data {
  margin-top: 10px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
  justify-content: center;
}
</style>