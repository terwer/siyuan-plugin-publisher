<!--
  - Copyright (c) 2022, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<template>
  <el-tabs
    v-if="tabCountStore.tabCount > 0"
    type="border-card"
    @tab-change="mainTabChange"
  >
    <!-- Github -->
    <el-tab-pane :label="$t('main.publish.to.vuepress')" v-if="vuepressEnabled">
      <vuepress-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.hugo')" v-if="hugoEnabled">
      <hugo-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.hexo')" v-if="hexoEnabled">
      <hexo-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.jekyll')" v-if="jekyllEnabled">
      <jekyll-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>

    <!-- Metaweblog API -->
    <el-tab-pane :label="$t('main.publish.to.jvue')" v-if="jvueEnabled">
      <j-vue-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.conf')" v-if="confEnabled">
      <confluence-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.cnblogs')" v-if="cnblogsEnabled">
      <cnblogs-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>

    <!-- Wordpress -->
    <el-tab-pane
      :label="$t('main.publish.to.wordpress')"
      v-if="wordpressEnabled"
    >
      <wordpress-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>

    <!-- Common API -->
    <el-tab-pane :label="$t('main.publish.to.liandi')" v-if="liandiEnabled">
      <liandi-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.yuque')" v-if="yuqueEnabled">
      <yuque-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>
    <el-tab-pane :label="$t('main.publish.to.kms')" v-if="kmsEnabled">
      <kms-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>

    <!-- 动态平台发布 -->
    <el-tab-pane
      v-for="gcfg in formData.githubArray"
      :key="gcfg.platformKey"
      :label="gcfg.platformName"
    >
      <github-main
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :api-type="gcfg.platformKey"
        :page-id="props.pageId"
        :yaml-converter="gcfg.yamlConverter"
      />
    </el-tab-pane>

    <el-tab-pane
      v-for="mcfg in formData.metaweblogArray"
      :key="mcfg.platformKey"
      :label="mcfg.platformName"
    >
      <metaweblog-main
        :api-type="mcfg.platformKey"
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
      />
    </el-tab-pane>

    <el-tab-pane
      v-for="wcfg in formData.wordpressArray"
      :key="wcfg.platformKey"
      :label="wcfg.platformName"
    >
      <metaweblog-main
        :api-type="wcfg.platformKey"
        :is-main-reload="isReloadMainTab"
        :is-reload="props.isReload"
        :page-id="props.pageId"
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
import { onMounted, reactive, ref, watch } from "vue"
import { useTabCount } from "~/composables/publish/tabCountCom"
import { LogFactory } from "~/utils/logUtil"
import VuepressMain from "~/components/publish/tab/main/github/VuepressMain.vue"
import HugoMain from "~/components/publish/tab/main/github/HugoMain.vue"
import HexoMain from "~/components/publish/tab/main/github/HexoMain.vue"
import JekyllMain from "~/components/publish/tab/main/github/JekyllMain.vue"
import JVueMain from "~/components/publish/tab/main/metaweblog/JVueMain.vue"
import ConfluenceMain from "~/components/publish/tab/main/metaweblog/ConfluenceMain.vue"
import CnblogsMain from "~/components/publish/tab/main/metaweblog/CnblogsMain.vue"
import WordpressMain from "~/components/publish/tab/main/metaweblog/WordpressMain.vue"
import LiandiMain from "~/components/publish/tab/main/common/LiandiMain.vue"
import YuqueMain from "~/components/publish/tab/main/common/YuqueMain.vue"
import KmsMain from "~/components/publish/tab/main/common/KmsMain.vue"
import GithubMain from "~/components/publish/tab/main/GithubMain.vue"
import MetaweblogMain from "~/components/publish/tab/main/MetaweblogMain.vue"
import {
  DynamicConfig,
  getDynamicJsonCfg,
  getDynYamlConverterAdaptor,
} from "~/utils/platform/dynamicConfig"
import { getBooleanConf } from "~/utils/configUtil"

const logger = LogFactory.getLogger("components/publish/tab/PlatformMain.vue")

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

const isReloadMainTab = ref(false)

const formData = reactive({
  dynamicConfigArray: <DynamicConfig[]>[],
  githubArray: <DynamicConfig[]>[],
  metaweblogArray: <DynamicConfig[]>[],
  wordpressArray: <DynamicConfig[]>[],
})

const initDynCfg = (dynCfg: DynamicConfig[]) => {
  const newCfg = []

  dynCfg.forEach((item) => {
    const newItem = new DynamicConfig(
      item.platformType,
      item.platformKey,
      item.platformName
    )

    const switchKey = "switch-" + item.platformKey
    const switchValue = getBooleanConf(switchKey)
    newItem.modelValue = switchValue
    if (switchValue) {
      newCfg.push(newItem)
    }

    newItem.yamlConverter = getDynYamlConverterAdaptor(item.platformKey)
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
  logger.debug("dynamicJsonCfg=>", JSON.stringify(dynamicJsonCfg))
  logger.debug("平台设置初始化")
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

const mainTabChange = () => {
  isReloadMainTab.value = !isReloadMainTab.value
}

/**
 * 监听props
 */
watch(
  () => props.isReload,
  (oldValue, newValue) => {
    initConf()
  }
)

onMounted(() => {
  initConf()
})
</script>
