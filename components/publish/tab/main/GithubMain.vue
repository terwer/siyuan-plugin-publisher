<!--
  - Copyright (c) 2022, Terwer . All rights reserved.
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

<template>
  <div>
    <el-container v-if="!initPublishData.isInitLoading">
      <el-main class="github-main">
        <!-- 提示 -->
        <div class="github-tips">
          <el-alert
            v-if="pageModeData.etype !== PageEditMode.EditMode_source"
            :closable="false"
            :title="initPublishData.apiTypeInfo"
            class="top-version-tip"
            type="info"
          />
          <el-alert
            v-if="
              !initPublishData.apiStatus &&
              pageModeData.etype !== PageEditMode.EditMode_source
            "
            :closable="false"
            :title="$t('main.publish.github.error.tip')"
            class="top-version-tip"
            type="error"
          />
        </div>

        <!-- 表单数据 -->
        <div class="github-form">
          <el-form label-width="100px">
            <!-- 文章标题 -->
            <div
              v-if="pageModeData.etype !== PageEditMode.EditMode_source"
              class="form-post-title"
            >
              <el-form-item :label="$t('main.title')">
                <el-input v-model="slugData.title" :disabled="true" />
              </el-form-item>
            </div>

            <!-- 编辑模式 -->
            <div class="form-edit-mode">
              <el-form-item :label="$t('main.publish.editmode')">
                <el-button-group>
                  <el-button
                    :type="
                      pageModeData.etype === PageEditMode.EditMode_simple
                        ? 'primary'
                        : 'default'
                    "
                    @click="
                      initPublishMethods.onEditModeChange(
                        PageEditMode.EditMode_simple
                      )
                    "
                    >{{ $t("main.publish.editmode.simple") }}
                  </el-button>
                  <el-button
                    :type="
                      pageModeData.etype === PageEditMode.EditMode_complex
                        ? 'primary'
                        : 'default'
                    "
                    @click="
                      initPublishMethods.onEditModeChange(
                        PageEditMode.EditMode_complex
                      )
                    "
                    >{{ $t("main.publish.editmode.complex") }}
                  </el-button>
                  <el-button
                    :type="
                      pageModeData.etype === PageEditMode.EditMode_source
                        ? 'primary'
                        : 'default'
                    "
                    @click="
                      initPublishMethods.onEditModeChange(
                        PageEditMode.EditMode_source
                      )
                    "
                    >{{ $t("main.publish.editmode.source") }}
                  </el-button>
                </el-button-group>
              </el-form-item>
            </div>

            <!-- 简洁模式与详细模式 -->
            <div
              v-if="pageModeData.etype !== PageEditMode.EditMode_source"
              class="normal-mode"
            >
              <!-- 别名 -->
              <div
                v-if="pageModeData.etype !== PageEditMode.EditMode_simple"
                class="form-slug"
              >
                <!-- 刷新别名 -->
                <el-form-item :label="$t('main.force.refresh')">
                  <el-switch v-model="slugData.forceRefresh" />
                </el-form-item>

                <!-- hash -->
                <el-form-item :label="$t('main.use.hash')">
                  <el-switch v-model="slugData.slugHashEnabled" />
                  <el-alert
                    v-if="!slugData.slugHashEnabled"
                    :closable="false"
                    :title="$t('main.use.hash.tip')"
                    type="warning"
                  />
                </el-form-item>

                <!-- 别名字段 -->
                <el-form-item :label="$t('main.slug')">
                  <el-input v-model="slugData.customSlug" />
                </el-form-item>
                <!-- 生成别名 -->
                <el-form-item>
                  <el-button
                    :loading="slugData.isSlugLoading"
                    class="make-slug-btn"
                    type="primary"
                    @click="slugMethods.makeSlug"
                  >
                    {{
                      slugData.isSlugLoading
                        ? $t("main.opt.loading")
                        : $t("main.auto.fetch.slug")
                    }}
                  </el-button>
                </el-form-item>
              </div>

              <!-- 文章摘要 -->
              <div class="form-desc">
                <!-- 摘要字段 -->
                <el-form-item
                  v-if="pageModeData.etype !== PageEditMode.EditMode_simple"
                  :label="$t('main.desc')"
                >
                  <el-input
                    v-model="descData.desc"
                    :autosize="{ minRows: 3, maxRows: 16 }"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item
                  v-if="pageModeData.etype !== PageEditMode.EditMode_simple"
                >
                  <el-button
                    :loading="descData.isDescLoading"
                    type="primary"
                    @click="descMethods.makeDesc"
                  >
                    {{
                      descData.isDescLoading
                        ? $t("main.opt.loading")
                        : $t("main.auto.fetch.desc")
                    }}
                  </el-button>
                </el-form-item>
              </div>

              <!-- 发布时间 -->
              <div class="form-publish-time">
                <el-form-item
                  v-if="pageModeData.etype !== PageEditMode.EditMode_simple"
                  :label="$t('main.create.time')"
                >
                  <el-date-picker
                    v-model="publishTimeData.created"
                    :placeholder="$t('main.create.time.placeholder')"
                    format="YYYY-MM-DD HH:mm:ss"
                    type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </el-form-item>
              </div>

              <!--
              ----------------------------------------------------------------------
              -->
              <!-- 标签  -->
              <div class="form-tags">
                <!-- 标签开关 -->
                <el-form-item :label="$t('main.tag.auto.switch')">
                  <el-switch v-model="tagData.tagSwitch" />
                </el-form-item>
                <el-form-item :label="$t('main.tag')">
                  <el-tag
                    v-for="tag in tagData.tag.dynamicTags"
                    :key="tag"
                    :disable-transitions="false"
                    class="mx-1"
                    closable
                    @close="tagMethods.tagHandleClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    v-if="tagData.tag.inputVisible"
                    ref="tagRefInput"
                    v-model="tagData.tag.inputValue"
                    class="ml-1 w-20"
                    size="small"
                    @blur="tagMethods.tagHandleInputConfirm"
                    @keyup.enter="tagMethods.tagHandleInputConfirm"
                  />
                  <el-button
                    v-else
                    class="button-new-tag ml-1 el-tag"
                    size="small"
                    @click="tagMethods.tagShowInput"
                  >
                    {{ $t("main.tag.new") }}
                  </el-button>
                </el-form-item>
                <el-form-item
                  v-if="pageModeData.etype !== PageEditMode.EditMode_simple"
                >
                  <el-button
                    :loading="tagData.isTagLoading"
                    type="primary"
                    @click="tagMethods.fetchTag"
                  >
                    {{
                      tagData.isTagLoading
                        ? $t("main.opt.loading")
                        : $t("main.auto.fetch.tag")
                    }}
                  </el-button>
                </el-form-item>
              </div>

              <!-- Github pages -->
              <div class="form-github-pages">
                <!-- 启用Github发布 -->
                <el-form-item :label="$t('main.publish.github')">
                  <el-switch
                    v-model="githubPagesData.githubEnabled"
                    @change="githubPagesMethods.githubOnChange"
                  />
                  <el-alert
                    v-if="!githubPagesData.githubEnabled"
                    :closable="false"
                    :title="$t('main.publish.github.no.tip')"
                    type="warning"
                  />
                </el-form-item>
                <div
                  v-if="githubPagesData.githubEnabled"
                  class="form-github-pages-items"
                >
                  <!-- 是否使用默认目录 -->
                  <el-form-item
                    v-if="!initPublishData.isPublished"
                    :label="$t('main.publish.github.choose.path.use.default')"
                  >
                    <el-switch
                      v-model="githubPagesData.useDefaultPath"
                      @change="githubPagesMethods.defaultPathOnChange"
                    />
                    <el-alert
                      v-if="githubPagesData.useDefaultPath"
                      :closable="false"
                      :title="
                        $t('main.publish.github.choose.path.use.default.tip') +
                        githubPagesData.currentDefaultPath
                      "
                      type="info"
                    />
                  </el-form-item>
                  <!-- 选择目录 -->
                  <el-form-item
                    v-if="
                      !githubPagesData.useDefaultPath &&
                      !initPublishData.isPublished
                    "
                    :label="$t('main.publish.github.choose.path')"
                  >
                    <el-tree-select
                      v-model="githubPagesData.customPath"
                      :check-strictly="true"
                      :empty-text="$t('main.cat.empty')"
                      :load="githubPagesMethods.customLoad"
                      :no-data-text="$t('main.cat.empty')"
                      :placeholder="$t('main.cat.select')"
                      :props="githubPagesData.path.customProps"
                      lazy
                      style="width: 100%"
                      @node-click="githubPagesMethods.onSelectChange"
                    />
                  </el-form-item>
                  <!-- 设置文件名 -->
                  <el-form-item
                    v-if="!initPublishData.isPublished"
                    :label="$t('main.publish.github.choose.title')"
                  >
                    <el-input v-model="githubPagesData.mdTitle" />
                  </el-form-item>
                  <!-- 发布路径只读查看 -->
                  <el-form-item
                    :label="$t('main.publish.github.published.path')"
                  >
                    <el-input
                      v-model="githubPagesData.publishPath"
                      :disabled="initPublishData.isPublished"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>

            <!-- 快捷操作 -->
            <div
              v-if="pageModeData.etype !== PageEditMode.EditMode_source"
              class="convert-option"
            >
              <!-- 一键生成属性-->
              <el-form-item :label="$t('main.opt.quick')">
                <el-button
                  :loading="quickData.isGenLoading"
                  type="primary"
                  @click="quickMethods.oneclickAttr"
                >
                  {{
                    quickData.isGenLoading
                      ? $t("main.opt.loading")
                      : $t("main.publish.oneclick.attr")
                  }}
                </el-button>
                <!-- 属性转换 -->
                <el-button type="primary" @click="quickMethods.saveAttrToSiyuan"
                  >{{ $t("main.save.attr.to.siyuan") }}
                </el-button>
                <el-button
                  type="primary"
                  @click="
                    initPublishMethods.onEditModeChange(
                      PageEditMode.EditMode_source
                    )
                  "
                  >{{ $t("main.siyuan.to.yaml") }}
                </el-button>
              </el-form-item>
            </div>

            <!-- 发布操作 -->
            <div
              v-if="pageModeData.etype !== PageEditMode.EditMode_source"
              class="publish-action"
            >
              <el-form-item>
                <el-button
                  :loading="isPublishLoading"
                  type="primary"
                  @click="doPublish"
                  >{{
                    isPublishLoading
                      ? $t("main.publish.loading")
                      : isPublished
                      ? $t("main.update")
                      : $t("main.publish")
                  }}
                </el-button>
                <el-button :loading="isCancelLoading" @click="cancelPublish"
                  >{{ $t("main.cancel") }}
                </el-button>
              </el-form-item>
            </div>

            <!-- 发布状态 -->
            <div
              v-if="pageModeData.etype !== PageEditMode.EditMode_source"
              class="publish-status"
            >
              <!-- 文章状态 -->
              <el-form-item>
                <el-button disabled text type="danger">
                  {{
                    isPublished
                      ? $t("main.publish.status.published")
                      : $t("main.publish.status.unpublish")
                  }}
                </el-button>
                <a
                  v-if="isPublished"
                  :href="previewUrl"
                  :title="previewUrl"
                  target="_blank"
                  >{{ $t("main.publish.github.see.md.preview") }}</a
                >
              </el-form-item>
              <el-form-item>
                <a
                  v-if="isPublished"
                  :href="previewRealUrl"
                  :title="previewRealUrl"
                  target="_blank"
                  >{{ $t("main.publish.github.see.real.preview") }}</a
                >
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-main>
    </el-container>
    <el-skeleton :loading="initPublishData.isInitLoading" :rows="5" animated />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue"
import { PageEditMode } from "~/utils/common/pageEditMode"
import { useSlug } from "~/composables/publish/makeSlugCom"
import { LogFactory } from "~/utils/logUtil"
import { useYaml } from "~/composables/publish/makeYamlCom"
import { YamlConvertAdaptor } from "~/utils/platform/yamlConvertAdaptor"
import { usePublish } from "~/composables/publish/doPublishCom"
import { useQuick } from "~/composables/publish/publishQuickCom"
import { useDesc } from "~/composables/publish/makeDescCom"
import { usePublishTime } from "~/composables/publish/publishTimeCom"
import { useTag } from "~/composables/publish/makeTagCom"
import { useGithubPages } from "~/composables/publish/githubPagesCom"
import { useInitPublish } from "~/composables/publish/initPublishCom"
import { usePageMode } from "~/composables/publish/pageModeCom"
import { useSiyuanPage } from "~/composables/publish/siyuanPageCom"

const logger = LogFactory.getLogger(
  "components/publish/tab/main/GithubMain.vue"
)
const props = defineProps({
  isReload: {
    type: Boolean,
    default: false,
  },
  isMainReload: {
    type: Boolean,
    default: false,
  },
  apiType: {
    type: String,
    default: "",
  },
  pageId: {
    type: String,
    default: undefined,
  },
  slugType: {
    type: String,
    default: undefined,
  },
  yamlConverter: {
    type: YamlConvertAdaptor,
  },
})

// composables
const { pageModeData, pageModeMethods } = usePageMode()
const { siyuanPageMethods } = useSiyuanPage(props)
const { slugData, slugMethods } = useSlug(props, { siyuanPageMethods })
const { descData, descMethods } = useDesc(props, { siyuanPageMethods })
const { publishTimeData, publishTimeMethods } = usePublishTime()
const { tagData, tagMethods } = useTag(props)
const { githubPagesData, githubPagesMethods } = useGithubPages(props, {
  siyuanPageMethods,
})
const { yamlData, yamlMethods } = useYaml()
const { quickData, quickMethods } = useQuick(props, {
  siyuanPageMethods,
  slugMethods,
  descMethods,
  tagMethods,
})
const { publishData, publishMethods } = usePublish()
const { initPublishData, initPublishMethods } = useInitPublish(props, {
  pageModeMethods,
  siyuanPageMethods,
  slugMethods,
  descMethods,
  publishTimeMethods,
  tagMethods,
  githubPagesMethods,
})

// life cycle
/**
 * 监听props
 */
watch(
  () => props.isReload,
  async () => {
    // 初始化
    await initPublishMethods.initPage()
    logger.debug(props.apiType + "_Main检测到设置更新操作，刷新页面")
  }
)
watch(
  () => props.isMainReload,
  async () => {
    // 初始化
    await initPublishMethods.initPage()
    logger.debug(props.apiType + "_Main左右切换tab，刷新页面")
  }
)
onMounted(async () => {
  await initPublishMethods.initPage()
})
</script>

<style scoped>
.github-main {
  padding: 0;
}

.source-opt {
  margin-bottom: 10px;
}

.source-opt a {
  padding: 4px 2px;
  cursor: pointer;
  /*border: solid 1px #409eff;*/
}

.source-opt a.middle {
  margin: 0 12px;
}

.source-opt a.current {
  background-color: #409eff;
  color: #ffffff;
}

.top-yaml-tip {
  padding: 2px 4px;
  margin: 0 10px 0 0;
}

#yaml-detail-preview {
  cursor: default;
  /*pointer-events: none;*/
}
</style>
