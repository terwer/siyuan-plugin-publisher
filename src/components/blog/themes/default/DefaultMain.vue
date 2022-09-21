<template>
  <div>
    <el-alert class="top-data-tip" :title="$t('blog.list.toptip')" type="info" :closable="false"/>

    <el-table :data="tableData" @row-click="handleRowClick" stripe border style="width: 100%;min-width: 600px;">
      <el-table-column prop="date" label="Date" width="150"/>
      <el-table-column prop="address" label="Address"/>
      <el-table-column prop="name" label="Name" width="150"/>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const handleRowClick = (row: any, column: any, event: any) => {
  console.log("handleRowClick", row)
}
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