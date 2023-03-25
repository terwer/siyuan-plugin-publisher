<!--
  - Copyright (c) 2022-2023, Terwer . All rights reserved.
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
            v-if="!initPublishData.apiStatus && pageModeData.etype !== PageEditMode.EditMode_source"
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
            <div v-if="pageModeData.etype !== PageEditMode.EditMode_source" class="form-post-title">
              <el-form-item :label="$t('main.title')">
                <el-input v-model="slugData.title" :disabled="true" />
              </el-form-item>
            </div>

            <!-- 编辑模式 -->
            <div class="form-edit-mode">
              <el-form-item :label="$t('main.publish.editmode')">
                <el-button-group>
                  <el-button
                    :type="pageModeData.etype === PageEditMode.EditMode_simple ? 'primary' : 'default'"
                    @click="initPublishMethods.onEditModeChange(PageEditMode.EditMode_simple)"
                    >{{ $t("main.publish.editmode.simple") }}
                  </el-button>
                  <el-button
                    :type="pageModeData.etype === PageEditMode.EditMode_complex ? 'primary' : 'default'"
                    @click="initPublishMethods.onEditModeChange(PageEditMode.EditMode_complex)"
                    >{{ $t("main.publish.editmode.complex") }}
                  </el-button>
                  <el-button
                    :type="pageModeData.etype === PageEditMode.EditMode_source ? 'primary' : 'default'"
                    @click="initPublishMethods.onEditModeChange(PageEditMode.EditMode_source)"
                    >{{ $t("main.publish.editmode.source") }}
                  </el-button>
                </el-button-group>
              </el-form-item>
            </div>

            <!-- 简洁模式与详细模式 -->
            <div v-if="pageModeData.etype !== PageEditMode.EditMode_source" class="normal-mode">
              <!-- 别名 -->
              <div v-if="pageModeData.etype !== PageEditMode.EditMode_simple" class="form-slug">
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
                    {{ slugData.isSlugLoading ? $t("main.opt.loading") : $t("main.auto.fetch.slug") }}
                  </el-button>
                </el-form-item>
              </div>

              <!-- 文章摘要 -->
              <div class="form-desc">
                <!-- 摘要字段 -->
                <el-form-item v-if="pageModeData.etype !== PageEditMode.EditMode_simple" :label="$t('main.desc')">
                  <el-input v-model="descData.desc" :autosize="{ minRows: 3, maxRows: 16 }" type="textarea" />
                </el-form-item>
                <el-form-item v-if="pageModeData.etype !== PageEditMode.EditMode_simple">
                  <el-button :loading="descData.isDescLoading" type="primary" @click="descMethods.makeDesc">
                    {{ descData.isDescLoading ? $t("main.opt.loading") : $t("main.auto.fetch.desc") }}
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
                <el-form-item
                  v-if="pageModeData.etype !== PageEditMode.EditMode_simple"
                  :label="$t('main.tag.auto.switch')"
                >
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
                  <el-button v-else class="button-new-tag ml-1 el-tag" size="small" @click="tagMethods.tagShowInput">
                    {{ $t("main.tag.new") }}
                  </el-button>
                </el-form-item>
                <el-form-item v-if="pageModeData.etype !== PageEditMode.EditMode_simple">
                  <el-button :loading="tagData.isTagLoading" type="primary" @click="tagMethods.fetchTag">
                    {{ tagData.isTagLoading ? $t("main.opt.loading") : $t("main.auto.fetch.tag") }}
                  </el-button>
                </el-form-item>
              </div>

              <!-- Github pages -->
              <div class="form-github-pages">
                <!-- 启用Github发布 -->
                <el-form-item :label="$t('main.publish.github')">
                  <el-switch v-model="githubPagesData.githubEnabled" @change="githubPagesMethods.githubOnChange" />
                  <el-alert
                    v-if="!githubPagesData.githubEnabled"
                    :closable="false"
                    :title="$t('main.publish.github.no.tip')"
                    type="warning"
                  />
                </el-form-item>

                <div v-if="githubPagesData.githubEnabled" class="form-github-pages-items">
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
                        $t('main.publish.github.choose.path.use.default.tip') + githubPagesData.currentDefaultPath
                      "
                      type="info"
                    />
                  </el-form-item>
                  <!-- 选择目录 -->
                  <el-form-item
                    v-if="!githubPagesData.useDefaultPath && !initPublishData.isPublished"
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
                  <el-form-item v-if="!initPublishData.isPublished" :label="$t('main.publish.github.choose.title')">
                    <el-input
                      v-model="githubPagesData.mdTitle"
                      @change="githubPagesMethods.onFilenameChange"
                      :disabled="slugMethods.isSlugEmpty()"
                    />
                  </el-form-item>
                  <!-- 发布路径只读查看 -->
                  <el-form-item :label="$t('main.publish.github.published.path')">
                    <el-input v-model="githubPagesData.publishPath" :disabled="true" />
                  </el-form-item>
                </div>
              </div>
            </div>

            <!-- 附加属性，用于适配 -->
            <div class="addition-attributes" v-if="pageModeData.etype === PageEditMode.EditMode_complex">
              <!-- 是否使用永久链接 -->
              <el-form-item :label="$t('github.use.permalink')">
                <el-switch v-model="githubPagesData.usePermalink" @change="githubPagesMethods.permalinkOnChange" />
                <el-alert
                  v-if="!githubPagesData.usePermalink"
                  :closable="false"
                  :title="$t('github.use.permalink.no.warn')"
                  type="warning"
                />
              </el-form-item>
              <!-- 菜单标题 -->
              <el-form-item :label="$t('github.menu.title')">
                <el-input v-model="githubPagesData.linkTitle" :placeholder="$t('github.menu.title.placeholder')" />
              </el-form-item>
              <!-- 权重 -->
              <el-form-item :label="$t('github.weight')">
                <el-input v-model="githubPagesData.weight" :placeholder="$t('github.weight.placeholder')" />
              </el-form-item>
              <!-- 是否显示日期字段 -->
              <el-form-item :label="$t('github.use.date')">
                <el-switch v-model="githubPagesData.useDate" @change="githubPagesMethods.showDateOnChange" />
                <el-alert
                  v-if="!githubPagesData.useDate"
                  :closable="false"
                  :title="$t('github.use.date.no.warn')"
                  type="warning"
                />
              </el-form-item>
            </div>

            <!-- 快捷操作 -->
            <div v-if="pageModeData.etype !== PageEditMode.EditMode_source" class="convert-option">
              <!-- 一键生成属性-->
              <el-form-item v-if="pageModeData.etype !== PageEditMode.EditMode_simple" :label="$t('main.opt.quick')">
                <el-button :loading="quickData.isGenLoading" type="primary" @click="quickMethods.oneclickAttr">
                  {{ quickData.isGenLoading ? $t("main.opt.loading") : $t("main.publish.oneclick.attr") }}
                </el-button>
              </el-form-item>

              <!-- 属性转换 -->
              <el-form-item v-if="pageModeData.etype !== PageEditMode.EditMode_simple">
                <!-- 属性转换 -->
                <el-button type="primary" @click="initPublishMethods.saveAttrToSiyuanWithInit"
                  >{{ $t("main.save.attr.to.siyuan") }}
                </el-button>
              </el-form-item>

              <el-form-item v-if="pageModeData.etype !== PageEditMode.EditMode_simple">
                <el-button type="primary" @click="initPublishMethods.onEditModeChange(PageEditMode.EditMode_source)"
                  >{{ $t("main.siyuan.to.yaml") }}
                </el-button>
              </el-form-item>
            </div>

            <!-- 发布操作 -->
            <div
              v-if="githubPagesData.githubEnabled && pageModeData.etype !== PageEditMode.EditMode_source"
              class="publish-action"
            >
              <!-- 使用图床 -->
              <el-form-item :label="$t('github.post.picgo.use')">
                <el-switch v-model="picgoPostData.picgoEnabled" @change="picgoPostMethods.picgoOnChange" />
                <el-tooltip
                  v-if="picgoPostData.picgoEnabled && !isInSiyuanNewWinBrowser()"
                  :content="$t('siyuan.browser.menu.picture.btn')"
                  class="box-item"
                  effect="light"
                  placement="right"
                  popper-class="publish-menu-tooltip"
                >
                  <el-button
                    class="pic-manage-btn"
                    type="success"
                    size="small"
                    @click="picgoPostMethods.handlePicgoManage(siyuanPageMethods.getPageId())"
                  >
                    <font-awesome-icon icon="fa-solid fa-image" />
                    {{ $t("setting.picgo.manage") }}
                  </el-button>
                </el-tooltip>
                <el-alert
                  v-if="picgoPostData.picgoEnabled"
                  :closable="false"
                  :title="$t('github.post.picgo.use.tip')"
                  type="warning"
                />
              </el-form-item>

              <!-- 发布 -->
              <el-form-item>
                <el-button :loading="publishData.isPublishLoading" type="primary" @click="publishMethods.doPublish"
                  >{{
                    publishData.isPublishLoading
                      ? $t("main.publish.loading")
                      : initPublishData.isPublished
                      ? $t("main.update")
                      : $t("main.publish")
                  }}
                </el-button>
                <el-button
                  v-if="initPublishData.isPublished"
                  :loading="publishData.isCancelLoading"
                  @click="publishMethods.cancelPublish"
                  >{{ $t("main.cancel") }}
                </el-button>
              </el-form-item>
            </div>

            <!-- 发布状态 -->
            <div
              v-if="
                githubPagesData.githubEnabled &&
                pageModeData.etype !== PageEditMode.EditMode_source &&
                initPublishData.apiStatus
              "
              class="publish-status"
            >
              <!-- 文章状态 -->
              <el-form-item class="publish-status-box">
                <el-button class="publish-text-btn" disabled text type="danger">
                  {{
                    initPublishData.isPublished
                      ? $t("main.publish.status.published")
                      : $t("main.publish.status.unpublish")
                  }}
                </el-button>
                <a
                  v-if="initPublishData.isPublished"
                  :href="initPublishData.previewMdUrl"
                  :title="initPublishData.previewMdUrl"
                  target="_blank"
                  >{{ $t("main.publish.see.md.preview") }}</a
                >
              </el-form-item>
              <el-form-item v-if="initPublishData.isPublished" class="publish-status-box">
                <img :src="initPublishData.mdStatusUrl" alt="md-build-status" class="publish-build-status-icon" />
                <a :href="initPublishData.previewUrl" :title="initPublishData.previewUrl" target="_blank">{{
                  $t("main.publish.see.real.preview")
                }}</a>
              </el-form-item>
            </div>

            <!-- 源码模式 -->
            <div v-if="pageModeData.etype === PageEditMode.EditMode_source" class="source-mode">
              <!-- YAML提示 -->
              <el-form-item>
                <el-alert
                  :closable="false"
                  :title="upperFirst(props.apiType) + ' ' + $t('main.yaml.formatter')"
                  class="top-yaml-tip"
                  type="info"
                />
              </el-form-item>

              <!-- 只读模式 -->
              <!-- 刷新别名 -->
              <el-form-item
                v-if="pageModeData.etype.toString() !== PageEditMode.EditMode_simple.toString()"
                :label="yamlData.readMode ? $t('main.read.mode') : $t('main.edit.mode')"
              >
                <el-switch v-model="yamlData.readMode" />
              </el-form-item>

              <!-- 显示方式 -->
              <div class="source-opt">
                <el-form-item>
                  <a
                    :class="{
                      current: pageModeData.stype === SourceContentShowType.YAML,
                    }"
                    @click="initPublishMethods.onYamlShowTypeChange(SourceContentShowType.YAML)"
                    >{{ $t("yaml.show.type.yaml") }}</a
                  >
                  <a
                    :class="{
                      current: pageModeData.stype === SourceContentShowType.CONTENT,
                      middle: true,
                    }"
                    @click="initPublishMethods.onYamlShowTypeChange(SourceContentShowType.CONTENT)"
                    >{{ $t("yaml.show.type.md") }}</a
                  >
                  <a
                    :class="{
                      current: pageModeData.stype === SourceContentShowType.YAML_CONTENT,
                      middle: true,
                    }"
                    @click="initPublishMethods.onYamlShowTypeChange(SourceContentShowType.YAML_CONTENT)"
                    >{{ $t("yaml.show.type.yamlmd") }}</a
                  >
                  <a
                    :class="{
                      current: pageModeData.stype === SourceContentShowType.HTML_CONTENT,
                    }"
                    @click="initPublishMethods.onYamlShowTypeChange(SourceContentShowType.HTML_CONTENT)"
                    >{{ $t("yaml.show.type.html") }}</a
                  >
                </el-form-item>
              </div>

              <!-- YAML预览 -->
              <div v-if="yamlData.readMode" id="yaml-detail-content">
                <el-form-item>
                  <el-input
                    id="yaml-detail-preview"
                    v-model="yamlData.yamlPreviewContent"
                    :autosize="{ minRows: 4, maxRows: 16 }"
                    readonly
                    type="textarea"
                    @click="yamlMethods.onYamlContentFocus"
                    v-on:contextmenu="yamlMethods.onYamlContextMenu"
                  />
                </el-form-item>
              </div>

              <!-- YAML编辑 -->
              <div v-if="!yamlData.readMode" id="yaml-edit-content">
                <el-form-item>
                  <el-input
                    v-model="yamlData.yamlContent"
                    :autosize="{ minRows: 4, maxRows: 16 }"
                    type="textarea"
                    @input="yamlMethods.onYamlContentInput"
                  />
                </el-form-item>
              </div>

              <!-- 操作 -->
              <div v-if="!yamlData.readMode" id="yaml-action">
                <el-form-item>
                  <el-button type="primary" @click="initPublishMethods.convertYAMLToAttr"
                    >{{ $t("main.yaml.to.siyuan") }}
                  </el-button>
                  <el-button type="primary" @click="yamlMethods.copyYamlToClipboard()"
                    >{{ $t("main.copy") }}
                  </el-button>
                </el-form-item>
              </div>

              <div id="yaml-read-mode-tip">
                <el-form-item>
                  <el-alert :closable="false" :title="$t('main.read.mode.tip')" type="info" />
                </el-form-item>
              </div>
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
import { usePublish } from "~/composables/publish/publishActionCom"
import { useQuick } from "~/composables/publish/publishQuickCom"
import { useDesc } from "~/composables/publish/makeDescCom"
import { usePublishTime } from "~/composables/publish/publishTimeCom"
import { useTag } from "~/composables/publish/makeTagCom"
import { useGithubPages } from "~/composables/publish/githubPagesCom"
import { useInitPublish } from "~/composables/publish/initPublishCom"
import { usePageMode } from "~/composables/publish/pageModeCom"
import { useSiyuanPage } from "~/composables/publish/siyuanPageCom"
import { upperFirst } from "~/utils/strUtil"
import { SourceContentShowType } from "~/utils/common/sourceContentShowType"
import { usePicgoPost } from "~/composables/picgo/import/picgoPostCom"
import { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil"

const logger = LogFactory.getLogger("components/publish/tab/main/GithubMain.vue")
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
  slugMethods,
})
const { yamlData, yamlMethods } = useYaml()
const { quickData, quickMethods } = useQuick(props, {
  siyuanPageMethods,
  slugMethods,
  descMethods,
  tagMethods,
  githubPagesMethods,
})
const { picgoPostData, picgoPostMethods } = usePicgoPost()
const { initPublishData, initPublishMethods } = useInitPublish(props, {
  pageModeMethods,
  siyuanPageMethods,
  slugMethods,
  descMethods,
  publishTimeMethods,
  tagMethods,
  githubPagesMethods,
  yamlMethods,
  quickMethods,
  picgoPostMethods,
})
const { publishData, publishMethods } = usePublish(props, {
  siyuanPageMethods,
  yamlMethods,
  githubPagesMethods,
  picgoPostMethods,
  quickMethods,
  initPublishMethods,
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
  --text-color: #1a1a1a;
  /*padding: 4px 2px;*/
  cursor: pointer;
  /*border: solid 1px #409eff;*/
  color: var(--text-color);
  font-size: 16px;
  font-weight: 400;
}

html.dark .source-opt a {
  --text-color: #999;
}

.source-opt a:first-child {
  margin-right: 22px;
}

.source-opt a.middle {
  margin-right: 22px;
}

.source-opt a.current {
  --text-blue-color: #0084ff;
  /*background-color: #409eff;*/
  /*color: #ffffff;*/
  color: var(--text-blue-color);
  font-weight: 600;
}

.top-yaml-tip {
  padding: 2px 4px;
  margin: 0 10px 0 0;
}

#yaml-detail-preview {
  cursor: default;
  /*pointer-events: none;*/
}

.publish-status-box {
  margin-bottom: 0;
}

.publish-status-box .publish-text-btn {
  margin: 0;
  padding: 0 12px 0 0;
}

.publish-build-status-icon {
  margin-right: 12px;
}
</style>
