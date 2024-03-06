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
import { markRaw, onMounted, reactive, ref, toRaw } from "vue"
import { usePublish } from "~/src/composables/usePublish.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { ElMessage, ElMessageBox } from "element-plus"
import { StrUtil } from "zhi-common"
import { pre } from "~/src/platforms/pre.ts"
import { Delete } from "@element-plus/icons-vue"
import { BrowserUtil } from "zhi-device"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { PageEditMode, Post } from "zhi-blog-api"
import { IPublishCfg } from "~/src/types/IPublishCfg.ts"
import EditModeSelect from "~/src/components/publish/form/EditModeSelect.vue"
import PublishTime from "~/src/components/publish/form/PublishTime.vue"
import { ICategoryConfig } from "~/src/types/ICategoryConfig.ts"
import { SiyuanAttr } from "zhi-siyuan-api"
import { DistributionPattern } from "~/src/models/distributionPattern.ts"
import _ from "lodash-es"
import PublishTitle from "~/src/components/publish/form/PublishTitle.vue"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import { useLoadingTimer } from "~/src/composables/useLoadingTimer.ts"

const logger = createAppLogger("publisher-index")

// props
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
})

// uses
const { t } = useVueI18n()
const { doSinglePublish, doSingleDelete, doForceSingleDelete, initPublishMethods } = usePublish()
const { blogApi } = useSiyuanApi()
const { getPublishCfg } = usePublishConfig()
const { kernelApi } = useSiyuanApi()

// datas
const sysKeys = pre.systemCfg.map((item) => {
  return item.platformKey
})
const id = StrUtil.isEmptyString(props.id) ? process.env.VITE_DEV_PAGE_ID : props.id
const formData = reactive({
  isInit: false,

  // loading
  isPublishLoading: false,
  isDeleteLoading: false,

  // process
  showProcessResult: false,
  errCount: 0,
  successBatchResults: [] as any[],
  failBatchResults: [] as any[],

  // 单个平台信息
  siyuanPost: {} as Post,
  publishCfg: {} as IPublishCfg,

  // 分类配置
  categoryConfig: {} as ICategoryConfig,

  // =========================
  // extra sync attrs start
  // =========================
  // AI开关
  useAi: false,

  // 平台列表
  dynList: <string[]>[],

  // 页面模式
  editType: PageEditMode.EditMode_simple,
  // =========================
  // sync attrs end
  // =========================

  distriPattern: DistributionPattern.Merge,
  actionEnable: true,
})

const handlePublish = async () => {
  try {
    formData.isPublishLoading = true
    isTimerInit.value = false

    if (formData.dynList.length === 0) {
      throw new Error("必须选择一个分发平台")
    }

    formData.errCount = 0
    formData.failBatchResults = []
    formData.successBatchResults = []

    // 思源笔记原始文章数据
    const siyuanPost = _.cloneDeep(formData.siyuanPost) as Post
    for (const key of formData.dynList) {
      let batchItemPost: Post
      if (sysKeys.includes(key)) {
        logger.info(`开始发布 [${key}] 系统内置平台`)
        batchItemPost = siyuanPost
      } else {
        logger.info(`开始发布 [${key}] 自定义平台`)
        // 平台相关的配置，需要各自重新获取
        const publishCfg = await getPublishCfg(key)
        formData.publishCfg = publishCfg

        // 平台相关的元数据初始化
        batchItemPost = await initPublishMethods.assignInitAttrs(siyuanPost, id, formData.publishCfg)

        // 合并属性
        if (formData.distriPattern === DistributionPattern.Override) {
          batchItemPost = initPublishMethods.doOverideBatchPost(siyuanPost, batchItemPost)
          logger.debug("批量分发模式文章已覆盖", {
            siyuanPost: toRaw(siyuanPost),
            mergedPost: toRaw(batchItemPost),
          })
        } else {
          batchItemPost = initPublishMethods.doMergeBatchPost(siyuanPost, batchItemPost)
          logger.debug("批量分发模式文章已合并", {
            siyuanPost: toRaw(siyuanPost),
            mergedPost: toRaw(batchItemPost),
          })
        }
      }

      const batchResult = await doSinglePublish(key, id, formData.publishCfg, batchItemPost)
      if (batchResult.status) {
        formData.successBatchResults.push(batchResult)
      } else {
        formData.failBatchResults.push(batchResult)
        formData.errCount++
      }
    }

    // 需要刷新才能继续操作，防止重复提交
    formData.actionEnable = false
    formData.showProcessResult = true
    if (formData.errCount === 0) {
      ElMessage.success("多平台文章分发成功")
    } else {
      ElMessage.error(`多平台文章分发失败，失败个数：${formData.errCount}`)
    }
  } catch (e) {
    const errMsg = t("main.opt.failure") + "=>" + e
    logger.error(t("main.opt.failure") + "=>", e)
    await kernelApi.pushErrMsg({
      msg: errMsg,
      timeout: 7000,
    })
  } finally {
    formData.isPublishLoading = false
    isTimerInit.value = true
  }
}

const handleDelete = async () => {
  ElMessageBox.confirm(
    `确认要删除平台 ${formData.dynList.join(
      "、"
    )} 下的这篇文章吗，此平台文章数据也将永久删除 [注意：系统内置平台会忽略，不做删除] ？`,
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
    if (formData.dynList.length === 0) {
      throw new Error("必须选择一个分发平台")
    }

    formData.errCount = 0
    formData.failBatchResults = []
    formData.successBatchResults = []
    for (const key of formData.dynList) {
      if (sysKeys.includes(key)) {
        logger.info(`[${key}] 系统内置平台，不可删除，跳过`)
        continue
      }
      // 初始化属性
      const publishCfg = await getPublishCfg(key)
      formData.publishCfg = publishCfg
      const batchResult = await doSingleDelete(key, id, publishCfg)
      if (!batchResult.status) {
        formData.failBatchResults.push(batchResult)
        formData.errCount++
      }
    }

    // 需要刷新才能继续操作，防止重复提交
    formData.actionEnable = false
    formData.showProcessResult = true
    if (formData.errCount === 0) {
      ElMessage.success("多平台文章删除成功")
    } else {
      ElMessage.error(`多平台文章删除失败，失败个数：${formData.errCount}`)
    }
  } catch (e) {
    const errMsg = t("main.opt.failure") + "=>" + e
    logger.error(t("main.opt.failure") + "=>", e)
    await kernelApi.pushErrMsg({
      msg: errMsg,
      timeout: 7000,
    })
  } finally {
    formData.isDeleteLoading = false
  }
}

const handleForceDelete = async (key: string, id: string, publishCfg: IPublishCfg) => {
  try {
    await doForceSingleDelete(key, id, publishCfg)
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    formData.isDeleteLoading = false
  }
}

const handleSyncToSiyuan = async () => {
  const newAttrs = {
    [SiyuanAttr.Sys_memo]: formData.siyuanPost.shortDesc,
    [SiyuanAttr.Sys_tags]: formData.siyuanPost.mt_keywords,
    [SiyuanAttr.Custom_categories]: formData.siyuanPost.categories.join(","),
  }
  await kernelApi.setBlockAttrs(id, newAttrs)
  logger.info("内置平台，保存属性", newAttrs)
  ElMessage.success("属性已经成功同步到思源")
}

const syncAiSwitch = (val: boolean) => {
  formData.useAi = val
  logger.debug(`syncAiSwitch in batch publish => ${formData.useAi}`)
}

const syncPublishTitle = (val: string) => {
  formData.siyuanPost.title = val
  logger.debug("syncPublishTitle in batch publish")
}

const syncEditMode = async (val: PageEditMode) => {
  formData.editType = val
  logger.debug("syncEditMode in batch publish")
}

const syncDynList = (selectedKeys: string[]) => {
  formData.dynList = selectedKeys
  logger.debug("syncDynList in batch publish")
}

const syncDesc = (val: string) => {
  formData.siyuanPost.shortDesc = val
  formData.siyuanPost.mt_text_more = val
  formData.siyuanPost.mt_excerpt = val
  logger.debug("syncDesc in batch publish")
}

const syncTags = (val: string[]) => {
  formData.siyuanPost.mt_keywords = val?.join(",")
  logger.debug("syncTags in batch publish")
}

const syncCates = (cates: string[]) => {
  formData.siyuanPost.categories = cates
  logger.debug("syncCates in batch publish")
}

const syncPublishTime = (val1: Date, val2: Date) => {
  formData.siyuanPost.dateCreated = val1
  formData.siyuanPost.dateUpdated = val2
  logger.debug("syncPublishTime in batch publish")
}

const handleRefresh = () => {
  BrowserUtil.reloadPage()
}

const checkChatGPTEnabled = () => {
  let flag = false
  let attempts = 0

  while (!flag && attempts < 3) {
    try {
      useChatGPT()
      flag = true
    } catch (e) {
      logger.error(`${t("main.opt.failure")} => ${e}`)
      attempts++
    }
  }

  logger.info(`第${attempts}次尝试就检测AI状态: ${flag}`)
  return flag
}

// 计时器
const isTimerInit = ref(false)
const { loadingTime } = useLoadingTimer(isTimerInit)

onMounted(async () => {
  // ==================
  // 初始化开始
  // ==================
  // 初始化属性
  formData.publishCfg = await getPublishCfg()
  // 思源笔记原始文章数据
  const siyuanPost = await blogApi.getPost(id)
  // 元数据初始化
  formData.siyuanPost = await initPublishMethods.assignInitSlug(siyuanPost, id, formData.publishCfg)
  logger.debug("batch inited siyuanPost =>", toRaw(formData.siyuanPost))
  // ==================
  // 初始化结束
  // ==================

  // 这里可以控制一些功能开关
  formData.useAi = checkChatGPTEnabled()
  formData.editType = PageEditMode.EditMode_simple

  formData.isInit = true
  isTimerInit.value = true
})
</script>

<template>
  <div id="batch-publish-index">
    <el-container>
      <el-skeleton v-if="!formData.isInit" class="placeholder" :rows="12" animated style="padding: 40px 12px" />
      <el-main v-else>
        <!-- 显示加载计时器 -->
        <loading-timer :loading-time="loadingTime" />

        <!-- 提示 -->
        <publish-tips />

        <!-- 批处理结果 -->
        <div
          :class="formData.errCount > 0 ? 'batch-result fail-tips' : 'batch-result success-tips'"
          v-if="formData.showProcessResult"
        >
          <div class="error-total-msg">
            错误平台个数 [{{ formData.errCount }}] ，选择的总平台数 [{{ formData.dynList.length }}] 。
            <a class="refresh-page" @click="handleRefresh">刷新页面</a>
          </div>
          <div v-for="errRet in formData.failBatchResults">
            [{{ errRet.key }}] {{ StrUtil.isEmptyString(errRet.name) ? "" : `[${errRet.name}]` }} {{ errRet.errMsg }}
            <a
              href="javascript:void(0)"
              @click="handleForceDelete(errRet.key, props.id, formData.publishCfg as IPublishCfg)"
              >强制解除关联</a
            >
          </div>
          <div v-if="formData.successBatchResults.length > 0" class="success-result success-tips">
            已分发成功的结果如下：
            <p v-for="ret in formData.successBatchResults">
              <span class="platform">[{{ ret.key }}] {{ StrUtil.isEmptyString(ret.name) ? "" : `[${ret.name}]` }}</span>
              ，
              <a :href="ret.previewUrl" target="_blank">查看文章</a>
            </p>
          </div>
        </div>

        <!-- 表单数据 -->
        <div class="publish-form">
          <el-form label-width="100px">
            <el-alert
              v-if="formData.useAi"
              class="top-tip"
              :title="t('category.ai.enabled')"
              type="success"
              :closable="true"
            />
            <!-- 编辑模式选择 -->
            <edit-mode-select v-model:edit-type="formData.editType" @emitSyncEditMode="syncEditMode" />

            <!--
            --------------------------------------
            编辑模式开始
            --------------------------------------
            -->
            <source-mode
              v-if="formData.editType === PageEditMode.EditMode_source"
              v-model="formData.siyuanPost"
              :page-id="id"
            />
            <div v-else class="normal-mode">
              <!-- 文章标题 -->
              <publish-title
                v-model:use-ai="formData.useAi"
                v-model="formData.siyuanPost.title"
                @emitSyncPublishTitle="syncPublishTitle"
                v-model:md="formData.siyuanPost.markdown"
                v-model:html="formData.siyuanPost.html"
              />

              <!-- 分发模式 -->
              <div class="distri-type">
                <el-form-item label="分发模式">
                  <el-radio-group v-model="formData.distriPattern" class="ml-4 distri-type-check">
                    <el-radio :value="DistributionPattern.Override" size="large">覆盖</el-radio>
                    <el-radio :value="DistributionPattern.Merge" size="large">合并</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item class="distri-tip">
                  <el-alert
                    v-if="formData.distriPattern === DistributionPattern.Override"
                    :closable="false"
                    :title="t('distri.type.overide.warn')"
                    class="distri-tip-alert"
                    type="error"
                  />
                  <el-alert
                    v-else
                    :closable="false"
                    :title="t('distri.type.merge.warn')"
                    class="distri-tip-alert"
                    type="warning"
                  />
                </el-form-item>
              </div>
              <el-divider border-style="dashed" />

              <div v-if="formData.editType === PageEditMode.EditMode_complex" class="complex-mode">
                <!-- AI开关 -->
                <!--
                <ai-switch v-if="formData.useAi" v-model:use-ai="formData.useAi" @emitSyncAiSwitch="syncAiSwitch" />
                -->

                <!-- 别名 -->
                <el-form-item :label="t('main.slug')">
                  <el-input v-model="formData.siyuanPost.wp_slug" :disabled="true" />
                </el-form-item>

                <!-- 摘要 -->
                <publish-description
                  v-model:use-ai="formData.useAi"
                  v-model:page-id="id"
                  v-model:desc="formData.siyuanPost.shortDesc"
                  v-model:md="formData.siyuanPost.markdown"
                  v-model:html="formData.siyuanPost.html"
                  @emitSyncDesc="syncDesc"
                />

                <!-- 标签 -->
                <publish-tags
                  v-model:use-ai="formData.useAi"
                  v-model:page-id="id"
                  v-model:tags="formData.siyuanPost.mt_keywords"
                  v-model:md="formData.siyuanPost.markdown"
                  v-model:html="formData.siyuanPost.html"
                  @emitSyncTags="syncTags"
                />

                <!-- 公共分类 -->
                <common-categories
                  v-model:use-ai="formData.useAi"
                  v-model:cates="formData.siyuanPost.categories"
                  @emitSyncCates="syncCates"
                  v-model:md="formData.siyuanPost.markdown"
                  v-model:html="formData.siyuanPost.html"
                />

                <!-- 发布时间 -->
                <publish-time v-model="formData.siyuanPost" @emitSyncPublishTime="syncPublishTime" />

                <el-divider border-style="dashed" />
              </div>
            </div>
            <!--
            --------------------------------------
            编辑模式结束
            --------------------------------------
            -->

            <!-- 分发平台 -->
            <publish-platform :id="props.id" @emitSyncDynList="syncDynList" />
            <el-divider border-style="dashed" />

            <!-- 发布 -->
            <el-form-item label-width="100px" class="form-action">
              <el-button
                type="primary"
                :loading="formData.isPublishLoading"
                @click="handlePublish"
                :disabled="!formData.actionEnable"
              >
                {{ t("main.publish.start") }}
              </el-button>
              <el-button
                type="danger"
                :loading="formData.isDeleteLoading"
                @click="handleDelete"
                :disabled="!formData.actionEnable"
                class="btn-rm-action"
              >
                {{ t("main.publish.remove") }}
              </el-button>
              <el-button type="warning" @click="handleSyncToSiyuan" :disabled="!formData.actionEnable">
                同步修改到思源笔记
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="stylus" scoped>
.top-tip
  margin 10px 0
  padding 6px 0
  padding-top 8px

.batch-result
  margin 16px 0
  font-size 14px

  .platform
    color var(--el-color-info)

:deep(.form-action .el-form-item__content)
  margin-left 0 !important

.error-total-msg
  margin 10px 0

.success-result
  margin-top 10px

.success-tips
  color var(--el-color-success)

.fail-tips
  color var(--el-color-error)

.refresh-page
  cursor pointer

.distri-type
  :deep(.el-form-item)
    margin-bottom -16px

.distri-type-check
  margin-top -3px

.distri-tip
  margin-top 10px

  .distri-tip-alert
    margin 10px 0
    padding: 2px 0
</style>
