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
import { useRoute } from "vue-router"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { StrUtil } from "zhi-common"
import { usePublish } from "~/src/composables/usePublish.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"

const logger = createAppLogger("quick-publish-worker")

// uses
const route = useRoute()
const { singleFormData, doSinglePublish } = usePublish()
const { blogApi } = useSiyuanApi()
const { getPublishCfg } = usePublishConfig()

// datas
const params = reactive(route.params)
const key = params.key as string
const id = params.id as string

const formData = reactive({
  processResult: {} as any,
})

onMounted(async () => {
  singleFormData.isPublishLoading = true
  setTimeout(async () => {
    logger.info("单个快速发布开始")
    // 思源笔记原始文章数据
    const siyuanPost = await blogApi.getPost(id)
    // 初始化属性
    const publishCfg = await getPublishCfg(key)
    formData.processResult = await doSinglePublish(key, id, publishCfg, siyuanPost)
    logger.info("单个快速发布结束")
    singleFormData.isPublishLoading = false
  }, 200)
})
</script>

<template>
  <div id="quick-publish-box">
    <div class="publish-tips">
      <div v-if="singleFormData.isPublishLoading" class="is-loading info-tips">
        <i class="el-icon is-loading"
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
            ></path></svg
        ></i>
        发布中，请稍后...：
      </div>
      <div v-else-if="singleFormData.publishProcessStatus" class="success-tips">
        {{ singleFormData.isAdd ? "发布到" : "更新文章到" }}
        [{{ formData.processResult.key }}]
        {{ StrUtil.isEmptyString(formData.processResult.name) ? "" : `[${formData.processResult.name}]` }}
        成功，
        <a :href="formData.processResult.previewUrl" target="_blank">查看文章</a>
      </div>
      <div v-else class="fail-tips">
        {{ singleFormData.isAdd ? "发布到" : "更新文章到" }} [{{ formData.processResult.key }}]
        {{ StrUtil.isEmptyString(formData.processResult.name) ? "" : `[${formData.processResult.name}]` }}
        失败！
      </div>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.top-tip
  margin 10px 0
  padding-left 0
#quick-publish-box
  .publish-tips
    margin 10px
    margin-top 8px
    font-size 14px
    .info-tips
      color var(--el-color-info)
      .is-loading
        vertical-align middle
        margin-top -4px
    .success-tips
      color var(--el-color-success)
    .fail-tips
      color var(--el-color-error)
</style>
