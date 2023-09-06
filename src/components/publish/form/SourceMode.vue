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
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { reactive, toRaw } from "vue"
import { SourceContentShowType } from "~/src/models/sourceContentShowType.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { Post, PostUtil, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { BrowserUtil } from "zhi-device"
import { ElMessage } from "element-plus"
import { DateUtil, StrUtil, YamlUtil } from "zhi-common"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import Adaptors from "~/src/adaptors"
import { usePicgoBridge } from "~/src/composables/usePicgoBridge.ts"
import { getDynYamlKey } from "~/src/platforms/dynamicConfig.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"

const logger = createAppLogger("source-mode")
const { t } = useVueI18n()
const { handlePicgo } = usePicgoBridge()
const { kernelApi } = useSiyuanApi()

const props = defineProps({
  modelValue: {
    type: Object,
    default: {} as Post,
  },
  pageId: {
    type: String,
    default: "",
  },
  apiType: {
    type: String,
    default: "",
  },
  cfg: {
    type: Object,
    default: {} as CommonBlogConfig,
  },
})

const formData = reactive({
  isLoading: false,

  stype: SourceContentShowType.MD_CONTENT,
  contentReadonlyMode: true,
  readonlyMode: StrUtil.isEmptyString(props.apiType),
  syncStatus: "info",
  syncMessage: "未修改",

  pageId: props.pageId,
  apiType: props.apiType,
  cfg: props.cfg as CommonBlogConfig,
  yamlAdaptor: {} as YamlConvertAdaptor,

  // YAML对象
  yamlFormatObj: {} as YamlFormatObj,
  // Post对象
  siyuanPost: props.modelValue as Post,

  // 界面动态显示
  yamlContent: "",
  isSaved: true,
})

const emit = defineEmits(["emitSyncPost"])

// methods
const onYamlShowTypeChange = (val: SourceContentShowType) => {
  formData.stype = val

  switch (val) {
    case SourceContentShowType.YAML:
      formData.contentReadonlyMode = false
      initYaml(formData.yamlFormatObj.formatter)
      break
    case SourceContentShowType.MD_CONTENT:
      formData.contentReadonlyMode = true
      initYaml(formData.yamlFormatObj.mdContent)
      break
    case SourceContentShowType.YAML_MD_CONTENT:
      formData.contentReadonlyMode = true
      initYaml(formData.yamlFormatObj.mdFullContent)
      break
    case SourceContentShowType.HTML_CONTENT:
      formData.contentReadonlyMode = true
      initYaml(formData.yamlFormatObj.htmlContent)
      break
    default:
      break
  }
}

/**
 * @param event
 */
const onYamlContentFocus = (event: any) => {
  event.preventDefault()

  const target = event.target as HTMLTextAreaElement
  target.select()

  if (BrowserUtil.isInBrowser) {
    try {
      BrowserUtil.copyToClipboardInBrowser(formData.yamlContent)
      ElMessage.success(t("main.copy.success"))
    } catch (e) {
      logger.error(t("main.copy.failure"), e)
      ElMessage.error(t("main.copy.failure") + "=>" + e)
    }
  }
}

const onYamlContentInput = (val: any) => {
  logger.debug("仅在常规发布使用")
  formData.isSaved = false
  formData.syncStatus = "info"
  formData.syncMessage = "已修改"
}

const doSaveContentChange = () => {
  formData.yamlFormatObj.formatter = formData.yamlContent
  formData.yamlFormatObj.mdFullContent = YamlUtil.addYamlToMd(
    formData.yamlFormatObj.formatter,
    formData.yamlFormatObj.mdContent
  )
  logger.debug("val =>", formData.yamlContent)
  try {
    const yamlObj = YamlUtil.yaml2Obj(formData.yamlFormatObj.formatter)
    formData.yamlFormatObj.yamlObj = yamlObj
    formData.siyuanPost = formData.yamlAdaptor.convertToAttr(formData.siyuanPost, formData.yamlFormatObj, formData.cfg)
    // 在这里用 emit 更新到父组件
    logger.debug("准备emit =>", {
      post: toRaw(formData.siyuanPost),
    })
    emit("emitSyncPost", formData.siyuanPost)
    formData.syncStatus = "success"
    formData.syncMessage = "YAML已解析成功并同步。同步时间 =>" + DateUtil.formatIsoToZh(new Date().toISOString(), true)
    formData.isSaved = true
  } catch (e) {
    formData.syncStatus = "error"
    formData.syncMessage = "YAML解析失败，YAML将不可用，错误如下 =>" + e
    logger.error("YAML解析失败", e)
  }
}

const onYamlContextMenu = (event: any) => {
  event.preventDefault()
}

/**
 * 初始化
 *
 * @param yaml
 */
const initYaml = async (yaml: string) => {
  formData.yamlContent = yaml
}

const initPage = async () => {
  formData.isLoading = true
  try {
    let yfmObj: YamlFormatObj = new YamlFormatObj()
    const post = formData.siyuanPost
    // 没有平台 Key，不展示 YAML
    formData.yamlAdaptor = formData.readonlyMode ? null : await Adaptors.getYamlAdaptor(formData.apiType, formData.cfg)
    // 如果传了 key ，但是没有 YAML 适配器，还是不能展示
    formData.readonlyMode = formData.yamlAdaptor === null

    // 处理正文
    const id = formData.pageId
    const md = await handlePicgo(id, post.markdown)
    post.markdown = md

    // 批量分发，此时 apiType 为空
    if (formData.readonlyMode) {
      const yamlObj = PostUtil.toYamlObj(formData.siyuanPost)
      yfmObj.formatter = YamlUtil.obj2Yaml(yamlObj)
      yfmObj.mdContent = post.markdown
      yfmObj.mdFullContent = YamlUtil.addYamlToMd(yfmObj.formatter, yfmObj.mdContent)
      yfmObj.htmlContent = post.html
      logger.debug("未找到YAML适配器，将生成公共的YAML")
    } else {
      // 检测
      const key = formData.apiType
      const yamlKey = getDynYamlKey(key)
      const yaml = await kernelApi.getSingleBlockAttr(id, yamlKey)
      const checkYaml = YamlUtil.extractFrontmatter(yaml).trim()
      if (StrUtil.isEmptyString(checkYaml)) {
        yfmObj = formData.yamlAdaptor.convertToYaml(post, formData.cfg)
        logger.info("有适配器未保存，生成新的YAML")
      } else {
        // yamlFormatObj = new YamlFormatObj()
        // const yamlObj = await YamlUtil.yaml2ObjAsync(yaml)
        // yamlFormatObj.yamlObj = yamlFormatObj
        // getPost以已经处理过了
        yfmObj.formatter = yaml
        yfmObj.mdContent = post.markdown
        yfmObj.mdFullContent = YamlUtil.addYamlToMd(yfmObj.formatter, yfmObj.mdContent)
        yfmObj.htmlContent = post.html
        logger.info("有适配器且YAML已保存，无需处理")
      }

      logger.debug("常规发布，生成对应平台的YAML, =>", key)
    }

    // 初始化
    formData.yamlFormatObj = yfmObj
    onYamlShowTypeChange(formData.stype)
    logger.debug(`init Page in source mode, readonlyMode: ${formData.readonlyMode} =>`, {
      siyuanPost: toRaw(formData.siyuanPost),
    })
  } catch (e) {
    ElMessage.error(e.message)
    logger.error(t("main.opt.failure") + "=>", e)
  } finally {
    formData.isLoading = false
  }
}

await initPage()
</script>

<template>
  <el-skeleton class="placeholder" v-if="formData.isLoading" :rows="5" animated />
  <div class="source-mode" v-else>
    <!-- YAML提示 -->
    <el-form-item v-if="!formData.isSaved" class="un-saved-tip">
      检测到有未保存的更改，是否保存？<a @click="doSaveContentChange">马上保存</a>
    </el-form-item>
    <el-form-item v-if="!formData.readonlyMode">
      <el-alert
        :closable="false"
        :title="formData.syncMessage"
        class="top-yaml-tip"
        :type="formData.syncStatus as any"
      />
    </el-form-item>

    <!-- 显示方式 -->
    <div class="source-opt">
      <el-form-item>
        <a
          :class="{ current: formData.stype === SourceContentShowType.YAML }"
          @click="onYamlShowTypeChange(SourceContentShowType.YAML)"
        >
          {{ t("yaml.show.type.yaml") }}
        </a>
        <a
          :class="{ current: formData.stype === SourceContentShowType.MD_CONTENT, middle: true }"
          @click="onYamlShowTypeChange(SourceContentShowType.MD_CONTENT)"
        >
          {{ t("yaml.show.type.md") }}
        </a>
        <a
          :class="{ current: formData.stype === SourceContentShowType.YAML_MD_CONTENT, middle: true }"
          @click="onYamlShowTypeChange(SourceContentShowType.YAML_MD_CONTENT)"
        >
          {{ t("yaml.show.type.yamlmd") }}
        </a>
        <a
          :class="{ current: formData.stype === SourceContentShowType.HTML_CONTENT }"
          @click="onYamlShowTypeChange(SourceContentShowType.HTML_CONTENT)"
        >
          {{ t("yaml.show.type.html") }}
        </a>
      </el-form-item>
    </div>

    <!-- YAML编辑 -->
    <div v-if="!formData.contentReadonlyMode && !formData.readonlyMode" id="yaml-edit-content">
      <el-form-item>
        <el-input
          v-model="formData.yamlContent"
          :autosize="{ minRows: 4, maxRows: 16 }"
          type="textarea"
          @input="onYamlContentInput"
        />
      </el-form-item>
    </div>

    <!-- YAML预览 -->
    <div v-else id="yaml-detail-content">
      <el-form-item>
        <el-input
          id="yaml-detail-preview"
          v-model="formData.yamlContent"
          :autosize="{ minRows: 4, maxRows: 16 }"
          readonly
          type="textarea"
          class="readonly-textarea"
          @click="onYamlContentFocus"
          v-on:contextmenu="onYamlContextMenu"
        />
      </el-form-item>
    </div>

    <!--
    <div id="yaml-action">
      <el-form-item>
        <el-button size="small" type="danger">保存YAML</el-button>
      </el-form-item>
    </div>
    -->

    <!-- 只读提示 -->
    <div id="yaml-read-mode-tip">
      <el-form-item>
        <el-alert
          v-if="formData.readonlyMode"
          class="top-yaml-tip"
          :closable="false"
          :title="t('main.read.mode.tip1')"
          type="error"
        />
        <!--
        <el-alert
          v-if="!formData.readonlyMode"
          class="top-yaml-tip"
          :closable="false"
          :title="t('main.read.mode.tip2')"
          type="warning"
        />
        -->
        <!--
        <el-alert
          v-if="!formData.readonlyMode"
          class="top-yaml-tip"
          :closable="false"
          :title="t('main.read.mode.tip3')"
          type="error"
        />
        -->
        <el-alert
          v-if="!formData.readonlyMode"
          class="top-yaml-tip"
          :closable="false"
          :title="t('main.read.mode.tip4')"
          type="error"
        />
      </el-form-item>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.top-tip
  margin 10px 0
  padding-left 0

.top-yaml-tip
  padding 2px 4px
  margin 0 10px 0 0

.source-opt
  margin-bottom: 10px

  a
    --text-color: #1a1a1a
    /*padding: 4px 2px*/
    cursor: pointer
    /*border: solid 1px #409eff*/
    color: var(--text-color)
    font-size: 16px
    font-weight: 400

    &:first-child
      margin-right: 22px

    &.middle
      margin-right: 22px

    &.current
      --text-blue-color: #0084ff
      /*background-color: #409eff*/
      /*color: #ffffff*/
      color: var(--text-blue-color)
      font-weight: 600

html.dark .source-opt a
  --text-color: #999

:deep(.readonly-textarea .el-textarea__inner)
  background-color #f0f0f0
  color #888
  cursor default

.un-saved-tip
  color var(--el-color-danger)
  margin-bottom 0
  a
    cursor pointer
</style>

<style lang="css">
html.dark .readonly-textarea .el-textarea__inner {
  background-color: #333;
  color: #ddd;
}
</style>
