<template>
  <el-tabs type="border-card" v-if="tabCountStore.tabCount > 0">
    <!-- Github -->
    <el-tab-pane
      :label="$t('setting.vuepress') + $t('setting.blog.setting')"
      v-if="vuepressEnabled"
    >
      <vuepress-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.hugo') + $t('setting.blog.setting')"
      v-if="hugoEnabled"
    >
      <hugo-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.hexo') + $t('setting.blog.setting')"
      v-if="hexoEnabled"
    >
      <hexo-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.jekyll') + $t('setting.blog.setting')"
      v-if="jekyllEnabled"
    >
      <jekyll-setting />
    </el-tab-pane>

    <!-- Metaweblog API -->
    <el-tab-pane
      :label="$t('setting.jvue') + $t('setting.blog.setting')"
      v-if="jvueEnabled"
    >
      <j-vue-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.conf') + $t('setting.blog.setting')"
      v-if="confEnabled"
    >
      <confluence-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.cnblogs') + $t('setting.blog.setting')"
      v-if="cnblogsEnabled"
    >
      <cnblogs-setting />
    </el-tab-pane>

    <!-- Wordpress -->
    <el-tab-pane
      :label="$t('setting.wordpress') + $t('setting.blog.setting')"
      v-if="wordpressEnabled"
    >
      <wordpress-setting />
    </el-tab-pane>

    <!-- Commmon API -->
    <el-tab-pane
      :label="$t('setting.liandi') + $t('setting.blog.setting')"
      v-if="liandiEnabled"
    >
      <liandi-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.yuque') + $t('setting.blog.setting')"
      v-if="yuqueEnabled"
    >
      <yuque-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.kms') + $t('setting.blog.setting')"
      v-if="kmsEnabled"
    >
      <kms-setting />
    </el-tab-pane>

    <!-- 动态平台发布配置 -->
    <el-tab-pane
      v-for="gcfg in formData.githubArray"
      :key="gcfg.plantformKey"
      :label="gcfg.plantformName + $t('setting.blog.setting')"
    >
      <github-setting :api-type="gcfg.plantformKey" :cfg="createGCfg(gcfg)" />
    </el-tab-pane>
    <el-tab-pane
      v-for="mcfg in formData.metaweblogArray"
      :key="mcfg.plantformKey"
      :label="mcfg.plantformName + $t('setting.blog.setting')"
    >
      <metaweblog-setting
        :api-type="mcfg.plantformKey"
        :cfg="createMCfg(mcfg)"
      />
    </el-tab-pane>
    <el-tab-pane
      v-for="wcfg in formData.wordpressArray"
      :key="wcfg.plantformKey"
      :label="wcfg.plantformName + $t('setting.blog.setting')"
    >
      <wordpress-setting
        :api-type="wcfg.plantformKey"
        :cfg="createWCfg(wcfg)"
      />
    </el-tab-pane>
  </el-tabs>
  <div v-else>
    <el-alert
      class="top-version-tip"
      :title="$t('config.platform.none')"
      type="error"
      :closable="false"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getBooleanConf } from "~/utils/config"
import logUtil from "../../../utils/logUtil"
import {
  DynamicConfig,
  getDynamicJsonCfg,
  getDynPostidKey,
  getDynSwitchKey,
} from "~/utils/dynamicConfig"
import { DynamicMCfg } from "~/utils/platform/metaweblog/dynamicMCfg"
import { DynamicWCfg } from "~/utils/platform/wordpress/dynamicWCfg"
import { useTabCount } from "~/composables/tabCountCom"
import JVueSetting from "~/components/publish/tab/setting/metaweblog/JVueSetting.vue"
import ConfluenceSetting from "~/components/publish/tab/setting/metaweblog/ConfluenceSetting.vue"
import CnblogsSetting from "~/components/publish/tab/setting/metaweblog/CnblogsSetting.vue"
import WordpressSetting from "~/components/publish/tab/setting/metaweblog/WordpressSetting.vue"
import LiandiSetting from "~/components/publish/tab/setting/common/LiandiSetting.vue"
import YuqueSetting from "~/components/publish/tab/setting/common/YuqueSetting.vue"
import KmsSetting from "~/components/publish/tab/setting/common/KmsSetting.vue"
import MetaweblogSetting from "~/components/publish/tab/setting/MetaweblogSetting.vue"
import GithubSetting from "~/components/publish/tab/setting/GithubSetting.vue"
import VuepressSetting from "~/components/publish/tab/setting/github/VuepressSetting.vue"
import HugoSetting from "~/components/publish/tab/setting/github/HugoSetting.vue"
import HexoSetting from "~/components/publish/tab/setting/github/HexoSetting.vue"
import JekyllSetting from "~/components/publish/tab/setting/github/JekyllSetting.vue"
import { DynamicGCfg } from "~/utils/platform/github/DynamicGCfg"

// use
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
  doCount,
} = useTabCount()

const formData = reactive({
  dynamicConfigArray: [],
  githubArray: [],
  metaweblogArray: [],
  wordpressArray: [],
})

// @ts-ignore
const createGCfg = ref((gcfg) => {
  return new DynamicGCfg(gcfg)
})
// @ts-ignore
const createMCfg = ref((mcfg) => {
  return new DynamicMCfg(getDynPostidKey(mcfg.plantformKey))
})
// @ts-ignore
const createWCfg = ref((wcfg) => {
  return new DynamicWCfg(getDynPostidKey(wcfg.plantformKey))
})
// @ts-ignore
const initDynCfg = (dynCfg) => {
  // @ts-ignore
  const newCfg = []

  // @ts-ignore
  dynCfg.forEach((item) => {
    const newItem = new DynamicConfig(
      item.plantformType,
      item.plantformKey,
      item.plantformName
    )
    newItem.subPlantformType = item.subPlantformType

    const switchKey = getDynSwitchKey(item.plantformKey)
    const switchValue = getBooleanConf(switchKey)
    newItem.modelValue = switchValue
    if (switchValue) {
      newCfg.push(newItem)
    }
  })

  // @ts-ignore
  return newCfg
}

const initConf = () => {
  doCount()

  const dynamicJsonCfg = getDynamicJsonCfg()
  // @ts-ignore
  formData.dynamicConfigArray = initDynCfg(dynamicJsonCfg.totalCfg || [])
  // @ts-ignore
  formData.githubArray = initDynCfg(dynamicJsonCfg.githubCfg || [])
  // @ts-ignore
  formData.metaweblogArray = initDynCfg(dynamicJsonCfg.metaweblogCfg || [])
  // @ts-ignore
  formData.wordpressArray = initDynCfg(dynamicJsonCfg.wordpressCfg || [])

  logUtil.logInfo("dynamicJsonCfg=>")
  logUtil.logInfo(JSON.stringify(dynamicJsonCfg))

  logUtil.logInfo("平台设置初始化")
}

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false,
  },
})
/* 监听props */
watch(
  () => props.isReload,
  /**/ (oldValue, newValue) => {
    // Here you can add you functionality
    // as described in the name you will get old and new value of watched property
    // 默认选中vuepress
    // setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
    initConf()
    logUtil.logInfo("plantform-setting初始化")
  }
)
</script>

<script lang="ts">
export default {
  name: "PlantformSetting",
}
</script>

<style scoped></style>
