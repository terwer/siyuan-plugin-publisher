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
    <el-tab-pane :label="$t('main.publish.to.liandi')" v-if="liandiEnabled">
      <liandi-main/>
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.yuque')" v-if="yuqueEnabled">
      <yuque-main/>
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.kms')" v-if="kmsEnabled">
      <kms-main/>
    </el-tab-pane>

    <!-- 动态平台发布 -->
    <el-tab-pane v-for="mcfg in formData.metaweblogArray"
                 :label="mcfg.plantformName+'_'+mcfg.plantformType.toUpperCase().substring(0,1)">
      <metaweblog-main :api-type="mcfg.plantformKey"/>
    </el-tab-pane>
    <el-tab-pane v-for="wcfg in formData.wordpressArray"
                 :label="wcfg.plantformName+'_'+wcfg.plantformType.toUpperCase().substring(0,1)">
      <metaweblog-main :api-type="wcfg.plantformKey"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from "vue";
import {getBooleanConf, setBooleanConf} from "../../lib/config";
import SWITCH_CONSTANTS from "../../lib/constants/switchConstants";
import logUtil from "../../lib/logUtil";
import {DynamicConfig, getDynamicJsonCfg} from "../../lib/dynamicConfig";

const vuepressEnabled = ref(true)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(false)
const wordpressEnabled = ref(false)
const liandiEnabled = ref(false)
const yuqueEnabled = ref(false)
const kmsEnabled = ref(false)

let formData = reactive({
  dynamicConfigArray: <Array<DynamicConfig>>[],
  metaweblogArray: <Array<DynamicConfig>>[],
  wordpressArray: <Array<DynamicConfig>>[]
})

const initDynCfg = (dynCfg: DynamicConfig[]): DynamicConfig[] => {
  const newCfg: DynamicConfig[] = []

  dynCfg.forEach(item => {
    const newItem = new DynamicConfig(item.plantformType, item.plantformKey, item.plantformName)
    const switchKey = "switch-" + item.plantformKey
    const switchValue = getBooleanConf(switchKey)
    newItem.modelValue = switchValue
    if (switchValue) {
      newCfg.push(newItem)
    }
  })

  return newCfg
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

  const dynamicJsonCfg = getDynamicJsonCfg()
  formData.dynamicConfigArray = initDynCfg(dynamicJsonCfg.totalCfg || [])
  formData.metaweblogArray = initDynCfg(dynamicJsonCfg.metaweblogCfg || [])
  formData.wordpressArray = initDynCfg(dynamicJsonCfg.wordpressCfg || [])
  logUtil.logInfo("dynamicJsonCfg=>")
  logUtil.logInfo(JSON.stringify(dynamicJsonCfg))

  logUtil.logInfo("平台设置初始化")
}

const isReloadVuepressMain = ref(false)

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
  logUtil.logInfo("plantform-main初始化")

  // 如果开启了Vuepress，需要刷新Vuepress
  if (vuepressEnabled.value) {
    isReloadVuepressMain.value = !isReloadVuepressMain.value
  }
})

onMounted(() => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  initConf();
  logUtil.logInfo("plantform-main初始化 onMounted")
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
import MetaweblogMain from "./main/MetaweblogMain.vue";

export default {
  name: "PlantformMain",
  components: {
    VuepressMain,
    JVueMain,
    CnblogsMain,
    ConfluenceMain,
    WordpressMain,
    LiandiMain,
    YuqueMain,
    KmsMain,
    MetaweblogMain
  }
}
</script>

<style scoped>

</style>