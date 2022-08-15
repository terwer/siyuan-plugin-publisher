<template>
  <el-form label-width="100px" inline>
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

    <el-form-item :label="$t('service.switch.liandi')">
      <el-switch v-model="liandiEnabled" @change="liandiOnChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.yuque')">
      <el-switch v-model="yuqueEnabled" @change="yuqueOnChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.kms')">
      <el-switch v-model="kmsEnabled" @change="kmsOnChange"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from "vue-i18n";
import {setBooleanConf, getBooleanConf} from "../../lib/config";
import SWITCH_CONSTANTS from "../../lib/constants/switchConstants";

const {t} = useI18n()

let vuepressEnabled = ref(true)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(false)
const wordpressEnabled = ref(false)
const liandiEnabled = ref(false)
const yuqueEnabled = ref(false)
const kmsEnabled = ref(false)

const jvueOnChange = (val: boolean) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY, val)
}
const confOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY, val)
}
const cnblogsOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY, val)
}
const wordpressOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY, val)
}
const liandiOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_LIANDI_KEY, val)
}
const yuqueOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY, val)
}
const kmsOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_KMS_KEY, val)
}

const initConf = () => {
  vuepressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY)
  jvueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY)
  confEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY)
  cnblogsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY)
  wordpressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY)
  liandiEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_LIANDI_KEY)
  yuqueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY)
  kmsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_KMS_KEY)
}

onMounted(async () => {
  // 默认选中vuepress
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  // 初始化
  initConf()
})

</script>

<script lang="ts">
export default {
  name: "ServiceSwitch"
}
</script>

<style scoped>

</style>