<template>
  <el-tabs type="border-card">
    <el-tab-pane :label="$t('setting.vuepress')" v-if="vuepressEnabled">
      Vuepress
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.jvue')" v-if="jvueEnabled">
      <j-vue-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.conf')" v-if="confEnabled">
      Confluence
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.cnblogs')" v-if="cnblogsEnabled">
      Cnblogs
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.wordpress')" v-if="wordpressEnabled">
      Wordpress
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {getBooleanConf, setBooleanConf} from "../lib/config";
import SWITCH_CONSTANTS from "../constants/switchConstants";
import log from "../lib/logUtil";
import JVueSetting from "./setting/JVueSetting.vue";

const vuepressEnabled = ref(true)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(false)
const wordpressEnabled = ref(false)

const initConf = () => {
  vuepressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY)
  jvueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY)
  confEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY)
  cnblogsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY)
  wordpressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY)
  log.logInfo("平台设置初始化")
}

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  }
})
/*监听props*/
watch(() => props.isReload, /**/(oldValue, newValue) => {
  // Here you can add you functionality
  // as described in the name you will get old and new value of watched property
  // 默认选中vuepress
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  initConf();
  log.logInfo("plantform-setting初始化")
})
</script>

<script lang="ts">
export default {
  name: "PlantformSetting",
  components: {}
}
</script>

<style scoped>

</style>