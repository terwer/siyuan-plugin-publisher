<template>
  <el-tabs type="border-card" v-if="tabCountStore.tabCount>0">
    <!-- Github -->
    <el-tab-pane :label="$t('setting.vuepress')" v-if="vuepressEnabled">
      <vuepress-setting/>
    </el-tab-pane>

    <!-- Metaweblog API -->
    <el-tab-pane :label="$t('setting.jvue')" v-if="jvueEnabled">
      <j-vue-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.conf')" v-if="confEnabled">
      <confluence-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.cnblogs')" v-if="cnblogsEnabled">
      <cnblogs-setting/>
    </el-tab-pane>

    <!-- Wordpress -->
    <el-tab-pane :label="$t('setting.wordpress')" v-if="wordpressEnabled">
      <wordpress-setting/>
    </el-tab-pane>

    <!-- Commmon API -->
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
    <el-tab-pane v-for="gcfg in formData.githubArray" :label="gcfg.plantformName">
      <github-setting :api-type="gcfg.plantformKey"/>
    </el-tab-pane>
    <el-tab-pane v-for="mcfg in formData.metaweblogArray" :label="mcfg.plantformName">
      <metaweblog-setting :api-type="mcfg.plantformKey" :cfg="createMCfg(mcfg)"/>
    </el-tab-pane>
    <el-tab-pane v-for="wcfg in formData.wordpressArray" :label="wcfg.plantformName">
      <wordpress-setting :api-type="wcfg.plantformKey" :cfg="createWCfg(wcfg)"/>
    </el-tab-pane>

  </el-tabs>
  <div v-else>
    <el-alert class="top-version-tip" :title="$t('config.platform.none')" type="error" :closable="false"/>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import {getBooleanConf} from "~/utils/config";
import logUtil from "../../../utils/logUtil";
import {DynamicConfig, getDynamicJsonCfg, getDynPostidKey, getDynSwitchKey} from "~/utils/dynamicConfig";
import {DynamicMCfg} from "~/utils/platform/metaweblog/dynamicMCfg";
import {DynamicWCfg} from "~/utils/platform/wordpress/dynamicWCfg";
import {useTabCount} from "~/composables/tabCountCom";
import VuepressSetting from "~/components/publish/tab/setting/adaptor/github/VuepressSetting.vue";
import JVueSetting from "~/components/publish/tab/setting/adaptor/metaweblog/JVueSetting.vue";
import ConfluenceSetting from "~/components/publish/tab/setting/adaptor/metaweblog/ConfluenceSetting.vue";
import CnblogsSetting from "~/components/publish/tab/setting/adaptor/metaweblog/CnblogsSetting.vue";
import WordpressSetting from "~/components/publish/tab/setting/adaptor/metaweblog/WordpressSetting.vue";
import LiandiSetting from "~/components/publish/tab/setting/adaptor/common/LiandiSetting.vue";
import YuqueSetting from "~/components/publish/tab/setting/adaptor/common/YuqueSetting.vue";
import KmsSetting from "~/components/publish/tab/setting/adaptor/common/KmsSetting.vue";
import MetaweblogSetting from "~/components/publish/tab/setting/MetaweblogSetting.vue";
import GithubSetting from "~/components/publish/tab/setting/GithubSetting.vue";

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
  githubArray: <Array<DynamicConfig>>[],
  metaweblogArray: <Array<DynamicConfig>>[],
  wordpressArray: <Array<DynamicConfig>>[]
})

const createMCfg = ref((mcfg: DynamicConfig) => {
  return new DynamicMCfg(getDynPostidKey(mcfg.plantformKey))
})
const createWCfg = ref((wcfg: DynamicConfig) => {
  return new DynamicWCfg(getDynPostidKey(wcfg.plantformKey))
})

const initDynCfg = (dynCfg: DynamicConfig[]): DynamicConfig[] => {
  const newCfg: DynamicConfig[] = []

  dynCfg.forEach(item => {
    const newItem = new DynamicConfig(item.plantformType, item.plantformKey, item.plantformName)
    const switchKey = getDynSwitchKey(item.plantformKey)
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
  formData.githubArray = initDynCfg(dynamicJsonCfg.githubCfg || [])
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
export default {
  name: "PlantformSetting"
}
</script>

<style scoped>

</style>