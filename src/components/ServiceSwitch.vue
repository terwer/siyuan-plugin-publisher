<template>
  <el-form label-width="120px">
    <el-form-item :label="$t('service.switch.vuepress')">
      <el-switch v-model="vuepressEnabled" disabled/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.jvue')">
      <el-switch v-model="jvueEnabled" @change="jvueOnChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.conf')">
      <el-switch v-model="confEnabled" @change="confOnChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.cnblogs')">
      <el-switch v-model="cnblogsEnabled" @change="cnblogsOnChange"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const vuepressEnabled = ref(true)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(false)

const jvueOnChange = (val: boolean) => {
  if (val) {
    ElMessage.success("jvueOnChange=>" + val)
  } else {
    ElMessage.warning("jvueOnChange=>" + val)
  }
}

const confOnChange = (val: any) => {
  if (val) {
    ElMessage.success("confOnChange=>" + val)
  } else {
    ElMessage.warning("confOnChange=>" + val)
  }
}
const cnblogsOnChange = (val: any) => {
  if (val) {
    ElMessage.success("cnblogsOnChange=>" + val)
  } else {
    ElMessage.warning("cnblogsOnChange=>" + val)
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