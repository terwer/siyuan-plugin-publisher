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
import { DynamicConfig, PlatformType } from "~/src/components/set/publish/platform/dynamicConfig.ts"
import { useRoute, useRouter } from "vue-router"
import BackPage from "~/src/components/common/BackPage.vue"
import { reactive } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { usePlatformDefine } from "~/src/composables/usePlatformDefine.ts"

// uses
const { t } = useVueI18n()
const router = useRouter()
const route = useRoute()
const { getPlatformType, getPrePlatformList } = usePlatformDefine()

// datas
const params = reactive(route.params)

const formData = reactive({
  ptype: {} as any,
  pre: <DynamicConfig[]>[],
})

// methods
const handleAddPlatform = (cfg?: DynamicConfig) => {
  const type = params.type
  const query = {
    path: `/setting/platform/add/${type}`,
    query: {
      showBack: "true",
      key: cfg?.platformKey,
      sub: cfg?.subPlatformType,
    },
  }

  router.push(query)
}

const initPage = () => {
  const type = params.type as PlatformType
  formData.ptype = getPlatformType(type)
  formData.pre = getPrePlatformList(type)
}
initPage()
</script>

<template>
  <back-page :title="'新增平台 - ' + params.type">
    <el-card class="platform-add-card">
      <div class="platform-title">{{ formData.ptype.title }}</div>
      <div class="platform-desc">
        <p>{{ formData.ptype.description }}</p>
        <p>
          <el-alert class="desc-tip" type="warning" title="点击图标快速添加，或者点击下方按钮自定义添加"></el-alert>
        </p>
      </div>
      <div class="icon-list">
        <el-space direction="horizontal" class="platform-box">
          <el-text class="define-item" v-for="preItem in formData.pre" @click="handleAddPlatform(preItem)">
            <i class="el-icon">
              <span v-html="preItem?.platformIcon"></span>
            </i>
            {{ preItem.platformName }}
          </el-text>
        </el-space>
      </div>
      <div class="add-action">
        <el-button type="primary" size="large" @click="handleAddPlatform">
          添加自定义 {{ formData.ptype.title }} 对接
        </el-button>
      </div>
    </el-card>
  </back-page>
</template>

<style scoped lang="stylus">
$icon_size = 32px
.platform-add-card
  margin-top 16px
  height 100%
  .platform-title
    font-size 24px
    font-weight 600
    margin-bottom 12px
  .platform-desc
    font-size 14px
    margin-bottom 12px
    min-height 60px
    .desc-tip
      padding-left 0
  .icon-list
    text-align center
    margin 10px 0
    margin-bottom 24px
    min-height 180px
    gap 10px
    .define-item
      color var(--el-color-primary)
      //color var(--el-button-bg-color)
      cursor pointer
      font-size $icon_size
      padding 10px
      &:hover
        color var(--el-color-primary-light-3)
      :deep(.el-icon)
        //color var(--el-color-primary)
        width $icon_size
        height $icon_size
        margin-right -4px
        vertical-align middle
      :deep(.el-icon svg)
        width $icon_size
        height $icon_size
  .add-action
    text-align center
</style>