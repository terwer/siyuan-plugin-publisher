<!--
  - Copyright (c) 2023, Terwer . All rights reserved.
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

<script setup lang="ts">
import BackPage from "~/src/components/common/BackPage.vue"
import { reactive } from "vue"
import { useRoute } from "vue-router"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { getSubPlatformTypeByKey, SubPlatformType } from "~/src/platforms/dynamicConfig.ts"
import TelegraphSetting from "~/src/components/set/publish/singleplatform/commonblog/TelegraphSetting.vue"

// uses
const { t } = useVueI18n()
const route = useRoute()

// datas
const params = reactive(route.params)
const apiType = params.key as string
const subtype = getSubPlatformTypeByKey(apiType)
</script>

<template>
  <back-page :title="t('setting.entry.title') + apiType">
    <yuque-setting v-if="subtype === SubPlatformType.Common_Yuque" :api-type="apiType" />
    <notion-setting v-else-if="subtype === SubPlatformType.Common_Notion" :api-type="apiType" />
    <halo-setting v-else-if="subtype === SubPlatformType.Common_Halo" :api-type="apiType" />
    <telegraph-setting v-else-if="subtype === SubPlatformType.Common_Telegraph" :api-type="apiType" />
    <hexo-setting v-else-if="subtype === SubPlatformType.Github_Hexo" :api-type="apiType" />
    <hugo-setting v-else-if="subtype === SubPlatformType.Github_Hugo" :api-type="apiType" />
    <jekyll-setting v-else-if="subtype === SubPlatformType.Github_Jekyll" :api-type="apiType" />
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
    <zhihu-setting v-else-if="subtype === SubPlatformType.Custom_Zhihu" :api-type="apiType" />
    <csdn-setting v-else-if="subtype === SubPlatformType.Custom_CSDN" :api-type="apiType" />
    <wechat-setting v-else-if="subtype === SubPlatformType.Custom_Wechat" :api-type="apiType" />
    <jianshu-setting v-else-if="subtype === SubPlatformType.Custom_Jianshu" :api-type="apiType" />
    <juejin-setting v-else-if="subtype === SubPlatformType.Custom_Juejin" :api-type="apiType" />
    <!--
    <flowus-setting v-else-if="subtype === SubPlatformType.Custom_Flowus" :api-type="apiType" />
    -->
    <span v-else>
      <el-alert :closable="false" :title="t('setting.entry.not.supported')" class="top-tip" type="error" />
    </span>
  </back-page>
</template>

<style lang="stylus" scoped>
.top-tip
  margin 10px 0
</style>
