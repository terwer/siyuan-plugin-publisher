<template>
  <el-tabs type="border-card" v-if="tabCountStore.tabCount > 0">
    <!-- Github -->
    <el-tab-pane :label="$t('main.publish.to.vuepress')" v-if="vuepressEnabled">
      <vuepress-main :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.hugo')" v-if="hugoEnabled">
      <hugo-main :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.hexo')" v-if="hexoEnabled">
      <hexo-main :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.jekyll')" v-if="jekyllEnabled">
      <jekyll-main :page-id="props.pageId" />
    </el-tab-pane>

    <!-- Metaweblog API -->
    <el-tab-pane :label="$t('main.publish.to.jvue')" v-if="jvueEnabled">
      <j-vue-main :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.conf')" v-if="confEnabled">
      <confluence-main :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.cnblogs')" v-if="cnblogsEnabled">
      <cnblogs-main :page-id="props.pageId" />
    </el-tab-pane>

    <!-- Wordpress -->
    <el-tab-pane
      :label="$t('main.publish.to.wordpress')"
      v-if="wordpressEnabled"
    >
      <wordpress-main :page-id="props.pageId" />
    </el-tab-pane>

    <!-- Commmon API -->
    <el-tab-pane :label="$t('main.publish.to.liandi')" v-if="liandiEnabled">
      <liandi-main :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.yuque')" v-if="yuqueEnabled">
      <yuque-main :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.kms')" v-if="kmsEnabled">
      <kms-main :page-id="props.pageId" />
    </el-tab-pane>

    <!-- 动态平台发布 -->
    <el-tab-pane
      v-for="gcfg in formData.githubArray"
      :key="gcfg.plantformKey"
      :label="gcfg.plantformName"
    >
      <github-main :api-type="gcfg.plantformKey" :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane
      v-for="mcfg in formData.metaweblogArray"
      :key="mcfg.plantformKey"
      :label="mcfg.plantformName"
    >
      <metaweblog-main :api-type="mcfg.plantformKey" :page-id="props.pageId" />
    </el-tab-pane>
    <el-tab-pane
      v-for="wcfg in formData.wordpressArray"
      :key="wcfg.plantformKey"
      :label="wcfg.plantformName"
    >
      <metaweblog-main :api-type="wcfg.plantformKey" :page-id="props.pageId" />
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
import HugoMain from "~/components/publish/tab/main/github/HugoMain.vue"
import HexoMain from "~/components/publish/tab/main/github/HexoMain.vue"
import JekyllMain from "~/components/publish/tab/main/github/JekyllMain.vue"
import GithubMain from "~/components/publish/tab/main/GithubMain.vue"
import { onMounted, reactive, watch } from "vue"
import { useTabCount } from "~/composables/tabCountCom"
import { DynamicConfig, getDynamicJsonCfg } from "~/utils/dynamicConfig"
import { getBooleanConf } from "~/utils/config"
import logUtil from "~/utils/logUtil"

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
    const switchKey = "switch-" + item.plantformKey
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
  pageId: {
    type: String,
    default: undefined,
  },
})

/* 监听props */
watch(
  () => props.isReload,
  /**/ (oldValue, newValue) => {
    initConf()
    logUtil.logInfo("plantform-main初始化")
  }
)

onMounted(() => {
  initConf()
  logUtil.logInfo("plantform-main初始化 onMounted")
})
</script>
