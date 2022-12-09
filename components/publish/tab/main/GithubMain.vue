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

            <!-- 显示方式 -->
            <el-form-item>
              <div class="source-opt">
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
              </div>

              <!-- YAML数据 -->
              <el-input
                ref="fmtRefInput"
                v-model="yamlData.yamlContent"
                :autosize="{ minRows: 4, maxRows: 16 }"
                type="textarea"
                v-on:focus="onYamlContentFocus"
              />
            </el-form-item>

            <!-- 操作 -->
            <el-form-item>
              <el-button type="primary" @click="convertAttrToYAML"
                >{{ $t("main.siyuan.to.yaml") }}
              </el-button>
              <el-button type="primary" @click="convertYAMLToAttr"
                >{{ $t("main.yaml.to.siyuan") }}
              </el-button>
              <el-button type="primary" @click="copyToClipboard"
                >{{ $t("main.copy") }}
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-main>
    </el-container>
    <el-skeleton :loading="isInitLoading" :rows="5" animated />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { PageEditMode } from "~/utils/common/pageEditMode"
import { SourceContentShowType } from "~/utils/common/sourceContentShowType"
import { getPublishCfg } from "~/utils/publishUtil"
import { appendStr, upperFirst } from "~/utils/strUtil"
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
})
const isInitLoading = ref(false)
const apiStatus = ref(false)
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
})

// composables
const { slugData, makeSlug, initSlug } = useSlug(props.pageId, siyuanApi)
const {
  yamlData,
  onYamlContentFocus,
  convertAttrToYAML,
  convertYAMLToAttr,
  copyToClipboard,
  initYaml,
} = useYaml()

// page methods
const onEditModeChange = (val: PageEditMode) => {
  formOptionData.etype = val
}

const onYamlShowTypeChange = (val) => {
  formOptionData.stype = val

  switch (val) {
    case SourceContentShowType.YAML:
      yamlData.yamlContent = yamlData.formatter
      break
    case SourceContentShowType.CONTENT:
      yamlData.yamlContent = yamlData.mdContent
      break
    case SourceContentShowType.YAML_CONTENT:
      yamlData.yamlContent = yamlData.formatter + yamlData.mdContent
      break
    case SourceContentShowType.HTML_CONTENT:
      yamlData.yamlContent = yamlData.htmlContent
      break
    default:
      break
  }
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

    // 获取最新属性
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

    // composables 初始化
    // 别名
    const slugKey = SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY
    await initSlug(siyuanData.value.meta[slugKey])

    // 发布内容
    // 表单属性转换为YAML
    yamlData.formatter = convertAttrToYAML()
    const data = await siyuanApi.exportMdContent(siyuanData.value.pageId)
    let md = data.content
    md = removeMdWidgetTag(md)
    if (publishCfg.removeH1) {
      md = removeMdH1(md)
    }
    yamlData.mdContent = md
    yamlData.mdFullContent = yamlData.formatter + "\n" + yamlData.mdContent
    yamlData.htmlContent = mdToHtml(md)
    // 显示默认
    onYamlShowTypeChange(publishCfg.contentShowType)

    // YAML
    initYaml(yamlData.yamlContent)
  } catch (e) {
    const errmsg = appendStr(t("main.opt.failure"), "=>", e)
    logger.error(errmsg)
    // ElMessage.error(errmsg)
  }

  isInitLoading.value = false
}

// life cycle
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
</style>
