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

    <el-form-item :label="$t('service.switch.wordpress')">
      <el-switch v-model="wordpressEnabled" @change="wordpressOnChange"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from "vue-i18n";
import {setConf, getConf} from "../lib/config";
import {SWITCH_CONSTSNTS} from "../constants/switchConstants";

const {t} = useI18n()
let vuepressEnabled = ref(true)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(false)
const wordpressEnabled = ref(false)

const jvueOnChange = (val: boolean) => {
  setConf(SWITCH_CONSTSNTS.SWITCH_JVUE_KEY, val)
}
const confOnChange = (val: any) => {
  setConf(SWITCH_CONSTSNTS.SWITCH_CONF_KEY, val)
}
const cnblogsOnChange = (val: any) => {
  setConf(SWITCH_CONSTSNTS.SWITCH_CNBLOGS_KEY, val)
}
const wordpressOnChange = (val: any) => {
  setConf(SWITCH_CONSTSNTS.SWITCH_WORDPRESS_KEY, val)
}

const initConf = () => {
  vuepressEnabled.value = getConf(SWITCH_CONSTSNTS.SWITCH_VUEPRESS_KEY) || false
  jvueEnabled.value = getConf(SWITCH_CONSTSNTS.SWITCH_JVUE_KEY) || false
  confEnabled.value = getConf(SWITCH_CONSTSNTS.SWITCH_CONF_KEY) || false
  cnblogsEnabled.value = getConf(SWITCH_CONSTSNTS.SWITCH_CNBLOGS_KEY) || false
  wordpressEnabled.value = getConf(SWITCH_CONSTSNTS.SWITCH_WORDPRESS_KEY) || false
}

// 默认选中vuepress
setConf(SWITCH_CONSTSNTS.SWITCH_VUEPRESS_KEY, true)
// 初始化
initConf()
</script>

<script lang="ts">
export default {
  name: "ServiceSwitch"
}
</script>

<style scoped>

</style>