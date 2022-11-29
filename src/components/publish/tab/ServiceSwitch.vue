<template>
  <el-form label-width="100px" inline>
    <el-form-item :label="$t('service.switch.vuepress')">
      <el-switch v-model="vuepressEnabled" @change="vuepressOnChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.jvue')" v-if="false">
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
    <el-form-item v-for="cfg in switchFormData.dynamicConfigArray"
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
import {onMounted, ref} from 'vue'
import {useI18n} from "vue-i18n";
import {setBooleanConf} from "~/utils/config";
import SWITCH_CONSTANTS from "../../../utils/constants/switchConstants";
import logUtil from "../../../utils/logUtil";
import {useTabCount} from "~/composables/tabCountCom";

// use
const {t} = useI18n()
const {
  tabCountStore,
  vuepressEnabled,
  jvueEnabled,
  confEnabled,
  cnblogsEnabled,
  wordpressEnabled,
  liandiEnabled,
  yuqueEnabled,
  kmsEnabled,
  switchFormData,
  doCount
} = useTabCount()

let showSwitchTip = ref(false)

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
  logUtil.logWarn("dynamicOnChange,val=>", val)
  const valArr = val.split("_")
  const switchKey = "switch-" + valArr[0]
  const switchStatus = valArr[1]

  setBooleanConf(switchKey, switchStatus)
  initConf()
}

const initConf = () => {
  doCount()

  // 未启用，跳转设置页面
  if (tabCountStore.tabCount == 0) {
    showSwitchTip.value = true
  } else {
    showSwitchTip.value = false
  }
}

// const checkPlantform = () => {
// 未设置平台跳转到设置，否则跳转到主界面
// alert(totalCount.value)
// logUtil.logWarn("开启的平台数=>" + totalCount.value)
// const ctab = getQueryString("tab")
// // 有启用的平台，直接返回
// if (ctab == undefined && enabledCount > 0) {
//   return
// }
// if (enabledCount == 0 && ctab != "service-switch") {
//   reloadTabPage("service-switch")
// } else if (enabledCount > 0 && ctab != "plantform-main") {
//   // 有启用的平台，但是打开的别的tab，跳转到主界面
//   reloadTabPage("plantform-main")
// }
// }

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