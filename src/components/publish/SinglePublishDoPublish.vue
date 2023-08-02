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
import BackPage from "~/src/components/common/BackPage.vue"
import { usePublish } from "~/src/composables/usePublish.ts"
import { MethodEnum } from "~/src/models/methodEnum.ts"
import { Post } from "zhi-blog-api"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { pre } from "~/src/utils/import/pre.ts"
import { DynamicConfig } from "~/src/components/set/publish/platform/dynamicConfig.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"

const logger = createAppLogger("single-publish-do-publish")

// uses
const { t } = useVueI18n()
const route = useRoute()
const { doInitPage } = usePublish()
const { query } = useRoute()
const { kernelApi, blogApi } = useSiyuanApi()

// datas
const sysKeys = pre.systemCfg.map((item) => {
  return item.platformKey
})
const params = reactive(route.params)
const key = params.key as string
const id = params.id as string
const method = query.method as MethodEnum

const dynList = sysKeys.concat(key)
const formData = reactive({
  isInit: false,
  isPublishLoading: false,
  isDeleteLoading: false,

  siyuanPost: {} as Post,
  platformPost: {} as Post,
  mergedPost: {} as Post,

  singleFormData: {} as any,
  actionEnable: true,
})

const handlePublish = async () => {}

const handleDelete = async () => {}

const getTitle = () => {
  const dynCfg = formData.singleFormData?.dynCfg as DynamicConfig
  const cfg = formData.singleFormData?.cfg as any
  const platformName = dynCfg?.platformName || ""
  const blogName = cfg?.blogName || ""

  let title = "当前操作的平台为 - "
  title += platformName ? platformName : key
  if (blogName) {
    title += " - " + blogName
  }

  return title
}

const showChangeTip = (v1: string, v2: string) => {
  return `系统标题为 [${v1}] ， 已在远程平台被修改为 [${v2}]`
}

onMounted(async () => {
  logger.info("获取到的ID为=>", id)
  try {
    formData.singleFormData = await doInitPage(key, id, method)

    formData.siyuanPost = formData.singleFormData.siyuanPost
    formData.platformPost = formData.singleFormData.platformPost
    formData.mergedPost = formData.singleFormData.mergedPost
  } catch (e) {
    const errMsg = t("main.opt.failure") + "=>" + e
    logger.error(errMsg)
    await kernelApi.pushErrMsg({
      msg: errMsg,
      timeout: 7000,
    })
  }

  formData.isInit = true
})
</script>

<template>
  <back-page title="常规发布">
    <el-skeleton class="placeholder" v-if="!formData.isInit" :rows="5" animated />
    <div v-else id="batch-publish-index">
      <el-alert class="top-tip" :title="getTitle()" type="info" :closable="false" />
      <el-container>
        <el-main>
          <!-- 表单数据 -->
          <div class="publish-form">
            <el-form label-width="100px">
              <!-- 文章标题 -->
              <div class="form-post-title">
                <el-form-item :label="t('main.title')">
                  <el-input v-model="formData.mergedPost.title" />
                </el-form-item>
                <el-alert
                  v-if="method === MethodEnum.METHOD_EDIT && formData.siyuanPost.title !== formData.platformPost.title"
                  class="top-tip"
                  :title="showChangeTip(formData.siyuanPost.title, formData.platformPost.title)"
                  type="error"
                  :closable="false"
                />
              </div>
              <el-divider border-style="dashed" />

              <!--
             ----------------------------------------------------------------------
             -->
              <!-- 标签 -->
              <publish-tags />

              <!-- 发布 -->
              <el-form-item label-width="100px" class="form-action">
                <el-button
                  type="primary"
                  :loading="formData.isPublishLoading"
                  @click="handlePublish"
                  :disabled="!formData.actionEnable"
                >
                  {{ t("main.publish") }}
                </el-button>
                <el-button
                  type="danger"
                  :loading="formData.isDeleteLoading"
                  @click="handleDelete"
                  :disabled="!formData.actionEnable"
                  class="btn-rm-action"
                >
                  {{ t("main.cancel") }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-main>
      </el-container>
    </div>
  </back-page>
</template>

<style scoped lang="stylus">
.placeholder
  margin-top 10px
.top-tip
  margin-top 10px
  padding-left 0
</style>
