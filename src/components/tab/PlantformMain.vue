<template>
  <el-tabs type="border-card">
    <el-tab-pane :label="$t('main.publish.to.vuepress')" v-if="vuepressEnabled">
      <vuepress-main/>
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.jvue')" v-if="jvueEnabled">
      JVue
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.conf')" v-if="confEnabled">
      Confluence
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.cnblogs')" v-if="cnblogsEnabled">
      Cnblogs
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.wordpress')" v-if="wordpressEnabled">
      Wordpress
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {getBooleanConf, setBooleanConf} from "../../lib/config";
import SWITCH_CONSTANTS from "../../constants/switchConstants";
import log from "../../lib/logUtil";

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
  log.logInfo("plantform-main初始化")
})

onMounted(() => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  initConf();
  log.logInfo("plantform-main初始化 onMounted")
})
</script>

<script lang="ts">
import VuepressMain from "./main/VuepressMain.vue";

export default {
  name: "PlantformMain",
  components: {VuepressMain}
}
</script>

<style scoped>

</style>