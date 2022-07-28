<template>
  <el-form label-width="120px">
    <el-form-item :label="$t('service.switch.vuepress')">
      <el-switch v-model="vuepressEnabled" :before-change="beforeChange" @change="onChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.jvue')">
      <el-switch v-model="jvueEnabled" @change="onChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.conf')">
      <el-switch v-model="confEnabled" @change="onChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.cnblogs')">
      <el-switch v-model="cnblogsEnabled" @change="onChange"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {ElMessage} from "element-plus";

let selectCount = 1
const vuepressEnabled = ref(true)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(false)

const beforeChange = () => {
  return new Promise((resolve, reject) => {
    if (selectCount == 1) {
      ElMessage.warning('You must add at least one plantform')
      reject(new Error('You must add at least one plantform'))
      return
    }
    return resolve(true)
  })
}

const onChange = (val: boolean) => {
  if (val) {
    ++selectCount;
  } else {
    --selectCount
  }
}
</script>

<script lang="ts">
export default {
  name: "ServiceSwitch"
}
</script>

<style scoped>

</style>