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
import { computed, markRaw, onMounted, reactive, ref, toRaw } from "vue"
import { useRoute, useRouter } from "vue-router"
import BackPage from "~/src/components/common/BackPage.vue"
import { usePublish } from "~/src/composables/usePublish.ts"
import { MethodEnum } from "~/src/models/methodEnum.ts"
import { BlogConfig, PageEditMode, Post } from "zhi-blog-api"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { DynamicConfig, getDynYamlKey } from "~/src/platforms/dynamicConfig.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { ElMessage, ElMessageBox } from "element-plus"
import { Delete } from "@element-plus/icons-vue"
import { BrowserUtil } from "zhi-device"
import { StrUtil } from "zhi-common"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { IPublishCfg } from "~/src/types/IPublishCfg.ts"
import EditModeSelect from "~/src/components/publish/form/EditModeSelect.vue"
import PublishTime from "~/src/components/publish/form/PublishTime.vue"
import { pre } from "~/src/platforms/pre.ts"
import { ICategoryConfig } from "~/src/types/ICategoryConfig.ts"
import PublishKnowledgeSpace from "~/src/components/publish/form/PublishKnowledgeSpace.vue"
import { SiyuanAttr } from "zhi-siyuan-api"
import PublishTitle from "~/src/components/publish/form/PublishTitle.vue"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import _ from "lodash-es"
import { useLoadingTimer } from "~/src/composables/useLoadingTimer.ts"
import CrossPageUtils from "~/cross/crossPageUtils.ts"
import { ITagConfig } from "~/src/types/ITagConfig.ts"

const logger = createAppLogger("single-publish-do-publish")

// uses
const { t } = useVueI18n()
const route = useRoute()
const { query } = useRoute()
const { kernelApi } = useSiyuanApi()
const { doSinglePublish, doSingleDelete, initPublishMethods, doForceSingleDelete } = usePublish()
const router = useRouter()
const { getPublishCfg } = usePublishConfig()

// datas
const sysKeys = pre.systemCfg.map((item) => {
  return item.platformKey
})
const params = reactive(route.params)
const key = params.key as string
const id = params.id as string

const formData = reactive({
  isInit: false,

  method: query.method as MethodEnum,
  isPublishLoading: false,
  isDeleteLoading: false,
  errMsg: "",

  // 单个平台信息
  siyuanPost: {} as Post,
  platformPost: {} as Post,
  mergedPost: {} as Post,
  publishCfg: {} as IPublishCfg,

  // 标签配置
  tagConfig: {} as ITagConfig,
  // 分类配置
  categoryConfig: {} as ICategoryConfig,
  // 知识空间配置
  knowledgeSpaceConfig: {} as ICategoryConfig,

  postPreviewUrl: "",

  // =========================
  // extra sync attrs start
  // =========================
  // AI开关
  useAi: false,

  // 页面模式
  editType: PageEditMode.EditMode_simple,
  // =========================
  // sync attrs end
  // =========================

  actionEnable: true,
})

const handlePublish = async () => {
  try {
    formData.isPublishLoading = true
    formData.actionEnable = false
    isTimerInit.value = false
    formData.errMsg = ""

    logger.info("保存到系统平台开始")
    for (const sysKey of sysKeys) {
      const sysPublishCfg = await getPublishCfg(sysKey)
      const siyuanPost = _.cloneDeep(formData.mergedPost) as Post
      await doSinglePublish(sysKey, id, sysPublishCfg, siyuanPost)
    }
    logger.info("保存到系统平台结束")

    logger.info("单个常规发布开始")
    formData.mergedPost.editMode = formData.editType
    const processResult = await doSinglePublish(key, id, formData.publishCfg as IPublishCfg, formData.mergedPost)
    logger.info("normal publish processResult =>", processResult)
    logger.info("单个常规发布结束")

    if (processResult.status) {
      // 如果是发布并且发布成功
      if (formData.method === MethodEnum.METHOD_ADD) {
        ElMessage.success("文章发布成功！如需编辑请重新打开")
      } else {
        formData.actionEnable = true
        ElMessage.success("文章更新成功！")
      }
    } else {
      formData.actionEnable = true
      logger.error(processResult.errMsg)
      formData.errMsg = processResult.errMsg
      ElMessage.error(processResult.errMsg)
    }
  } catch (e) {
    logger.error(t("main.opt.failure") + "=>", e)
    formData.errMsg = e.toString()
    ElMessage.error(e.toString())
  } finally {
    formData.isPublishLoading = false
    isTimerInit.value = true
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
    formData.errMsg = ""

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
      formData.actionEnable = true
      logger.error(processResult.errMsg)
      formData.errMsg = processResult.errMsg
      ElMessage.error(processResult.errMsg)
    }
  } catch (e) {
    logger.error(t("main.opt.failure") + "=>", e)
    formData.errMsg = e.toString()
    ElMessage.error(e.toString())
  } finally {
    formData.isDeleteLoading = false
  }
}

const handleForceDelete = async () => {
  try {
    formData.errMsg = ""

    await doForceSingleDelete(key, id, formData.publishCfg as IPublishCfg)
    const platformName = getPlatformName()
    const blogName = getBlogName()
    ElMessage.success(`[${platformName} - ${blogName}] 文章信息已强制删除`)

    // 如果是发布并且发布成功
    setTimeout(() => {
      formData.method = MethodEnum.METHOD_ADD
      window.location.href = BrowserUtil.setUrlParameter(window.location.href, "method", formData.method)
      // 因为hash的原因，需要再刷新一次
      window.location.reload()
    }, 200)
  } catch (error) {
    formData.errMsg = error.message
    ElMessage.error(error.message)
  } finally {
    formData.isDeleteLoading = false
  }
}

const handleSyncToSiyuan = async () => {
  await handleSyncSiyuanAttrToSiyuan()
  await handleSyncPlatformAttrToSiyuan()
  ElMessage.success("属性已经成功同步到思源")
}

const handleSyncSiyuanAttrToSiyuan = async () => {
  const newAttrs = {
    [SiyuanAttr.Sys_memo]: formData.mergedPost.shortDesc,
    [SiyuanAttr.Sys_tags]: formData.mergedPost.mt_keywords,
    [SiyuanAttr.Custom_categories]: formData.mergedPost?.categories?.join(",") ?? [],
  }
  await kernelApi.setBlockAttrs(id, newAttrs)
  logger.debug("保存内置平台属性", newAttrs)
}

const handleSyncPlatformAttrToSiyuan = async () => {
  const yaml = formData.mergedPost.yaml
  const yamlKey = getDynYamlKey(key)
  await kernelApi.setSingleBlockAttr(id, yamlKey, yaml)
  logger.debug("保存当前平台属性", { yaml: toRaw(yaml) })
}

const getPlatformName = () => {
  const dynCfg = formData.publishCfg?.dynCfg as DynamicConfig
  return dynCfg?.platformName || ""
}

const getBlogName = () => {
  const cfg = formData.publishCfg?.cfg as BlogConfig
  let blogName = cfg?.blogName || ""
  if (cfg?.knowledgeSpaceEnabled) {
    if (formData.mergedPost?.cate_slugs?.length > 0) {
      let cateName: string
      if (formData.mergedPost?.categories?.length > 0) {
        cateName = formData.mergedPost?.categories[0]
      } else {
        // cateName = formData.mergedPost?.cate_slugs[0]
        cateName = ""
      }
      blogName = cateName ?? ""
    }
  }
  return blogName
}

const topTitle = computed(() => {
  const platformName = getPlatformName()
  const blogName = getBlogName()

  let title = "当前操作的平台为 - "
  const platName = platformName ? platformName : key
  title += CrossPageUtils.longPlatformName(platName, 11)
  if (blogName) {
    title += " - " + blogName
  }

  return title
})

const syncEditMode = async (val: PageEditMode) => {
  formData.editType = val
  logger.debug("syncEditMode in single publish")
}

const syncAiSwitch = (val: boolean) => {
  formData.useAi = val
  logger.debug(`syncAiSwitch in single publish => ${formData.useAi}`)
}

const syncPublishTitle = (val: string) => {
  formData.mergedPost.title = val
  logger.debug("syncPublishTitle in single publish")
}

const syncDesc = (val: string) => {
  formData.mergedPost.shortDesc = val
  formData.mergedPost.mt_text_more = val
  formData.mergedPost.mt_excerpt = val
  logger.debug("syncDesc in single publish")
}

const syncTags = (val: string[]) => {
  formData.mergedPost.mt_keywords = val?.join(",")
  logger.debug("syncTags in single publish")
}

const syncTagSlugs = (val: string[]) => {
  formData.mergedPost.tags_slugs = val?.join(",")
  logger.debug("syncTagSlugs in single publish")
}

const syncCates = (cates: string[]) => {
  formData.mergedPost.categories = cates
  logger.debug("syncCates in single publish")
}

const syncCateSlugs = (cateSlugs: string[]) => {
  formData.mergedPost.cate_slugs = cateSlugs
  logger.debug("syncCateSlugs in single publish")
}

const syncPublishTime = (val1: Date, val2: Date) => {
  formData.mergedPost.dateCreated = val1
  formData.mergedPost.dateUpdated = val2
  logger.debug("syncPublishTime in single publish")
}

const syncPost = (post: Post) => {
  formData.mergedPost = post
  logger.debug("syncPost in single publish")
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

const initPage = async () => {
  try {
    // 初始化单篇文章
    const { mergedPost, postPreviewUrl } = await initPublishMethods.doInitSinglePage(
      key,
      id,
      formData.method,
      formData.publishCfg as IPublishCfg
    )

    // 文章元数据
    formData.mergedPost = mergedPost

    // 预览链接
    formData.postPreviewUrl = postPreviewUrl
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
  logger.info("获取到的ID为=>", id)
  try {
    // ==================
    // 初始化开始
    // ==================
    // 初始化属性
    formData.publishCfg = await getPublishCfg(key)
    // 单篇文章初始化
    await initPage()
    // 元数据初始化
    formData.mergedPost = await initPublishMethods.assignInitAttrs(formData.mergedPost, id, formData.publishCfg)

    const cfg = formData.publishCfg.cfg as BlogConfig
    // 标签数据初始化
    formData.tagConfig = {
      apiType: key,
      cfg: cfg,
    }
    // 分类数据初始化
    formData.categoryConfig = {
      cateEnabled: cfg.cateEnabled,
      readonlyMode: formData.method === MethodEnum.METHOD_EDIT && !cfg.allowCateChange,
      readonlyModeTip: cfg?.placeholder?.cateReadonlyModeTip,
      apiType: key,
      cfg: cfg,
    }
    // 知识空间
    formData.knowledgeSpaceConfig = {
      cateEnabled: cfg.knowledgeSpaceEnabled,
      readonlyMode: formData.method === MethodEnum.METHOD_EDIT && !cfg.allowKnowledgeSpaceChange,
      readonlyModeTip: cfg?.placeholder?.knowledgeSpaceReadonlyModeTip,
      apiType: key,
      cfg: cfg,
    }

    logger.debug("single publish inited mergedPost =>", toRaw(formData.mergedPost))
    // ==================
    // 初始化结束
    // ==================

    // 这里可以控制一些功能开关
    formData.useAi = checkChatGPTEnabled()
    formData.editType = PageEditMode.EditMode_simple
  } catch (e) {
    const errMsg = t("main.opt.failure") + "=>" + e
    logger.error(t("main.opt.failure") + "=>", e)
    await kernelApi.pushErrMsg({
      msg: errMsg,
      timeout: 7000,
    })
  } finally {
    formData.isInit = true
    isTimerInit.value = true
  }
})
</script>

<template>
  <back-page title="常规发布" :has-back-emit="true" @backEmit="onBack">
    <el-skeleton class="placeholder" v-if="!formData.isInit" :rows="5" animated />
    <div v-else id="batch-publish-index">
      <!-- 显示加载计时器 -->
      <loading-timer :loading-time="loadingTime" />
      <el-alert class="top-tip" :title="topTitle" type="info" :closable="false" />
      <el-alert
        v-if="formData.useAi"
        class="top-tip"
        :title="t('category.ai.enabled')"
        type="success"
        :closable="true"
      />
      <el-alert
        v-if="!StrUtil.isEmptyString(formData.errMsg)"
        class="top-tip"
        :title="formData.errMsg"
        type="error"
        :closable="true"
      />
      <el-container>
        <el-main>
          <!-- 表单数据 -->
          <div class="publish-form">
            <el-form label-width="100px">
              <!-- 编辑模式选择 -->
              <edit-mode-select v-model:edit-type="formData.editType" @emitSyncEditMode="syncEditMode" />

              <!--
              --------------------------------------
              编辑模式开始
              --------------------------------------
              -->
              <source-mode
                v-if="formData.editType === PageEditMode.EditMode_source"
                v-model="formData.mergedPost"
                :api-type="key"
                :page-id="id"
                :cfg="formData.publishCfg.cfg"
                @emitSyncPost="syncPost"
                @edmtSyncToSiyuan="handleSyncToSiyuan"
              />
              <div v-else class="normal-mode">
                <!-- 文章标题 -->
                <publish-title
                  v-model:use-ai="formData.useAi"
                  v-model="formData.mergedPost.title"
                  v-model:md="formData.mergedPost.markdown"
                  v-model:html="formData.mergedPost.html"
                  @emitSyncPublishTitle="syncPublishTitle"
                />

                <!-- 知识空间 -->
                <publish-knowledge-space
                  v-if="formData.publishCfg.cfg?.knowledgeSpaceEnabled"
                  v-model:knowledge-space-type="formData.publishCfg.cfg.knowledgeSpaceType"
                  v-model:knowledge-space-config="formData.knowledgeSpaceConfig"
                  v-model:cate-slugs="formData.mergedPost.cate_slugs"
                  @emitSyncCateSlugs="syncCateSlugs"
                />

                <!-- 标签别名 -->
                <single-tag-slug
                  v-if="formData.publishCfg.cfg?.tagSlugEnabled"
                  v-model:cfg="formData.publishCfg.cfg"
                  v-model:api-type="key"
                  v-model:tag-slugs="formData.mergedPost.tags_slugs"
                  @emitSyncTagSlugs="syncTagSlugs"
                />
                <el-divider border-style="dashed" />

                <div v-if="formData.editType === PageEditMode.EditMode_complex" class="complex-mode">
                  <!-- AI开关 -->
                  <!--
                  根据配置正确与否自动开启，不再提供手动设置
                  -->
                  <!--
                  <ai-switch v-if="formData.useAi" v-model:use-ai="formData.useAi" @emitSyncAiSwitch="syncAiSwitch" />
                  -->

                  <!-- 别名字段 -->
                  <el-form-item :label="t('main.slug')">
                    <el-input v-model="formData.mergedPost.wp_slug" :disabled="true" />
                  </el-form-item>

                  <!-- 摘要 -->
                  <publish-description
                    v-model:use-ai="formData.useAi"
                    v-model:page-id="id"
                    v-model:desc="formData.mergedPost.shortDesc"
                    v-model:md="formData.mergedPost.markdown"
                    v-model:html="formData.mergedPost.html"
                    @emitSyncDesc="syncDesc"
                  />

                  <!-- 标签 -->
                  <publish-tags
                    v-if="formData.publishCfg.cfg.tagEnabled"
                    v-model:use-ai="formData.useAi"
                    v-model:page-id="id"
                    v-model:tags="formData.mergedPost.mt_keywords"
                    v-model:md="formData.mergedPost.markdown"
                    v-model:html="formData.mergedPost.html"
                    v-model:tag-config="formData.tagConfig"
                    @emitSyncTags="syncTags"
                  />

                  <!-- 分类 -->
                  <publish-categories
                    v-if="formData.publishCfg.cfg.cateEnabled"
                    v-model:use-ai="formData.useAi"
                    v-model:category-type="formData.publishCfg.cfg.categoryType"
                    v-model:category-config="formData.categoryConfig"
                    v-model:categories="formData.mergedPost.categories"
                    v-model:md="formData.mergedPost.markdown"
                    v-model:html="formData.mergedPost.html"
                    @emitSyncCates="syncCates"
                  />

                  <!-- 发布时间 -->
                  <publish-time v-model="formData.mergedPost" @emitSyncPublishTime="syncPublishTime" />

                  <el-divider border-style="dashed" />
                </div>
              </div>
              <!--
              --------------------------------------
              编辑模式结束
              --------------------------------------
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
                <el-button
                  v-if="formData.method === MethodEnum.METHOD_EDIT"
                  type="danger"
                  @click="handleForceDelete"
                  :disabled="!formData.actionEnable"
                  class="btn-rm-action"
                >
                  {{ t("main.force.cancel") }}
                </el-button>
                <el-button
                  type="warning"
                  @click="handleSyncToSiyuan"
                  :disabled="!formData.actionEnable && formData.editType !== PageEditMode.EditMode_source"
                >
                  同步修改到思源笔记
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

.form-item-tip
  padding 2px 4px
  margin 0 10px 0 0
</style>
