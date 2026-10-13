<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { computed, onMounted, reactive, toRaw } from "vue"
import { SourceContentShowType } from "~/src/models/sourceContentShowType.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PicbedServiceTypeEnum, Post, PostUtil, YamlConvertAdaptor, YamlFormatObj, YamlStrategy } from "zhi-blog-api"
import { BrowserUtil } from "zhi-device"
import { ElMessage } from "element-plus"
import { DateUtil, StrUtil, YamlUtil } from "zhi-common"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import Adaptors from "~/src/adaptors"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { LuteUtil } from "~/src/utils/luteUtil.ts"

const logger = createAppLogger("source-mode")
const { t } = useAppI18n()
const { kernelApi } = useSiyuanApi()

/**
 * 预览入口的能力形状：由 BaseWebApi / BaseBlogApi 提供（与发布链路同源）
 */
type ImagePreviewAdaptor = {
  previewImageProcess(post: Post, id?: string, publishCfg?: any): Promise<Post>
}

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
  // 初始为加载态：初始化在 onMounted 中执行（组件改为同步 setup），
  // 先显示骨架屏，避免初始化前内容为空/闪烁。
  isLoading: true,

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

  // 图片处理提示：正文含图片时，提示上传与链接替换在发布时进行
  showImageNotice: false,
  // 单平台场景（PicGo / 平台图床）且正文含图片时，可手动触发「上传并预览替换后的内容」；
  // 批量分发没有单平台上下文，不提供预览
  canPreviewUpload: false,
  // 图片上传预览（显示层专用，不写入 yamlFormatObj / siyuanPost）
  previewMode: false,
  previewLoading: false,
  previewMd: "",
  previewHtml: "",
})

// 预览按钮文案：按当前状态切换
const previewActionText = computed(() => {
  if (formData.previewLoading) {
    return t("yaml.image.preview.loading")
  }
  if (formData.previewMode) {
    return t("yaml.image.preview.restore")
  }
  return t("yaml.image.preview.action")
})

const emit = defineEmits(["emitSyncPost", "edmtSyncToSiyuan"])

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
      initYaml(formData.previewMode ? formData.previewMd : formData.yamlFormatObj.mdContent)
      break
    case SourceContentShowType.YAML_MD_CONTENT:
      formData.contentReadonlyMode = true
      initYaml(
        formData.previewMode
          ? YamlUtil.addYamlToMd(formData.yamlFormatObj.formatter, formData.previewMd)
          : formData.yamlFormatObj.mdFullContent
      )
      break
    case SourceContentShowType.HTML_CONTENT:
      formData.contentReadonlyMode = true
      initYaml(formData.previewMode ? formData.previewHtml : formData.yamlFormatObj.htmlContent)
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
    // 修改过需要设置为手动，不再自动生成
    formData.siyuanPost.yamlType = YamlStrategy.Yaml_custom_hand
    emit("emitSyncPost", formData.siyuanPost)
    emit("edmtSyncToSiyuan")
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

/**
 * 处理编辑模式到源码模式数据转换
 */
const handlePostToHoHtml = async (post: Post) => {
  let yfmObj: YamlFormatObj = new YamlFormatObj()

  switch (post.yamlType) {
    case YamlStrategy.Yaml_custom_auto: {
      const key = formData.apiType
      yfmObj = formData.yamlAdaptor.convertToYaml(post, undefined, formData.cfg)
      logger.debug("常规发布，自动生成对应平台的YAML, =>", key)
      break
    }

    case YamlStrategy.Yaml_custom_hand: {
      // 属性合并
      const newYfmObj = new YamlFormatObj()
      const newYamlObj = await YamlUtil.yaml2ObjAsync(post.yaml)
      newYfmObj.yamlObj = newYamlObj
      yfmObj = formData.yamlAdaptor.convertToYaml(post, newYfmObj, formData.cfg)
      logger.debug("常规发布，修改过YAML")
      break
    }

    default: {
      // 1、批量分发，此时 apiType 为空
      // 2、某些平台没有适配器
      // 这些情况生成默认的
      const yamlObj = PostUtil.toYamlObj(formData.siyuanPost)
      yfmObj.formatter = YamlUtil.obj2Yaml(yamlObj)
      yfmObj.mdContent = post.markdown
      yfmObj.mdFullContent = YamlUtil.addYamlToMd(yfmObj.formatter, yfmObj.mdContent)
      yfmObj.htmlContent = post.html
      logger.debug("未找到YAML适配器，将生成公共的YAML")
      break
    }
  }

  // 初始化
  formData.yamlFormatObj = yfmObj
  onYamlShowTypeChange(formData.stype)
  logger.info("编辑模式到 YAML 的同步已完成")
}

/**
 * 初始化图片处理提示
 *
 * 图片上传与链接替换在发布时进行；
 * 正文包含图片且图床服务会处理图片时，提示此处显示的是原始 Markdown。
 */
const initImageNotice = async () => {
  // 图床服务为「不使用」时，图片不会被上传或替换，无需提示
  const picbedService = (formData.cfg as CommonBlogConfig)?.picbedService
  if (picbedService === PicbedServiceTypeEnum.None) {
    return
  }
  if (StrUtil.isEmptyString(formData.pageId)) {
    return
  }
  try {
    const imageBlocks = await kernelApi.getImageBlocksByID(formData.pageId)
    formData.showImageNotice = (imageBlocks?.length ?? 0) > 0
    // 单平台场景提供「上传并预览」入口（与发布链路同源处理图片）
    formData.canPreviewUpload = formData.showImageNotice && !StrUtil.isEmptyString(formData.apiType)
  } catch (e) {
    // 提示属于辅助信息，读取失败不阻断源码展示
    logger.warn("读取图片块失败，跳过源码模式图片提示", e)
  }
}

/**
 * 手动触发「上传并预览替换后的内容」
 *
 * 与发布时的图片处理走同一条链路（按图床服务分流：PicGo 内核 / 平台图床），
 * 点击后将立即上传图片并把 MD 相关视图切换为替换后的内容；
 * 再次点击退出预览、恢复原文。预览内容仅用于显示，不写入文档。
 */
const toggleImagePreview = async () => {
  if (formData.previewLoading) {
    return
  }
  // 二次点击：退出预览，恢复原文显示
  if (formData.previewMode) {
    formData.previewMode = false
    onYamlShowTypeChange(formData.stype)
    return
  }
  formData.previewLoading = true
  try {
    const adaptor = (await Adaptors.getAdaptor(formData.apiType, formData.cfg)) as unknown as ImagePreviewAdaptor
    const previewedPost = await adaptor.previewImageProcess(formData.siyuanPost, formData.pageId, {
      cfg: formData.cfg,
    })
    formData.previewMd = previewedPost.markdown
    formData.previewHtml = LuteUtil.mdToHtml(previewedPost.markdown)
    formData.previewMode = true
    onYamlShowTypeChange(formData.stype)
    // 与发布一致：图片上传失败不中断，收集后提示
    const imageUploadErrors = (previewedPost as any).imageUploadErrors as string[] | undefined
    if (imageUploadErrors?.length) {
      ElMessage.warning(imageUploadErrors.join("\n"))
    }
  } catch (e) {
    ElMessage.error(e.message)
    logger.error(t("main.opt.failure") + "=>", e)
  } finally {
    formData.previewLoading = false
  }
}

const initPage = async () => {
  formData.isLoading = true
  try {
    const post = formData.siyuanPost

    // 图片处理提示（源码模式不做图床预处理，图片在发布时上传并替换）
    await initImageNotice()

    // 没有平台 Key，不展示 YAML
    formData.yamlAdaptor = formData.readonlyMode ? null : await Adaptors.getYamlAdaptor(formData.apiType, formData.cfg)
    // 如果传了 key ，但是没有 YAML 适配器，还是不能展示
    formData.readonlyMode = formData.yamlAdaptor === null

    // 控制默认展示方式，如果有适配器，优先展示 YAML
    if (!formData.readonlyMode) {
      formData.stype = SourceContentShowType.YAML
    }

    // 处理编辑模式到源码模式数据转换
    await handlePostToHoHtml(post)

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

// 不能用顶层 await：顶层 await 使组件 setup 返回 Promise，必须被 <Suspense> 包裹，
// 否则源码模式在本插件的单发/批量容器中完全无法渲染。改为挂载后执行初始化。
onMounted(async () => {
  await initPage()
})
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

    <!-- 图片处理提示：上传与链接替换在发布时进行；单平台场景提供「上传并预览」 -->
    <el-form-item v-if="formData.showImageNotice">
      <el-alert :closable="false" class="top-yaml-tip image-preview-tip" type="warning">
        <template #title>
          <span>{{ formData.previewMode ? t("yaml.image.preview.tip") : t("yaml.image.tip") }}</span>
          <el-button
            v-if="formData.canPreviewUpload"
            link
            type="primary"
            size="small"
            :loading="formData.previewLoading"
            @click="toggleImagePreview"
          >
            {{ previewActionText }}
          </el-button>
        </template>
      </el-alert>
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
        <el-alert
          v-if="!formData.readonlyMode"
          class="top-yaml-tip"
          :closable="false"
          :title="t('main.read.mode.tip4')"
          type="error"
        />
        -->
      </el-form-item>
    </div>
  </div>
</template>

<style scoped lang="stylus">
@import "../../../../assets/variables.styl"

.top-tip
  margin 10px 0

.top-yaml-tip
  padding 2px 4px
  margin 0 10px 0 0

.image-preview-tip
  :deep(.el-alert__title)
    display inline-flex
    align-items center
    gap 8px
    flex-wrap wrap

.source-opt
  margin-bottom: 10px

  a
    // 语义令牌已主题优先，无需再单独写 html.dark 覆盖
    --text-color: $syp-text-primary
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

:deep(.readonly-textarea .el-textarea__inner)
  background-color $syp-bg-tertiary
  color $syp-text-tertiary
  cursor default

.un-saved-tip
  color var(--el-color-danger)
  margin-bottom 0
  a
    cursor pointer
</style>
