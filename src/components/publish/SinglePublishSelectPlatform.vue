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
import { onMounted, reactive } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useRouter } from "vue-router"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { DynamicConfig, DynamicJsonCfg, getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { HtmlUtil, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"

const logger = createAppLogger("single-publish-select-platform")

// props
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
})

// uses
const { t } = useVueI18n()
const router = useRouter()
const { getSetting } = useSettingStore()

// datas
const formData = reactive({
  enabledConfigArray: [] as DynamicConfig[],

  postMeta: {} as any,
})

// methods
const handleSingleDoPublish = (key: string) => {
  const method = checkHasPublished(key) ? "edit" : "add"
  const path = `/publish/singlePublish/doPublish/${key}/${props.id}`
  logger.info("will go to =>", path)
  const query = {
    path: path,
    query: {
      showBack: "true",
      method: method,
    },
  }
  router.push(query)
}

const checkHasPublished = (key: string) => {
  const postidKey = getDynPostidKey(key)
  const postMetaValue = ObjectUtil.getProperty(formData.postMeta, postidKey)

  return !StrUtil.isEmptyString(postMetaValue)
}

const initPage = async () => {
  const setting = await getSetting()
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  const dynamicConfigArray = dynJsonCfg?.totalCfg || []
  formData.enabledConfigArray = dynamicConfigArray.filter((item) => item.isEnabled && item.isAuth)
  formData.postMeta = ObjectUtil.getProperty(setting, props.id, {})
}

onMounted(async () => {
  await initPage()
})
</script>

<template>
  <div class="platform-desc">
    <p>
      <el-alert class="desc-tip" type="warning" title="点击图标进入对应平台的发布页面"></el-alert>
    </p>
  </div>

  <el-row :gutter="20" class="row-box">
    <el-col
      :span="8"
      :title="cfg.platformName"
      class="platform-select-card"
      v-for="cfg in formData.enabledConfigArray"
      @click="handleSingleDoPublish(cfg.platformKey)"
    >
      <el-card class="card-item">
        <div class="icon-list">
          <el-badge
            :type="checkHasPublished(cfg.platformKey) ? 'success' : 'danger'"
            :value="checkHasPublished(cfg.platformKey) ? '已发布' : '未发布'"
            class="item"
          >
            <el-text class="define-item">
              <i class="el-icon">
                <span v-html="cfg?.platformIcon"></span>
              </i>
              {{ HtmlUtil.parseHtml(cfg.platformName, 11) }}
            </el-text>
          </el-badge>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="stylus">
$icon_size = 32px

.platform-desc
  font-size 14px
  margin 0 10px
  .desc-tip
    padding-left 0

.card-item
  padding 0

.item
  margin-top 10px

.row-box
  cursor pointer
  margin 0 !important
  padding 0
  .platform-select-card
    margin-bottom 10px
    height 100%
    .platform-title
      font-size 24px
      font-weight 600
      margin-bottom 12px
    .icon-list
      text-align left
      gap 10px
      .define-item
        color var(--el-color-primary)
        //color var(--el-button-bg-color)
        cursor pointer
        font-size $icon_size
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
</style>
