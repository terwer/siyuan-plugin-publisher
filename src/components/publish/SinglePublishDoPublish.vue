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
import { markRaw, onMounted, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import BackPage from "~/src/components/common/BackPage.vue"
import { usePublish } from "~/src/composables/usePublish.ts"
import { MethodEnum } from "~/src/models/methodEnum.ts"
import { Post } from "zhi-blog-api"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { ElMessage, ElMessageBox } from "element-plus"
import { Delete } from "@element-plus/icons-vue"
import { BrowserUtil } from "zhi-device"
import { StrUtil } from "zhi-common"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { IPublishCfg } from "~/src/types/IPublishCfg.ts"

const logger = createAppLogger("single-publish-do-publish")

// uses
const { t } = useVueI18n()
const route = useRoute()
const { doInitPage } = usePublish()
const { query } = useRoute()
const { kernelApi } = useSiyuanApi()
const { doSinglePublish, doSingleDelete } = usePublish()
const router = useRouter()
const { getPublishCfg } = usePublishConfig()

// datas
const params = reactive(route.params)
const key = params.key as string
const id = params.id as string

const formData = reactive({
  isInit: false,

  method: query.method as MethodEnum,
  isPublishLoading: false,
  isDeleteLoading: false,

  publishCfg: {} as IPublishCfg,

  siyuanPost: {} as Post,
  platformPost: {} as Post,
  mergedPost: {} as Post,

  postPreviewUrl: "",

  changeTips: {
    title: "",
  },

  actionEnable: true,
})

const handlePublish = async () => {
  try {
    formData.isPublishLoading = true
    formData.actionEnable = false

    logger.info("单个常规发布开始")
    const processResult = await doSinglePublish(key, id, formData.publishCfg as IPublishCfg, formData.mergedPost)
    logger.info("normal publish processResult =>", processResult)
    logger.info("单个常规发布结束")

    if (processResult.status) {
      // 刷新页面
      // 如果是发布并且发布成功
      if (formData.method === MethodEnum.METHOD_ADD) {
        formData.method = MethodEnum.METHOD_EDIT
        window.location.href = BrowserUtil.setUrlParameter(window.location.href, "method", formData.method)
        // 因为hash的原因，需要再刷新一次
        window.location.reload()
      } else {
        // 需要刷新才能继续操作，防止重复提交
        formData.isInit = false
        await initPage()
        formData.isInit = true
      }
    } else {
      ElMessage.error(processResult.errMsg)
      logger.error(processResult.errMsg)
    }

    formData.actionEnable = true
  } catch (e) {
    ElMessage.error(e.message)
    logger.error(t("main.opt.failure") + "=>", e)
  } finally {
    formData.isPublishLoading = false
  }
}

const handleDelete = async () => {
  const platformName = getPlatformName()
  const blogName = getBlogName()
  ElMessageBox.confirm(
    `确认要删除 [${platformName} - ${blogName}] 下的这篇文章吗，此平台的文章数据将永久删除 ？`,
    "温馨提示",
    {
      type: "error",
      icon: markRaw(Delete),
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
    }
  )
    .then(async () => {
      await doDelete()
    })
    .catch(() => {})
}

const doDelete = async () => {
  try {
    formData.isDeleteLoading = true
    formData.actionEnable = false

    const processResult = await doSingleDelete(key, id, formData.publishCfg as IPublishCfg)
    if (processResult.status) {
      // 刷新页面
      const platformName = getPlatformName()
      const blogName = getBlogName()
      ElMessage.success(`[${platformName} - ${blogName}] 文章删除成功`)

      // 如果是发布并且发布成功
      setTimeout(() => {
        formData.method = MethodEnum.METHOD_ADD
        window.location.href = BrowserUtil.setUrlParameter(window.location.href, "method", formData.method)
        // 因为hash的原因，需要再刷新一次
        window.location.reload()
      }, 200)
    } else {
      ElMessage.error(processResult.errMsg)
      logger.error(processResult.errMsg)
    }
  } catch (e) {
    ElMessage.error(e.message)
    logger.error(t("main.opt.failure") + "=>", e)
  } finally {
    formData.isDeleteLoading = false
  }
}

const getPlatformName = () => {
  const dynCfg = formData.publishCfg?.dynCfg as DynamicConfig
  return dynCfg?.platformName || ""
}

const getBlogName = () => {
  const cfg = formData.publishCfg?.cfg as any
  return cfg?.blogName || ""
}

const getTitle = () => {
  const platformName = getPlatformName()
  const blogName = getBlogName()

  let title = "当前操作的平台为 - "
  title += platformName ? platformName : key
  if (blogName) {
    title += " - " + blogName
  }

  return title
}

const showChangeTip = (v1: string, v2: string) => {
  if (StrUtil.isEmptyString(v2)) {
    return ""
  }
  return `系统标题为 [${v1}] ， 已在远程平台被修改为 [${v2}]`
}

const refreshChangeTips = () => {
  formData.changeTips.title = showChangeTip(formData.siyuanPost.title, formData.platformPost.title)
}

const initPage = async () => {
  try {
    // 初始化属性
    formData.publishCfg = await getPublishCfg(key)
    const { siyuanPost, platformPost, mergedPost, postPreviewUrl } = await doInitPage(
      key,
      id,
      formData.method,
      formData.publishCfg as IPublishCfg
    )

    // 文章元数据
    formData.siyuanPost = siyuanPost
    formData.platformPost = platformPost
    formData.mergedPost = mergedPost

    formData.postPreviewUrl = postPreviewUrl

    // 刷新比对提示
    refreshChangeTips()
  } catch (e) {
    const errMsg = t("main.opt.failure") + "=>" + e
    logger.error(t("main.opt.failure") + "=>", e)
    await kernelApi.pushErrMsg({
      msg: errMsg,
      timeout: 7000,
    })
    throw e
  }
}

const onBack = () => {
  const path = `/publish/singlePublish`
  logger.info("will go to =>", path)
  const query = {
    path: path,
    query: {
      id: id,
    },
  }
  router.push(query)
}

onMounted(async () => {
  logger.info("获取到的ID为=>", id)

  await initPage()
  formData.isInit = true
})
</script>

<template>
  <back-page title="常规发布" :has-back-emit="true" @backEmit="onBack">
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
                  v-if="
                    formData.method === MethodEnum.METHOD_EDIT &&
                    !StrUtil.isEmptyString(formData.changeTips.title) &&
                    formData.siyuanPost.title !== formData.platformPost.title
                  "
                  class="top-tip"
                  :title="formData.changeTips.title"
                  type="error"
                  :closable="false"
                />
              </div>
              <el-divider border-style="dashed" />

              <!--
             ----------------------------------------------------------------------
             -->
              <!-- 标签
              <publish-tags />
              -->

              <!-- 发布 -->
              <el-form-item label-width="100px" class="form-action">
                <el-button
                  type="primary"
                  :loading="formData.isPublishLoading"
                  @click="handlePublish"
                  :disabled="!formData.actionEnable"
                >
                  {{ formData.method === MethodEnum.METHOD_ADD ? t("main.publish") : t("main.update") }}
                </el-button>
                <el-button
                  v-if="formData.method === MethodEnum.METHOD_EDIT"
                  type="danger"
                  :loading="formData.isDeleteLoading"
                  @click="handleDelete"
                  :disabled="!formData.actionEnable"
                  class="btn-rm-action"
                >
                  {{ t("main.cancel") }}
                </el-button>
              </el-form-item>

              <!-- 文章状态 -->
              <el-form-item>
                <el-button :type="formData.method === MethodEnum.METHOD_EDIT ? 'success' : 'danger'" text disabled>
                  {{
                    formData.method === MethodEnum.METHOD_EDIT
                      ? t("main.publish.status.published")
                      : t("main.publish.status.unpublish")
                  }}
                </el-button>
                <a
                  v-if="formData.method === MethodEnum.METHOD_EDIT"
                  :href="formData.postPreviewUrl"
                  :title="formData.postPreviewUrl"
                  target="_blank"
                  >{{ t("main.publish.see.preview") }}</a
                >
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
