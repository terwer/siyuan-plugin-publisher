<template>
  <el-tabs type="border-card">
    <el-tab-pane :label="$t('main.publish.to.vuepress')" v-if="vuepressEnabled">
      <vuepress-main :is-reload="isReloadVuepressMain"/>
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.jvue')" v-if="jvueEnabled">
      <j-vue-main/>
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.conf')" v-if="confEnabled">
      <confluence-main/>
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.cnblogs')" v-if="cnblogsEnabled">
      <cnblogs-main/>
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.wordpress')" v-if="wordpressEnabled">
      <wordpress-main/>
    </el-tab-pane>





    <el-tab-pane v-for="dynamicMain in dynamicMains" label="动态平台">
      <common-blog-main/>
    </el-tab-pane>





    <el-tab-pane :label="$t('main.publish.to.liandi')" v-if="liandiEnabled">
      <liandi-main/>
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.yuque')" v-if="yuqueEnabled">
      <yuque-main/>
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.kms')" v-if="kmsEnabled">
      <kms-main/>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from "vue";
import {getBooleanConf, setBooleanConf} from "../../lib/config";
import SWITCH_CONSTANTS from "../../lib/constants/switchConstants";
import log from "../../lib/logUtil";

const vuepressEnabled = ref(true)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(false)
const wordpressEnabled = ref(false)
const liandiEnabled = ref(false)
const yuqueEnabled = ref(false)
const kmsEnabled = ref(false)

const dynamicMains = reactive([
    "1","2"
])

const isReloadVuepressMain = ref(false)

const initConf = () => {
  vuepressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY)
  jvueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY)
  confEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY)
  cnblogsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY)
  wordpressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY)
  liandiEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_LIANDI_KEY)
  yuqueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY)
  kmsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_KMS_KEY)
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

  // 如果开启了Vuepress，需要刷新Vuepress
  if (vuepressEnabled.value) {
    isReloadVuepressMain.value = !isReloadVuepressMain.value
  }
})

onMounted(() => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  initConf();
  log.logInfo("plantform-main初始化 onMounted")
})
</script>

<script lang="ts">
import VuepressMain from "./main/VuepressMain.vue";
import JVueMain from "./main/metaweblogmainadaptor/JVueMain.vue";
import CnblogsMain from "./main/metaweblogmainadaptor/CnblogsMain.vue";
import ConfluenceMain from "./main/metaweblogmainadaptor/ConfluenceMain.vue";
import WordpressMain from "./main/metaweblogmainadaptor/WordpressMain.vue";
import LiandiMain from "./main/commonblogmainadaptor/LiandiMain.vue";
import YuqueMain from "./main/commonblogmainadaptor/YuqueMain.vue";
import KmsMain from "./main/commonblogmainadaptor/KmsMain.vue";
import CommonBlogMain from "./main/CommonBlogMain.vue";

export default {
  name: "PlantformMain",
  components: {VuepressMain, JVueMain, CnblogsMain, ConfluenceMain, WordpressMain,CommonBlogMain, LiandiMain, YuqueMain, KmsMain}
}
</script>

<style scoped>

</style>