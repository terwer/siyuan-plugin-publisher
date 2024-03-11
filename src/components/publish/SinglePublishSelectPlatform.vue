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
import { markRaw, onBeforeMount, reactive, ref } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useRouter } from "vue-router"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { DynamicConfig, DynamicJsonCfg, getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { HtmlUtil, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { useLoadingTimer } from "~/src/composables/useLoadingTimer.ts"
import CrossPageUtils from "~/cross/crossPageUtils.ts"
import Adaptors from "~/src/adaptors"
import { Utils } from "~/src/utils/utils.ts"
import { usePublish } from "~/src/composables/usePublish.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { ElMessage, ElMessageBox } from "element-plus"
import { Warning } from "@element-plus/icons-vue"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"

const logger = createAppLogger("single-publish-select-platform")
// appInstance
const appInstance = new PublisherAppInstance()
const { getPostPreviewUrl } = usePublish()
const { kernelApi } = useSiyuanApi()
const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()

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
const { getSetting } = usePublishSettingStore()

// datas
const formData = reactive({
  isInit: false,
  enabledConfigArray: [] as DynamicConfig[],

  postInfo: {} as any,
  postMeta: {} as any,
  unpublishCount: 0,
})
const pageTitle = ref("")

// methods
const handleSingleDoPublish = (event: any, key: string) => {
  // 阻止事件冒泡
  event.stopPropagation()

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

const handlePreview = async (event: any, key: string) => {
  // 阻止事件冒泡
  event.stopPropagation()

  const isPublish = checkHasPublished(key)
  if (!isPublish) {
    formData.unpublishCount++
    return
  }

  const cfg = await Adaptors.getCfg(key)
  const apiAdaptor = await Adaptors.getAdaptor(key, cfg)
  const api = Utils.blogApi(appInstance, apiAdaptor)
  const previewUrl = await getPostPreviewUrl(api, props.id, cfg)
  window.open(previewUrl)
}

const handlePreviewAll = async (event: any) => {
  ElMessageBox.confirm(`将在默认浏览器打开所有已发布平台的文章预览页面，是否继续？`, "温馨提示", {
    type: "error",
    icon: markRaw(Warning),
    confirmButtonText: t("main.opt.ok"),
    cancelButtonText: t("main.opt.cancel"),
  })
    .then(async () => {
      for (const enabledCfg of formData.enabledConfigArray) {
        await handlePreview(event, enabledCfg.platformKey)
      }

      if (formData.enabledConfigArray.length === 0 || formData.unpublishCount === formData.enabledConfigArray.length) {
        // 重置，准备下一次点击
        formData.unpublishCount = 0
        ElMessage.error("文章未发布过，请至少发布到一个平台！")
      }
    })
    .catch(() => {})
}

const initPage = async () => {
  const setting = await getSetting()
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  const dynamicConfigArray = dynJsonCfg?.totalCfg || []
  formData.enabledConfigArray = dynamicConfigArray.filter((item) => item.isEnabled && item.isAuth)
  formData.postMeta = ObjectUtil.getProperty(setting, props.id, {})
  formData.postInfo = await kernelApi.getBlockByID(props.id)
  const pref = getReadOnlyPublishPreferenceSetting()
  if (pref.value.fixTitle) {
    const docTitle = HtmlUtil.removeTitleNumber(formData.postInfo.content).replace(/\.md/g, "")
    pageTitle.value = docTitle
  } else {
    pageTitle.value = formData.postInfo.content
  }
}

// 计时器
const isTimerInit = ref(false)
const { loadingTime } = useLoadingTimer(isTimerInit)

onBeforeMount(async () => {
  await initPage()

  formData.isInit = true
  isTimerInit.value = true
})
</script>

<template>
  <!-- 显示加载计时器 -->
  <loading-timer :loading-time="loadingTime" style="padding: 0 24px" />
  <el-skeleton v-if="!formData.isInit" class="placeholder platform-skt" :rows="12" animated />
  <div v-else>
    <back-page title="单个文章发布">
      <div class="platform-title">
        {{ pageTitle }}
      </div>
      <div class="platform-desc">
        <p>
          <el-alert
            class="desc-tip"
            type="warning"
            title="点击图标进入对应平台的发布页面，如果文章已发布，可点击 [预览] 直接在浏览器打开预览页面。"
          ></el-alert>
        </p>
      </div>
      <div class="one-key-preview">
        <el-button type="primary" size="small" @click="handlePreviewAll">一键预览</el-button>
      </div>
      <el-row :gutter="20" class="row-box">
        <el-col
          :span="8"
          :sm="12"
          :xs="12"
          :md="12"
          :lg="8"
          :xl="8"
          :title="cfg.platformName"
          class="platform-select-card"
          v-for="cfg in formData.enabledConfigArray"
        >
          <el-card class="card-item">
            <div class="icon-list">
              <el-badge
                :type="checkHasPublished(cfg.platformKey) ? 'success' : 'danger'"
                :value="checkHasPublished(cfg.platformKey) ? '预览' : '未发布'"
                @click.stop="handlePreview($event, cfg.platformKey)"
                :class="checkHasPublished(cfg.platformKey) ? 'item published-item' : 'item'"
              >
                <el-text class="define-item" @click.stop="handleSingleDoPublish($event, cfg.platformKey)">
                  <i class="el-icon">
                    <span v-html="cfg?.platformIcon"></span>
                  </i>
                  {{ CrossPageUtils.longPlatformName(cfg?.platformName, 11) }}
                </el-text>
              </el-badge>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </back-page>
  </div>
</template>

<style scoped lang="stylus">
$icon_size = 32px

.platform-skt
  padding: 40px 12px

.platform-title
  padding: 10px 0 0 4px
  font-weight: 900

.platform-desc
  font-size 14px
  margin 0 10px

.one-key-preview
  margin-left 10px
  margin-bottom 16px

.card-item
  padding 0

.item
  margin-top 10px

.row-box
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

.published-item
  cursor pointer
</style>
