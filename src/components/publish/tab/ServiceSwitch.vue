<template>
  <el-form class="switch-form" inline>
    <!-- Github -->
    <el-form-item :label="$t('service.switch.vuepress')">
      <el-switch v-model="vuepressEnabled" @change="vuepressOnChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.hugo')">
      <el-switch v-model="hugoEnabled" @change="hugoOnChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.hexo')">
      <el-switch v-model="hexoEnabled" @change="hexoOnChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.jekyll')">
      <el-switch v-model="jekyllEnabled" @change="jekyllOnChange"/>
    </el-form-item>

    <!-- Metaweblog API -->
    <el-form-item :label="$t('service.switch.jvue')">
      <el-switch v-model="jvueEnabled" @change="jvueOnChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.conf')">
      <el-switch v-model="confEnabled" @change="confOnChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.cnblogs')">
      <el-switch v-model="cnblogsEnabled" @change="cnblogsOnChange"/>
    </el-form-item>

    <!-- Wordpress -->
    <el-form-item :label="$t('service.switch.wordpress')">
      <el-switch v-model="wordpressEnabled" @change="wordpressOnChange"/>
    </el-form-item>

    <!-- Commmon API -->
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
    <el-form-item v-for="cfg in switchFormData.dynamicConfigArray" :label="cfg.plantformName">
      <el-switch v-model="cfg.modelValue" :active-value="getDynSwitchActive(cfg.plantformKey)"
                 :inactive-value="getDynSwitchInactive(cfg.plantformKey)" @change="dynamicOnChange"/>
    </el-form-item>

    <div v-if="showSwitchTip">
      <p>
        <el-alert :title="$t('plantform.must.select.one')" type="error" :closable="false"/>
      </p>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from "vue-i18n";
import {setBooleanConf} from "~/utils/config";
import logUtil from "../../../utils/logUtil";
import {useTabCount} from "~/composables/tabCountCom";
import {getDynSwitchActive, getDynSwitchInactive, getSwitchItem} from "~/utils/dynamicConfig.js";
import SWITCH_CONSTANTS from "~/utils/constants/switchConstants";

// use
const {t} = useI18n()
const {
  tabCountStore,
  vuepressEnabled,
  hugoEnabled,
  hexoEnabled,
  jekyllEnabled,
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

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  }
})

const vuepressOnChange = (val: boolean) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, val)
  initConf()
}
const hugoOnChange = (val: boolean) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_HUGO_KEY, val)
  initConf()
}
const hexoOnChange = (val: boolean) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_HEXO_KEY, val)
  initConf()
}
const jekyllOnChange = (val: boolean) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_JEKYLL_KEY, val)
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
  const switchItem = getSwitchItem(val)
  setBooleanConf(switchItem.switchKey, switchItem.switchValue)
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

/*监听props*/
watch(() => props.isReload, /**/async (oldValue, newValue) => {
  // Here you can add you functionality
  // as described in the name you will get old and new value of watched property
  initConf();
})

onMounted(() => {
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
.switch-form{
  margin: 16px 10px;
}
</style>