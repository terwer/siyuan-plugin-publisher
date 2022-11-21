<template>
  <el-tabs type="border-card" v-if="tabCountStore.tabCount>0">
    <el-tab-pane :label="$t('setting.vuepress')" v-if="vuepressEnabled">
      <vuepress-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.jvue')" v-if="jvueEnabled">
      <j-vue-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.conf')" v-if="confEnabled">
      <confluence-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.cnblogs')" v-if="cnblogsEnabled">
      <cnblogs-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.wordpress')" v-if="wordpressEnabled">
      <wordpress-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.liandi')" v-if="liandiEnabled">
      <liandi-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.yuque')" v-if="yuqueEnabled">
      <yuque-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.kms')" v-if="kmsEnabled">
      <kms-setting/>
    </el-tab-pane>

    <!-- 动态平台发布配置 -->
    <el-tab-pane v-for="mcfg in formData.metaweblogArray"
                 :label="mcfg.plantformName+'_'+mcfg.plantformType.toUpperCase().substring(0,1)">
      <metaweblog-setting :api-type="mcfg.plantformKey"
                          :cfg="createMCfg(mcfg)"/>
    </el-tab-pane>
    <el-tab-pane v-for="wcfg in formData.wordpressArray"
                 :label="wcfg.plantformName+'_'+wcfg.plantformType.toUpperCase().substring(0,1)">
      <wordpress-setting :api-type="wcfg.plantformKey"
                         :cfg="createWCfg(wcfg)"/>
    </el-tab-pane>

  </el-tabs>
  <div v-else>
    <el-alert class="top-version-tip" :title="$t('config.platform.none')" type="error" :closable="false"/>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import {getBooleanConf, setBooleanConf} from "../../../lib/config";
import SWITCH_CONSTANTS from "../../../lib/constants/switchConstants";
import logUtil from "../../../lib/logUtil";
import {DynamicConfig, getDynamicJsonCfg} from "../../../lib/dynamicConfig";
import {DynamicMCfg} from "../../../lib/platform/metaweblog/config/dynamicMCfg";
import {DynamicWCfg} from "../../../lib/platform/metaweblog/config/dynamicWCfg";
import {useTabCount} from "../../../composables/tabCountCom";

//use
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
  doCount
} = useTabCount()

let formData = reactive({
  dynamicConfigArray: <Array<DynamicConfig>>[],
  metaweblogArray: <Array<DynamicConfig>>[],
  wordpressArray: <Array<DynamicConfig>>[]
})

const createMCfg = ref((mcfg: DynamicConfig) => {
  return new DynamicMCfg('custom-' + mcfg.plantformKey + '-post-id')
})
const createWCfg = ref((wcfg: DynamicConfig) => {
  return new DynamicWCfg('custom-' + wcfg.plantformKey + '-post-id')
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
  doCount()

  const dynamicJsonCfg = getDynamicJsonCfg()
  formData.dynamicConfigArray = initDynCfg(dynamicJsonCfg.totalCfg || [])
  formData.metaweblogArray = initDynCfg(dynamicJsonCfg.metaweblogCfg || [])
  formData.wordpressArray = initDynCfg(dynamicJsonCfg.wordpressCfg || [])
  logUtil.logInfo("dynamicJsonCfg=>")
  logUtil.logInfo(JSON.stringify(dynamicJsonCfg))

  logUtil.logInfo("平台设置初始化")
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
  // setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  initConf();
  logUtil.logInfo("plantform-setting初始化")
})
</script>

<script lang="ts">
import JVueSetting from "./setting/metaweblogsettingadaptor/JVueSetting.vue";
import VuepressSetting from "./setting/VuepressSetting.vue";
import CnblogsSetting from "./setting/metaweblogsettingadaptor/CnblogsSetting.vue";
import ConfluenceSetting from "./setting/metaweblogsettingadaptor/ConfluenceSetting.vue";
import LiandiSetting from "./setting/commonsettingadaptor/LiandiSetting.vue";
import YuqueSetting from "./setting/commonsettingadaptor/YuqueSetting.vue";
import KmsSetting from "./setting/commonsettingadaptor/KmsSetting.vue";
import MetaweblogSetting from "./setting/MetaweblogSetting.vue";
import WordpressSetting from "./setting/metaweblogsettingadaptor/WordpressSetting.vue";

export default {
  name: "PlantformSetting",
  components: {
    VuepressSetting,
    JVueSetting,
    CnblogsSetting,
    ConfluenceSetting,
    LiandiSetting,
    YuqueSetting,
    KmsSetting,
    MetaweblogSetting,
    WordpressSetting,
  }
}
</script>

<style scoped>

</style>