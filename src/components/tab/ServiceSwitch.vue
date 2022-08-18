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

    <!-- 动态配置 -->
    <el-form-item v-for="cfg in formData.dynamicConfigArray" :label="'[AUTO]'+cfg.plantformName">
      <el-switch v-model="cfg.modelValue" :active-value="cfg.plantformKey+'_true'"
                 :inactive-value="cfg.plantformKey+'_false'" @change="dynamicOnChange"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {useI18n} from "vue-i18n";
import {setBooleanConf, getBooleanConf, getArrayJSONConf, getConf} from "../../lib/config";
import SWITCH_CONSTANTS from "../../lib/constants/switchConstants";
import {DynamicConfig} from "../../lib/dynamicConfig";
import {CONSTANTS} from "../../lib/constants/constants";
import log from "../../lib/logUtil";

const {t} = useI18n()

let vuepressEnabled = ref(true)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(true)
const wordpressEnabled = ref(false)
const liandiEnabled = ref(true)
const yuqueEnabled = ref(true)
const kmsEnabled = ref(false)

let formData = reactive({
  dynamicConfigArray: <Array<DynamicConfig>>[]
})

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
const dynamicOnChange = (val: any) => {
  log.logInfo("dynamicOnChange,val=>", val)
  const valArr = val.split("_")
  const switchKey = "switch-" + valArr[0]
  const switchStatus = valArr[1]

  setBooleanConf(switchKey, switchStatus)
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

  // formData.dynamicConfigArray = getArrayJSONConf<Array<DynamicConfig>>(CONSTANTS.DYNAMIC_CONFIG_KEY)
  const results = getArrayJSONConf<Array<DynamicConfig>>(CONSTANTS.DYNAMIC_CONFIG_KEY)
  formData.dynamicConfigArray = []
  results.forEach(item => {

    const switchKey = "switch-" + item.plantformKey
    const switchValue = getConf(switchKey)

    item.modelValue = item.plantformKey + "_" + switchValue
    formData.dynamicConfigArray.push(item)
  });
  log.logInfo(formData.dynamicConfigArray)
}

onMounted(async () => {
  // 默认选中vuepress且不可取消
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  // 博客园、链滴、语雀默认开放
  if (cnblogsEnabled.value) {
    setBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY, true)
  }
  if (liandiEnabled.value) {
    setBooleanConf(SWITCH_CONSTANTS.SWITCH_LIANDI_KEY, true)
  }
  if (yuqueEnabled.value) {
    setBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY, true)
  }
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