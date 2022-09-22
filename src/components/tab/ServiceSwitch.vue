<template>
  <el-form label-width="100px" inline>
    <el-form-item :label="$t('service.switch.vuepress')">
      <el-switch v-model="vuepressEnabled" @change="vuepressOnChange"/>
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
    <el-form-item v-for="cfg in formData.dynamicConfigArray"
                  :label="cfg.plantformName+'_'+cfg.plantformType.toUpperCase().substring(0,1)">
      <el-switch v-model="cfg.modelValue" :active-value="cfg.plantformKey+'_true'"
                 :inactive-value="cfg.plantformKey+'_false'" @change="dynamicOnChange"/>
    </el-form-item>

    <div v-if="showSwitchTip">
      <p>
        <el-alert :title="$t('plantform.must.select.one')" type="error" :closable="false"/>
      </p>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {useI18n} from "vue-i18n";
import {getBooleanConf, getConf, setBooleanConf} from "../../lib/config";
import SWITCH_CONSTANTS from "../../lib/constants/switchConstants";
import {DynamicConfig, getDynamicJsonCfg} from "../../lib/dynamicConfig";
import logUtil from "../../lib/logUtil";
import {getQueryString, reloadTabPage} from "../../lib/util";

const {t} = useI18n()

let enabledCount = 0
let showSwitchTip = ref(false)

const vuepressEnabled = ref(false)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(false)
const wordpressEnabled = ref(false)
const liandiEnabled = ref(false)
const yuqueEnabled = ref(false)
const kmsEnabled = ref(false)

let formData = reactive({
  dynamicConfigArray: <Array<DynamicConfig>>[]
})

const vuepressOnChange = (val: boolean) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, val)
  initConf()
}
const jvueOnChange = (val: boolean) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY, val)
  initConf()
}
const confOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY, val)
  initConf()
}
const cnblogsOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY, val)
  initConf()
}
const wordpressOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY, val)
  initConf()
}
const liandiOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_LIANDI_KEY, val)
  initConf()
}
const yuqueOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY, val)
  initConf()
}
const kmsOnChange = (val: any) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_KMS_KEY, val)
  initConf()
}
const dynamicOnChange = (val: any) => {
  logUtil.logInfo("dynamicOnChange,val=>", val)
  const valArr = val.split("_")
  const switchKey = "switch-" + valArr[0]
  const switchStatus = valArr[1]

  setBooleanConf(switchKey, switchStatus)
  initConf()
}

const counter = (count: number, isAdd: boolean) => {
  if (isAdd) {
    ++count;
  }
  return count
}

const initConf = () => {
  enabledCount = 0;
  vuepressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY)
  enabledCount = counter(enabledCount, vuepressEnabled.value)

  jvueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY)
  enabledCount = counter(enabledCount, jvueEnabled.value)

  confEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY)
  enabledCount = counter(enabledCount, confEnabled.value)

  cnblogsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY)
  enabledCount = counter(enabledCount, cnblogsEnabled.value)

  wordpressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY)
  enabledCount = counter(enabledCount, wordpressEnabled.value)

  liandiEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_LIANDI_KEY)
  enabledCount = counter(enabledCount, liandiEnabled.value)

  yuqueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY)
  enabledCount = counter(enabledCount, yuqueEnabled.value)

  kmsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_KMS_KEY)
  enabledCount = counter(enabledCount, kmsEnabled.value)

  const dynamicJsonCfg = getDynamicJsonCfg()
  const results = dynamicJsonCfg.totalCfg || []
  formData.dynamicConfigArray = []
  results.forEach(item => {

    const switchKey = "switch-" + item.plantformKey
    const switchValue = getConf(switchKey)

    item.modelValue = item.plantformKey + "_" + switchValue
    formData.dynamicConfigArray.push(item)

    const dynEnabled = switchValue.toLowerCase() === "true"
    enabledCount = counter(enabledCount, dynEnabled)
  });

  // 未启用，跳转设置页面
  if(enabledCount == 0){
    showSwitchTip.value = true
  }else{
    showSwitchTip.value = false
  }
}

const checkPlantform = () => {
  // 未设置平台跳转到设置，否则跳转到主界面
  logUtil.logInfo("开启的平台数=>" + enabledCount)
  const ctab = getQueryString("tab")
  // 有启用的平台，直接返回
  if (ctab == undefined && enabledCount > 0) {
    return
  }
  if (enabledCount == 0 && ctab != "service-switch") {
    reloadTabPage("service-switch")
  } else if (enabledCount > 0 && ctab != "plantform-main") {
    // 有启用的平台，但是打开的别的tab，跳转到主界面
    reloadTabPage("plantform-main")
  }
}

onMounted(() => {
  // 初始化
  initConf()

  // 检测开启的平台数
  // checkPlantform()
})

</script>

<script lang="ts">
export default {
  name: "ServiceSwitch"
}
</script>

<style scoped>

</style>