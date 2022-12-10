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
    <el-container v-if="!isInitLoading">
      <el-main class="github-main">
        <!-- 提示 -->
        <div class="github-tips">
          <el-alert
            v-if="formOptionData.etype !== PageEditMode.EditMode_source"
            :closable="false"
            :title="apiTypeInfo"
            class="top-version-tip"
            type="info"
          />
          <el-alert
            v-if="
              !apiStatus &&
              formOptionData.etype !== PageEditMode.EditMode_source
            "
            :closable="false"
            :title="$t('main.publish.github.error.tip')"
            class="top-version-tip"
            type="error"
          />
        </div>

        <el-form label-width="100px">
          <!-- 编辑模式 -->
          <el-form-item :label="$t('main.publish.editmode')">
            <el-button-group>
              <el-button
                :type="
                  formOptionData.etype === PageEditMode.EditMode_simple
                    ? 'primary'
                    : 'default'
                "
                @click="onEditModeChange(PageEditMode.EditMode_simple)"
                >{{ $t("main.publish.editmode.simple") }}
              </el-button>
              <el-button
                :type="
                  formOptionData.etype === PageEditMode.EditMode_complex
                    ? 'primary'
                    : 'default'
                "
                @click="onEditModeChange(PageEditMode.EditMode_complex)"
                >{{ $t("main.publish.editmode.complex") }}
              </el-button>
              <el-button
                :type="
                  formOptionData.etype === PageEditMode.EditMode_source
                    ? 'primary'
                    : 'default'
                "
                @click="onEditModeChange(PageEditMode.EditMode_source)"
                >{{ $t("main.publish.editmode.source") }}
              </el-button>
            </el-button-group>
          </el-form-item>

          <!-- 简洁模式与详细模式 -->
          <div
            v-if="formOptionData.etype !== PageEditMode.EditMode_source"
            class="normal-mode"
          >
            <!-- 别名 -->
            <div class="form-slug">
              <!-- 强制刷新 -->
              <el-form-item
                v-if="formOptionData.etype !== PageEditMode.EditMode_simple"
                :label="$t('main.force.refresh')"
              >
                <el-switch v-model="slugData.forceRefresh" />
              </el-form-item>

              <!-- hash -->
              <el-form-item
                v-if="
                  formOptionData.etype.toString() !==
                  PageEditMode.EditMode_simple.toString()
                "
                :label="$t('main.use.hash')"
              >
                <el-switch v-model="slugData.slugHashEnabled" />
                <el-alert
                  v-if="!slugData.slugHashEnabled"
                  :closable="false"
                  :title="$t('main.use.hash.tip')"
                  type="warning"
                />
              </el-form-item>

              <!-- 别名字段 -->
              <el-form-item
                v-if="
                  formOptionData.etype.toString() !==
                  PageEditMode.EditMode_simple.toString()
                "
                :label="$t('main.slug')"
              >
                <el-input v-model="slugData.customSlug" />
              </el-form-item>
              <!-- 生成别名 -->
              <!--
              <el-form-item
                v-if="formOptionData.etype !== PageEditMode.EditMode_simple"
              >
                <el-button
                  :loading="slugData.isSlugLoading"
                  class="make-slug-btn"
                  type="primary"
                  @click="makeSlug"
                >
                  {{
                    slugData.isSlugLoading
                      ? $t("main.opt.loading")
                      : $t("main.auto.fetch.slug")
                  }}
                </el-button>
              </el-form-item>
              -->
            </div>

            <!-- 属性转换 -->
            <div class="convert-option">
              <!-- 一键生成属性-->
              <el-form-item :label="$t('main.opt.quick')">
                <el-button
                  :loading="isGenLoading"
                  type="primary"
                  @click="oneclickAttr"
                >
                  {{
                    isGenLoading
                      ? $t("main.opt.loading")
                      : $t("main.publish.oneclick.attr")
                  }}
                </el-button>
                <el-button type="primary" @click="saveAttrToSiyuan"
                  >{{ $t("main.save.attr.to.siyuan") }}
                </el-button>
                <el-button type="primary" @click="convertAttrToYAML"
                  >{{ $t("main.siyuan.to.yaml") }}
                </el-button>
              </el-form-item>
            </div>

            <!-- 发布操作 -->
            <div class="publish-option">
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
          </div>

          <!-- 源码模式 -->
          <div
            v-if="formOptionData.etype === PageEditMode.EditMode_source"
            class="source-mode"
          >
            <!-- YAML提示 -->
            <el-form-item>
              <el-alert
                :closable="false"
                :title="
                  upperFirst(props.apiType) + ' ' + $t('main.yaml.formatter')
                "
                class="top-yaml-tip"
                type="info"
              />
            </el-form-item>

            <!-- 只读模式 -->
            <!-- 强制刷新 -->
            <el-form-item
              v-if="formOptionData.etype !== PageEditMode.EditMode_simple"
              :label="$t('main.read.mode')"
            >
              <el-switch v-model="yamlData.readMode" />
            </el-form-item>

            <!-- 显示方式 -->
            <div class="source-opt">
              <el-form-item>
                <a
                  :class="{
                    current:
                      formOptionData.stype === SourceContentShowType.YAML,
                  }"
                  @click="onYamlShowTypeChange(SourceContentShowType.YAML)"
                  >{{ $t("yaml.show.type.yaml") }}</a
                >
                <a
                  :class="{
                    current:
                      formOptionData.stype === SourceContentShowType.CONTENT,
                    middle: true,
                  }"
                  @click="onYamlShowTypeChange(SourceContentShowType.CONTENT)"
                  >{{ $t("yaml.show.type.md") }}</a
                >
                <a
                  :class="{
                    current:
                      formOptionData.stype ===
                      SourceContentShowType.YAML_CONTENT,
                    middle: true,
                  }"
                  @click="
                    onYamlShowTypeChange(SourceContentShowType.YAML_CONTENT)
                  "
                  >{{ $t("yaml.show.type.yamlmd") }}</a
                >
                <a
                  :class="{
                    current:
                      formOptionData.stype ===
                      SourceContentShowType.HTML_CONTENT,
                  }"
                  @click="
                    onYamlShowTypeChange(SourceContentShowType.HTML_CONTENT)
                  "
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
                  @click="onYamlContentFocus"
                  v-on:contextmenu="onYamlContextMenu"
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
                />
              </el-form-item>
            </div>

            <!-- 操作 -->
            <div v-if="!yamlData.readMode" id="yaml-action">
              <el-form-item>
                <el-button type="primary" @click="convertYAMLToAttr"
                  >{{ $t("main.yaml.to.siyuan") }}
                </el-button>
                <el-button type="primary" @click="copyYamlToClipboard()"
                  >{{ $t("main.copy") }}
                </el-button>
              </el-form-item>
            </div>

            <div id="yaml-read-mode-tip">
              <el-form-item>
                <el-alert
                  :closable="false"
                  :title="$t('main.read.mode.tip')"
                  type="success"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-main>
    </el-container>
    <el-skeleton :loading="isInitLoading" :rows="5" animated />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { PageEditMode } from "~/utils/common/pageEditMode"
import { SourceContentShowType } from "~/utils/common/sourceContentShowType"
import {
  getApiParams,
  getPublishCfg,
  getPublishStatus,
} from "~/utils/publishUtil"
import { appendStr, mdFileToTitle, upperFirst } from "~/utils/strUtil"
import { useI18n } from "vue-i18n"
import { getJSONConf } from "~/utils/configUtil"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { useSlug } from "~/composables/makeSlugCom"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"
import { LogFactory } from "~/utils/logUtil"
import { ElMessage } from "element-plus"
import { useYaml } from "~/composables/makeYamlCom"
import { mdToHtml, removeMdH1, removeMdWidgetTag } from "~/utils/htmlUtil"
import { YamlConvertAdaptor } from "~/utils/platform/yamlConvertAdaptor"
import { PostForm } from "~/utils/common/postForm"
import { PublishPreference } from "~/utils/common/publishPreference"
import { formatNumToZhDate } from "~/utils/dateUtil"

const logger = LogFactory.getLogger(
  "components/publish/tab/main/GithubMain.vue"
)
const { t } = useI18n()
const siyuanApi = new SiYuanApi()
const props = defineProps({
  isReload: {
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
const isInitLoading = ref(false)
const apiStatus = ref(false)
const isPublished = ref(false)
const apiTypeInfo = ref(
  appendStr(t("setting.blog.platform.support.github"), props.apiType)
)
const formOptionData = reactive({
  etype: <PageEditMode>PageEditMode.EditMode_simple,
  stype: SourceContentShowType.YAML_CONTENT,
})
const siyuanData = ref({
  pageId: "",
  meta: {
    tags: "",
  },
  page: {
    content: "",
    created: "20220831131637",
  },
  content: {
    content: "",
  },
})
const formData = ref({
  postForm: new PostForm(),
})

// composables
const { slugData, initSlug } = useSlug(props.pageId, siyuanApi)
const {
  yamlData,
  onYamlContentFocus,
  doConvertAttrToYAML,
  doConvertYAMLToAttr,
  copyYamlToClipboard,
  onYamlContextMenu,
  initYaml,
} = useYaml()

// page methods
const onEditModeChange = (val: PageEditMode) => {
  formOptionData.etype = val

  if (val === PageEditMode.EditMode_source) {
    convertAttrToYAML(true)
  }
}

const onYamlShowTypeChange = (val) => {
  formOptionData.stype = val

  switch (val) {
    case SourceContentShowType.YAML:
      initYaml(yamlData.formatter)
      break
    case SourceContentShowType.CONTENT:
      initYaml(yamlData.mdContent)
      break
    case SourceContentShowType.YAML_CONTENT:
      initYaml(yamlData.formatter + yamlData.mdContent)
      break
    case SourceContentShowType.HTML_CONTENT:
      initYaml(yamlData.htmlContent)
      break
    default:
      break
  }
}

const getDocPath = () => {
  const postidKey = getApiParams<IGithubCfg>(props.apiType).posidKey
  const meta: any = siyuanData.value.meta
  return meta[postidKey] || ""
}

// 将文档路径转换为分类
const convertDocPathToCategories = (
  docPath: string,
  publishCfg: PublishPreference
) => {
  logger.debug("docPath=>", docPath)
  const docPathArray = docPath.split("/")
  if (docPathArray.length > 1) {
    formData.value.postForm.formData.categories = []
    for (let i = 1; i < docPathArray.length - 1; i++) {
      let docCat
      if (publishCfg.fixTitle) {
        docCat = mdFileToTitle(docPathArray[i])
      } else {
        docCat = docPathArray[i]
      }
      formData.value.postForm.formData.categories.push(docCat)
    }
  }
}

// 思源笔记转formData，主要是初始化
const siyuanDataToForm = (publishCfg: PublishPreference) => {
  let fmtTitle = siyuanData.value.page.content
  if (publishCfg.fixTitle) {
    fmtTitle = mdFileToTitle(fmtTitle)
  }
  formData.value.postForm.formData.title = fmtTitle

  const slugKey = SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY
  formData.value.postForm.formData.customSlug = siyuanData.value.meta[slugKey]

  const descKey = SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY
  formData.value.postForm.formData.desc = siyuanData.value.meta[descKey]

  formData.value.postForm.formData.created = formatNumToZhDate(
    siyuanData.value.page.created
  )

  formData.value.postForm.formData.tag.dynamicTags = []
  const tagstr = siyuanData.value.meta.tags || ""
  const tgarr = tagstr.split(",")
  for (let i = 0; i < tgarr.length; i++) {
    const tg = tgarr[i]
    if (tg !== "") {
      formData.value.postForm.formData.tag.dynamicTags.push(tgarr[i])
    }
  }

  const dataContent = siyuanData.value.content
  let md = dataContent.content
  md = removeMdWidgetTag(md)
  if (publishCfg.removeH1) {
    md = removeMdH1(md)
  }
  formData.value.postForm.formData.mdContent = md
  formData.value.postForm.formData.htmlContent = mdToHtml(md)
}

// 组件数据转formData，主要是修改页面之后同步
const composableDataToForm = () => {
  formData.value.postForm.formData.customSlug = slugData.customSlug
}

// 组件在页面上尽量使用自带的Data，这个是与DOM绑定的，可以实时获取最新数据，有改变的时候同步formData
// 调用之前先同步form

// 调用之前先同步form
const convertAttrToYAML = (hideTip?: boolean) => {
  const publishCfg = getPublishCfg()
  const githubCfg = getJSONConf<IGithubCfg>(props.apiType)

  composableDataToForm()

  doConvertAttrToYAML(props.yamlConverter, formData.value.postForm, githubCfg)
  onYamlShowTypeChange(publishCfg.contentShowType)

  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

const convertYAMLToAttr = () => {
  doConvertYAMLToAttr()
}

const initPage = async () => {
  isInitLoading.value = true

  try {
    // 读取偏好设置
    const publishCfg = getPublishCfg()
    formOptionData.etype = publishCfg.editMode
    formOptionData.stype = publishCfg.contentShowType

    // 读取平台配置
    const githubCfg = getJSONConf<IGithubCfg>(props.apiType)
    apiStatus.value = githubCfg.apiStatus

    // 获取页面ID
    const pageId = await getPageId(true, props.pageId)
    if (!pageId || pageId === "") {
      isInitLoading.value = false

      logger.error(t("page.no.id"))
      ElMessage.error(t("page.no.id"))
      return
    }

    // 思源笔记数据
    siyuanData.value.pageId = pageId
    siyuanData.value.meta = await siyuanApi.getBlockAttrs(pageId)
    siyuanData.value.page = await siyuanApi.getBlockByID(pageId)
    siyuanData.value.content = await siyuanApi.exportMdContent(pageId)

    // Form数据
    siyuanDataToForm(publishCfg)
    // 默认目录
    formData.value.postForm.formData.customPath =
      githubCfg.defaultPath ?? "尚未配置"
    // convertDocPathToCategories(
    //   formData.value.postForm.formData.customPath,
    //   publishCfg
    // )
    // 发布状态
    isPublished.value = getPublishStatus(props.apiType, siyuanData.value.meta)
    if (isPublished.value) {
      formData.value.postForm.formData.customPath = getDocPath()
      convertDocPathToCategories(
        formData.value.postForm.formData.customPath,
        publishCfg
      )
    }
    logger.debug("formData=>", formData.value)

    // ===========================
    // 后面尽量使用formData获取数据
    // ===========================

    // composables 初始化
    // 别名
    const slugKey = SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY
    await initSlug(siyuanData.value.meta[slugKey])

    // 表单属性转换为YAML
    doConvertAttrToYAML(props.yamlConverter, formData.value.postForm, githubCfg)
    // 显示默认（内部调用initYaml）
    onYamlShowTypeChange(publishCfg.contentShowType)

    // ================
    // 处理发布之后的数据
    // ================
  } catch (e) {
    const errmsg = appendStr(t("main.opt.failure"), "=>", e)
    logger.error(errmsg)
    // ElMessage.error(errmsg)
  }

  isInitLoading.value = false
}

// life cycle
/**
 * 监听props
 */
watch(
  () => props.isReload,
  async (oldValue, newValue) => {
    // 初始化
    await initPage()
    logger.debug(props.apiType + "_Main检测到更新操作，刷新页面")
  }
)
onMounted(async () => {
  await initPage()
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
