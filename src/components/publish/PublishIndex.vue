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
import { createAppLogger } from "~/src/utils/appLogger.ts"
import PublishTips from "~/src/components/publish/form/PublishTips.vue"
import PublishPlatform from "~/src/components/publish/form/PublishPlatform.vue"
import PublishTags from "~/src/components/publish/form/PublishTags.vue"
import { onMounted, reactive } from "vue"
import { useRoute } from "vue-router"
import { usePublish } from "~/src/composables/usePublish.ts"
import { getWidgetId } from "~/src/utils/widgetUtils.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { Post } from "zhi-blog-api"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { ElMessage } from "element-plus"

const logger = createAppLogger("publisher-index")

// uses
const { t } = useVueI18n()
const { doSinglePublish } = usePublish()
const { blogApi } = useSiyuanApi()
const { query } = useRoute()

// datas
const id = (query.id ?? getWidgetId()) as string
const formData = reactive({
  isPublishLoading: false,

  showProcessResult: false,
  doc: {} as Post,
  errCount: 0,
  successBatchResults: <any[]>[],
  failBatchResults: <any[]>[],

  dynList: <string[]>[],
})

const handlePublish = async () => {
  try {
    formData.isPublishLoading = true
    if (formData.dynList.length === 0) {
      throw new Error("必须选择一个分发平台")
    }

    formData.errCount = 0
    formData.failBatchResults = []
    formData.successBatchResults = []
    for (const key of formData.dynList) {
      const batchResult = await doSinglePublish(key, id, formData.doc)
      if (batchResult.status) {
        formData.successBatchResults.push(batchResult)
      } else {
        formData.failBatchResults.push(batchResult)
        formData.errCount++
      }
    }

    formData.showProcessResult = true
    if (formData.errCount === 0) {
      ElMessage.success("多平台文章分发成功")
    } else {
      ElMessage.error(`多平台文章分发失败，失败个数：${formData.errCount}`)
    }
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    formData.isPublishLoading = false
  }
}

const syncDynList = (selectedKeys: string[]) => {
  formData.dynList = selectedKeys
}

onMounted(async () => {
  logger.info("获取到的ID为=>", id)
  // 思源笔记原始文章数据
  formData.doc = await blogApi.getPost(id)
})
</script>

<template>
  <div id="publish-index">
    <el-container>
      <el-main>
        <!-- 提示 -->
        <publish-tips />

        <div
          :class="formData.errCount > 0 ? 'batch-result fail-tips' : 'batch-result success-tips'"
          v-if="formData.showProcessResult"
        >
          <div class="error-total-msg">
            错误平台个数 [{{ formData.errCount }}] ，选择的总平台数 [{{ formData.dynList.length }}] 。
          </div>
          <div v-for="errRet in formData.failBatchResults">
            [{{ errRet.key }}] [{{ errRet.name }}] {{ errRet.errMsg }}
          </div>
          <div v-if="formData.successBatchResults.length > 0" class="success-result success-tips">
            已分发成功的结果如下：
            <p v-for="ret in formData.successBatchResults">
              <span class="platform">[{{ ret.key }}] [{{ ret.name }}]</span>
              ，
              <a :href="ret.previewUrl" target="_blank">查看文章</a>
            </p>
          </div>
        </div>

        <!-- 表单数据 -->
        <div class="publish-form">
          <el-form label-width="100px">
            <!-- 文章标题 -->
            <div class="form-post-title">
              <el-form-item :label="t('main.title')">
                <el-input v-model="formData.doc.title" />
              </el-form-item>
            </div>
            <el-divider border-style="dashed" />

            <!-- 分发平台 -->
            <publish-platform @emitSyncDynList="syncDynList" />
            <el-divider border-style="dashed" />

            <!--
            ----------------------------------------------------------------------
            -->
            <!-- 标签
            <publish-tags />
            -->

            <!-- 发布 -->
            <el-form-item>
              <el-button type="primary" :loading="formData.isPublishLoading" @click="handlePublish">
                {{ t("main.publish") }}
              </el-button>
              <el-button>{{ t("main.cancel") }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="stylus" scoped>
.batch-result
  margin 16px 0
  font-size 14px
  .platform
    color var(--el-color-info)

.error-total-msg
  margin 10px 0

.success-result
  margin-top 10px

.success-tips
  color var(--el-color-success)
.fail-tips
  color var(--el-color-error)
</style>
