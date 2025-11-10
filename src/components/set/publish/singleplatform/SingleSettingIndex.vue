<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import BackPage from "~/src/components/common/BackPage.vue"
import { reactive } from "vue"
import { useRoute } from "vue-router"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { getSubPlatformTypeByKey, SubPlatformType } from "~/src/platforms/dynamicConfig.ts"
import TelegraphSetting from "~/src/components/set/publish/singleplatform/commonblog/TelegraphSetting.vue"
import ConfluenceSetting from "~/src/components/set/publish/singleplatform/commonblog/ConfluenceSetting.vue"
import WordpressdotcomSetting from "~/src/components/set/publish/singleplatform/metaweblog/WordpressdotcomSetting.vue"
import HalowebSetting from "~/src/components/set/publish/singleplatform/web/HalowebSetting.vue"
import BilibiliSetting from "~/src/components/set/publish/singleplatform/web/BilibiliSetting.vue"
import QuartzSetting from "~/src/components/set/publish/singleplatform/github/QuartzSetting.vue"
import LocalSystemSetting from "~/src/components/set/publish/singleplatform/fs/LocalSystemSetting.vue"
import { EnvUtil } from "~/src/utils/EnvUtil.ts"

// uses
const { t } = useVueI18n()
const route = useRoute()

// datas
const params = reactive(route.params) as any
const apiType = params.key as string
const subtype = getSubPlatformTypeByKey(apiType)
const hasElectronEnv = EnvUtil.isSiyuanElectron()
</script>

<template>
  <back-page :title="t('setting.entry.title') + apiType" :help-key="subtype">
    <yuque-setting v-if="subtype === SubPlatformType.Common_Yuque" :api-type="apiType" />
    <notion-setting v-else-if="subtype === SubPlatformType.Common_Notion" :api-type="apiType" />
    <halo-setting v-else-if="subtype === SubPlatformType.Common_Halo" :api-type="apiType" />
    <telegraph-setting v-else-if="subtype === SubPlatformType.Common_Telegraph" :api-type="apiType" />
    <confluence-setting v-else-if="subtype === SubPlatformType.Common_Confluence" :api-type="apiType" />
    <hexo-setting v-else-if="subtype === SubPlatformType.Github_Hexo" :api-type="apiType" />
    <hugo-setting v-else-if="subtype === SubPlatformType.Github_Hugo" :api-type="apiType" />
    <jekyll-setting v-else-if="subtype === SubPlatformType.Github_Jekyll" :api-type="apiType" />
    <quartz-setting v-else-if="subtype === SubPlatformType.Github_Quartz" :api-type="apiType" />
    <vuepress-setting v-else-if="subtype === SubPlatformType.Github_Vuepress" :api-type="apiType" />
    <vuepress2-setting v-else-if="subtype === SubPlatformType.Github_Vuepress2" :api-type="apiType" />
    <vitepress-setting v-else-if="subtype === SubPlatformType.Github_Vitepress" :api-type="apiType" />
    <gitlabhexo-setting v-else-if="subtype === SubPlatformType.Gitlab_Hexo" :api-type="apiType" />
    <gitlabhugo-setting v-else-if="subtype === SubPlatformType.Gitlab_Hugo" :api-type="apiType" />
    <gitlabjekyll-setting v-else-if="subtype === SubPlatformType.Gitlab_Jekyll" :api-type="apiType" />
    <gitlabvuepress-setting v-else-if="subtype === SubPlatformType.Gitlab_Vuepress" :api-type="apiType" />
    <gitlabvuepress2-setting v-else-if="subtype === SubPlatformType.Gitlab_Vuepress2" :api-type="apiType" />
    <gitlabvitepress-setting v-else-if="subtype === SubPlatformType.Gitlab_Vitepress" :api-type="apiType" />
    <othermeta-setting v-else-if="subtype === SubPlatformType.Metaweblog_Metaweblog" :api-type="apiType" />
    <cnblogs-setting v-else-if="subtype === SubPlatformType.Metaweblog_Cnblogs" :api-type="apiType" />
    <typecho-setting v-else-if="subtype === SubPlatformType.Metaweblog_Typecho" :api-type="apiType" />
    <jvue-setting v-else-if="subtype === SubPlatformType.Metaweblog_Jvue" :api-type="apiType" />
    <wordpress-setting v-else-if="subtype === SubPlatformType.Wordpress_Wordpress" :api-type="apiType" />
    <wordpressdotcom-setting v-else-if="subtype === SubPlatformType.Wordpress_Wordpressdotcom" :api-type="apiType" />
    <zhihu-setting v-else-if="subtype === SubPlatformType.Custom_Zhihu" :api-type="apiType" />
    <csdn-setting v-else-if="subtype === SubPlatformType.Custom_CSDN" :api-type="apiType" />
    <wechat-setting v-else-if="subtype === SubPlatformType.Custom_Wechat" :api-type="apiType" />
    <jianshu-setting v-else-if="subtype === SubPlatformType.Custom_Jianshu" :api-type="apiType" />
    <juejin-setting v-else-if="subtype === SubPlatformType.Custom_Juejin" :api-type="apiType" />
    <!--
    <flowus-setting v-else-if="subtype === SubPlatformType.Custom_Flowus" :api-type="apiType" />
    -->
    <bilibili-setting v-else-if="subtype === SubPlatformType.Custom_Bilibili" :api-type="apiType" />
    <haloweb-setting v-else-if="subtype === SubPlatformType.Custom_Haloweb" :api-type="apiType" />
    <local-system-setting
      v-else-if="hasElectronEnv && subtype === SubPlatformType.Fs_LocalSystem"
      :api-type="apiType"
    />
    <span v-else>
      <el-alert :closable="false" :title="t('setting.entry.not.supported')" class="top-tip" type="error" />
    </span>
  </back-page>
</template>

<style lang="stylus" scoped>
.top-tip
  margin 10px 0
</style>
