<template>
  <div>
    <el-alert class="top-data-tip" :title="$t('blog.list.toptip')" type="info" :closable="false"/>

    <el-table :data="tableData" :key="num" border stripe highlight-current-row
              @row-click="handleRowClick" style="width: 100%;min-width: 600px;">
      <el-table-column prop="postid" label="ID" width="150"/>
      <el-table-column prop="title" label="标题"/>
      <el-table-column prop="dateCreated" label="发布时间" width="150"/>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import logUtil from "../../../../lib/logUtil";
import {onMounted, reactive, ref} from "vue";
import {Post} from "../../../../lib/common/post";
import {formatIsoToZhDate} from "../../../../lib/util";

const tableData: Array<any> = []
const num = ref(0)

const handleRowClick = (row: any, column: any, event: any) => {
  console.log("handleRowClick", row)
}

const initPage = async () => {
  let postList = [
    new Post()
  ]

  // 渲染table
  for (let i = 0; i < postList.length; i++) {
    let item = postList[i]
    const tableRow = {
      postid: item.postid,
      title: item.title,
      titleShort: item.title,
      dateCreated: formatIsoToZhDate(item.dateCreated.toISOString(), true, true)
    }
    tableData.push(tableRow)
  }
  num.value = tableData.length

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

.el-main {
  padding-top: 0;
}
</style>