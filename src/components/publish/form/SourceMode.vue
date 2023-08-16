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
import { Post } from "zhi-blog-api"
import { BrowserUtil } from "zhi-device"
import { ElMessage } from "element-plus"
import { DateUtil, StrUtil, YamlUtil } from "zhi-common"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import { YamlFormatObj } from "~/src/models/yamlFormatObj.ts"
import Adaptors from "~/src/adaptors"
import { YamlConvertAdaptor } from "~/src/platforms/yamlConvertAdaptor.ts"

const logger = createAppLogger("source-mode")
const { t } = useVueI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    default: {} as Post,
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
  stype: SourceContentShowType.YAML,
  contentReadonlyMode: true,
  readonlyMode: StrUtil.isEmptyString(props.apiType),
  syncStatus: "info",
  syncMessage: "未修改",

  cfg: {} as CommonBlogConfig,
  yamlAdaptor: {} as YamlConvertAdaptor,

  // YAML对象
  yamlFormatObj: {} as YamlFormatObj,
  // Post对象
  siyuanPost: props.modelValue as Post,

  // 界面动态显示
  yamlContent: "",
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
    case SourceContentShowType.CONTENT:
      formData.contentReadonlyMode = true
      initYaml(formData.yamlFormatObj.mdContent)
      break
    case SourceContentShowType.YAML_CONTENT:
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
      ElMessage.success(t("main.opt.success"))
    } catch (e) {
      logger.error(t("main.opt.failure"), e)
      ElMessage.error(t("main.opt.failure") + "=>" + e)
    }
  }
}

const onYamlContentInput = (val: any) => {
  logger.debug("仅在常规发布使用")
  formData.yamlFormatObj.formatter = val
  formData.yamlFormatObj.mdFullContent = `${formData.yamlFormatObj.formatter}\n${formData.yamlFormatObj.mdContent}`
  logger.debug("val =>", val)
  try {
    const yamlObj = YamlUtil.yaml2Obj(formData.yamlFormatObj.formatter)
    formData.yamlFormatObj.yamlObj = yamlObj
    formData.siyuanPost = formData.yamlAdaptor.convertToAttr(formData.siyuanPost, formData.yamlFormatObj, formData.cfg)
    // 在这里用 emit 更新到父组件
    logger.debug("准备emit =>", formData.siyuanPost)
    emit("emitSyncPost", formData.siyuanPost)
    formData.syncStatus = "success"
    formData.syncMessage = "YAML已解析成功并同步。同步时间 =>" + DateUtil.formatIsoToZh(new Date().toISOString(), true)
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
const initYaml = (yaml: string) => {
  formData.yamlContent = yaml
}

const initPage = async () => {
  let yfmObj: YamlFormatObj = new YamlFormatObj()
  const post = formData.siyuanPost
  formData.cfg = props.cfg as CommonBlogConfig
  formData.yamlAdaptor = await Adaptors.getYamlAdaptor(props.apiType, formData.cfg)
  if (formData.yamlAdaptor === null) {
    formData.readonlyMode = true
  }

  // 批量分发，此时 apiType 为空
  if (formData.readonlyMode) {
    yfmObj.formatter = YamlUtil.obj2Yaml(formData.siyuanPost.toYamlObj())
    yfmObj.mdContent = formData.siyuanPost.markdown
    yfmObj.mdFullContent = `${yfmObj.formatter}\n${yfmObj.mdContent}`
    yfmObj.htmlContent = post.html
    logger.debug("未找到YAML适配器，将生成公共的YAML")
  } else {
    yfmObj = formData.yamlAdaptor.convertToYaml(post, formData.cfg)
    logger.debug("常规发布，生成对应平台的YAML, =>", props.apiType)
  }

  // 初始化
  formData.yamlFormatObj = yfmObj
  onYamlShowTypeChange(formData.stype)
  logger.debug(`init Page in source mode, readonlyMode: ${formData.readonlyMode} =>`, {
    siyuanPost: toRaw(formData.siyuanPost),
  })
}

await initPage()
</script>

<template>
  <div class="source-mode">
    <!-- YAML提示 -->
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
          :class="{ current: formData.stype === SourceContentShowType.CONTENT, middle: true }"
          @click="onYamlShowTypeChange(SourceContentShowType.CONTENT)"
        >
          {{ t("yaml.show.type.md") }}
        </a>
        <a
          :class="{ current: formData.stype === SourceContentShowType.YAML_CONTENT, middle: true }"
          @click="onYamlShowTypeChange(SourceContentShowType.YAML_CONTENT)"
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
        <el-alert
          v-if="!formData.readonlyMode"
          class="top-yaml-tip"
          :closable="false"
          :title="t('main.read.mode.tip3')"
          type="error"
        />
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
</style>
<style lang="css">
html.dark .readonly-textarea .el-textarea__inner {
  background-color: #333;
  color: #ddd;
}
</style>
