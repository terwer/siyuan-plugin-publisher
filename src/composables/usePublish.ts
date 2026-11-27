/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ElMessage } from "element-plus"
import * as _ from "lodash-es"
import { reactive } from "vue"
import {
  BlogConfig,
  Post,
  PostStatusEnum,
  PostUtil,
  YamlConvertAdaptor,
  YamlFormatObj,
  YamlStrategy,
} from "zhi-blog-api"
import { AliasTranslator, ObjectUtil, StrUtil, YamlUtil } from "zhi-common"
import { SiyuanAttr } from "zhi-siyuan-api"
import Adaptors from "~/src/adaptors"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { usePublishRecords } from "~/src/composables/usePublishRecords.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { MethodEnum } from "~/src/models/methodEnum.ts"
import { DynamicConfig, getDynCoverKey, getDynMetadataOverridesKey, getDynYamlKey } from "~/src/platforms/dynamicConfig.ts"
import { pre } from "~/src/platforms/pre.ts"
import { usePlatformMetadataStore } from "~/src/stores/usePlatformMetadataStore.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { IPublishCfg } from "~/src/types/IPublishCfg.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { sanitizeSensitiveForLog } from "~/src/utils/sensitiveLogSanitizer.ts"
import { mergeDocAttrs } from "~/src/utils/docAttrs.ts"
import { normalizePlatformPostMetadata } from "~/src/adaptors/base/platformPostMetadata.ts"
import {
  getFeaturedImage,
  initFeaturedImageFromYaml,
  isFeaturedImageEnabled,
  syncFeaturedImageYaml,
  type FeaturedImagePost,
} from "~/src/utils/featuredImage.ts"
import { isYamlCoverEnabled } from "~/src/utils/yamlCover.ts"
import {
  applyDocMetadataOverrides,
  clearOverridesMatchingDoc,
  extractSiyuanMetadata,
  parseMetadataOverrides,
  serializeMetadataOverrides,
  type PublishMetadataPost,
} from "~/src/utils/publishMetadata.ts"
import { SypConfig } from "~/syp.config.ts"

/**
 * 通用发布组件
 *
 * @author terwer
 * @version 1.3.2
 * @since 1.0.0
 */
const usePublish = () => {
  const logger = createAppLogger("use-publish")

  // uses
  const { t } = useAppI18n()
  const { updateSetting } = usePublishSettingStore()
  const { kernelApi, blogApi } = useSiyuanApi()
  const { getPublishApi } = usePublishConfig()
  const { updatePlatformMetadata } = usePlatformMetadataStore()
  const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()
  const { unbind: unbindPublishRecord } = usePublishRecords()

  // datas
  const singleFormData = reactive({
    isPublishLoading: false,
    publishProcessStatus: false,
    isAdd: true,
    errMsg: "",
  })

  /**
   * 发布源笔记本硬校验（issue #2044）。
   *
   * 仅当配置了授权笔记本集合（`publishSourceNotebooks` 非空）时拦截：
   * 取源文档的 `blocks.box`，若不在授权集合内则抛出清晰错误。
   * 取不到 `box` 视为「未限定」，放行并记录日志（避免误拦）。
   *
   * @param id - 思源源文档 id
   */
  const assertNotebookAllowed = async (id: string) => {
    const allowed = getReadOnlyPublishPreferenceSetting().value.publishSourceNotebooks ?? []
    if (allowed.length === 0) {
      return
    }

    let box: string | undefined
    try {
      const block = await kernelApi.getBlockByID(id)
      box = block?.box
    } catch (e) {
      // 取不到块信息时不做笔记本校验，交给后面的发布流程报错
    }

    if (box && !allowed.includes(box)) {
      throw new Error(`该文档所属笔记本（${box}）不在发布的授权笔记本集合内，无法发布。`)
    }
  }

  /**
   * 统一的发布操作
   *
   * @param key - 平台 key
   * @param id - 思源笔记的ID
   * @param publishCfg - 发布配置
   * @param doc - 思源笔记原始文档
   */
  const doSinglePublish = async (key: string, id: string, publishCfg: IPublishCfg, doc: Post) => {
    const setting: typeof SypConfig = publishCfg.setting
    const cfg: BlogConfig = publishCfg.cfg
    const dynCfg: DynamicConfig = publishCfg.dynCfg

    // vars
    let postid: string
    let postPreviewUrl: string
    let publishErrorDetails = ""
    let imageSkippedCount = 0
    singleFormData.errMsg = ""
    singleFormData.publishProcessStatus = false
    try {
      // 发布源笔记本硬校验（issue #2044）：仅在配置了授权笔记本集合时拦截
      await assertNotebookAllowed(id)

      // 系统内置
      const isSys = pre.systemCfg.some((item) => item.platformKey === key)

      // 校验
      if (isSys) {
        // 内置平台直接用思源的ID
        postid = id
      } else {
        // 检测是否发布
        const posidKey = cfg.posidKey
        if (StrUtil.isEmptyString(posidKey)) {
          throw new Error("配置错误，posidKey不能为空，请检查配置")
        }

        const postMeta = ObjectUtil.getProperty(setting, id, {})
        postid = ObjectUtil.getProperty(postMeta, posidKey)
      }
      singleFormData.isAdd = StrUtil.isEmptyString(postid)

      // 事后排查只需要「对哪篇文档、往哪个平台、做什么」，过程不再逐条记录
      logger.info(`[publish] start platform=${key} doc=${id} action=${singleFormData.isAdd ? "create" : "update"}`)

      // 确保每次发布都是新的副本
      const post = _.cloneDeep(doc) as Post
      // 保证postid一致
      post.postid = postid

      // 初始化API
      const api = await getPublishApi(key, cfg)

      // ===================================
      // 文章预处理开始
      // ===================================
      const finalPost = await api.preEditPost(post, id, publishCfg)
      // 图片自动上传策略命中跳过时，把跳过数量回传给界面提示（issue #2040）
      imageSkippedCount = Number((finalPost as any).imageUploadSkippedCount ?? 0)
      // 检查图片上传错误（preEditPost内部图片上传失败时不抛异常，而是收集到post自定义属性上）
      const imageErrors = (finalPost as any).imageUploadErrors as string[] | undefined
      if (imageErrors && imageErrors.length > 0) {
        singleFormData.errMsg = sanitizePublishText(imageErrors.join("\n"))
        logger.warn(`图片上传存在${imageErrors.length}个错误，已记录到errMsg`)
      }
      const imageErrorDetails = (finalPost as any).imageUploadErrorDetails as string[] | undefined
      // 文本图渲染/上传失败：保留代码块，作为发布警告返回，不阻断发布
      const diagramErrors = (finalPost as any).diagramRenderErrors as string[] | undefined
      if (diagramErrors && diagramErrors.length > 0) {
        singleFormData.errMsg = [singleFormData.errMsg, ...diagramErrors].filter(Boolean).join("\n")
        logger.warn(`文本图处理存在${diagramErrors.length}个问题，已记录到errMsg`)
      }
      const diagramErrorDetails = (finalPost as any).diagramRenderErrorDetails as string[] | undefined
      publishErrorDetails = sanitizePublishText(
        [imageErrorDetails?.join("\n\n") ?? "", diagramErrorDetails?.join("\n\n") ?? ""].filter(Boolean).join("\n\n") ||
          singleFormData.errMsg
      )

      // 静态站封面由发布层写入 Front Matter，表单选择保存在平台元数据里，
      // 不能写进平台 YAML（否则内部字段会进入已发布正文）。
      if (!isYamlCoverEnabled(cfg) && isFeaturedImageEnabled(cfg)) {
        syncFeaturedImageYaml(finalPost)
      }
      // ===================================
      // 文章预处理结束
      // ===================================

      // 处理发布：新增 或者 更新
      if (singleFormData.isAdd) {

        // result 正常情况下就是 postid
        const result = await api.newPost(finalPost)

        // 写入属性到配置
        postid = result
        const posidKey = cfg.posidKey
        const postMeta = ObjectUtil.getProperty(setting, id, {})
        postMeta[posidKey] = postid
        postMeta[SiyuanAttr.Custom_slug] = finalPost.wp_slug
        setting[id] = postMeta
        await updateSetting(setting)

      } else {

        // result 正常情况下是 true
        await api.editPost(postid, finalPost)
        // 写入属性到配置
        const postMeta = ObjectUtil.getProperty(setting, id, {})
        let shouldUpdateSetting = false

        // 这里更新 slug 的原因是历史文章有可能没有生成过别名；如果用户在发布页修改了别名，也要以本次成功发布后的别名为准。
        // eslint-disable-next-line no-prototype-builtins
        if (!postMeta.hasOwnProperty(SiyuanAttr.Custom_slug) && !StrUtil.isEmptyString(finalPost.wp_slug)) {
          postMeta[SiyuanAttr.Custom_slug] = finalPost.wp_slug
          shouldUpdateSetting = true
        } else if (
          !StrUtil.isEmptyString(finalPost.wp_slug) &&
          postMeta[SiyuanAttr.Custom_slug] !== finalPost.wp_slug
        ) {
          postMeta[SiyuanAttr.Custom_slug] = finalPost.wp_slug
          shouldUpdateSetting = true
        }

        // 检查是否因为目录变更导致postid变化
        if (finalPost.postid && finalPost.postid !== postid) {
          postMeta[cfg.posidKey] = finalPost.postid
          shouldUpdateSetting = true
          // 更新当前使用的postid
          postid = finalPost.postid
          ElMessage.success(`文章目录已更改，发布信息已更新`)
        }

        if (shouldUpdateSetting) {
          setting[id] = postMeta
          await updateSetting(setting)
        }

      }

      // 静态站封面选择保存在平台元数据里，更新时回填；不写入平台 YAML。
      if (isYamlCoverEnabled(cfg)) {
        const coverKey = getDynCoverKey(key)
        const coverValue = getFeaturedImage(finalPost)
        const coverMeta = ObjectUtil.getProperty(setting, id, {})
        const hasSavedCover = Object.prototype.hasOwnProperty.call(coverMeta, coverKey)
        if ((coverValue !== "" || hasSavedCover) && (!hasSavedCover || coverMeta[coverKey] !== coverValue)) {
          coverMeta[coverKey] = coverValue
          setting[id] = coverMeta
          await updateSetting(setting)
        }
      }

      // 详细模式里用户主动改过的思源元数据字段：保存为平台覆盖，再次打开时优先使用
      // 平台侧的值；没改过的字段继续跟随思源文档。改回文档值的字段自动移除覆盖。
      if (!isSys) {
        const overrides = clearOverridesMatchingDoc(finalPost)
        const overridesKey = getDynMetadataOverridesKey(key)
        const overridesMeta = ObjectUtil.getProperty(setting, id, {})
        const previousOverrides = overridesMeta[overridesKey]
        const nextOverrides = overrides.length > 0 ? serializeMetadataOverrides(overrides) : ""
        const hasSavedOverrides = Object.prototype.hasOwnProperty.call(overridesMeta, overridesKey)

        if (nextOverrides === "") {
          if (hasSavedOverrides) {
            delete overridesMeta[overridesKey]
            setting[id] = overridesMeta
            await updateSetting(setting)
          }
        } else if (previousOverrides !== nextOverrides) {
          overridesMeta[overridesKey] = nextOverrides
          setting[id] = overridesMeta
          await updateSetting(setting)
        }
      }

      // 特色图片失败不改变发布结果，但要把原因带给上层，便于界面提示与排障
      const featuredImageError = (finalPost as FeaturedImagePost).featuredImageError
      if (!StrUtil.isEmptyString(featuredImageError)) {
        const previousErrMsg = singleFormData.errMsg
        const featuredImageErrMsg = sanitizePublishText(featuredImageError)
        // 与正文图片上传错误并存时两条都保留，不互相覆盖
        singleFormData.errMsg = StrUtil.isEmptyString(previousErrMsg)
          ? featuredImageErrMsg
          : `${previousErrMsg}\n${featuredImageErrMsg}`
        logger.warn(`特色图片处理失败（正文已发布）=> ${featuredImageError}`)
      }

      // 保存属性用于初始化
      if (isSys) {
      } else {
        // 保存属性
        const yamlKey = getDynYamlKey(key)
        await kernelApi.setSingleBlockAttr(id, yamlKey, finalPost.yaml)

        // 保存元数据
        const metadataPost = _.cloneDeep(finalPost) as Post
        const tags = metadataPost.mt_keywords?.split(",") ?? []
        const cates = metadataPost?.categories ?? []
        const templates = []
        updatePlatformMetadata(key, tags, cates, templates)
      }

      // 更新预览链接
      postPreviewUrl = await getPostPreviewUrl(api, id, cfg)

      singleFormData.publishProcessStatus = true
      logger.info(`[publish] success platform=${key} postid=${postid} url=${postPreviewUrl ?? ""}`)
    } catch (e) {
      singleFormData.errMsg = sanitizePublishText(t("main.opt.failure") + "=>" + e)
      publishErrorDetails = formatPublishDiagnosticError(e)
      // 失败必须可定位：错误原文 + 请求阶段/HTTP 状态/诊断信息
      logger.error(`[publish] failed platform=${key} doc=${id}: ${String(e?.message ?? e)}`)
      logger.error(`[publish] failed detail platform=${key} doc=${id}: ${publishErrorDetails}`)
      await kernelApi.pushErrMsg({
        msg: singleFormData.errMsg,
        timeout: 7000,
      })
      singleFormData.publishProcessStatus = false
    }

    return {
      key: key,
      status: singleFormData.publishProcessStatus,
      name: cfg?.blogName,
      previewUrl: postPreviewUrl,
      errMsg: sanitizePublishText(singleFormData.errMsg),
      errDetails: sanitizePublishText(publishErrorDetails || singleFormData.errMsg),
      imageSkippedCount: imageSkippedCount,
    }
  }

  /**
   * 统一的删除操作
   *
   * @param key - 平台 key
   * @param id - 思源笔记的ID
   * @param publishCfg - 发布配置
   */
  const doSingleDelete = async (key: string, id: string, publishCfg: IPublishCfg) => {
    const setting: typeof SypConfig = publishCfg.setting
    const cfg: BlogConfig = publishCfg.cfg
    const dynCfg: DynamicConfig = publishCfg.dynCfg
    let deleteErrorDetails = ""
    singleFormData.errMsg = ""
    singleFormData.publishProcessStatus = false

    try {
      // 检测是否发布
      const posidKey = cfg.posidKey
      if (StrUtil.isEmptyString(posidKey)) {
        throw new Error("配置错误，posidKey不能为空，请检查配置")
      }

      const postMeta = ObjectUtil.getProperty(setting, id, {})
      const postid = ObjectUtil.getProperty(postMeta, posidKey)
      if (StrUtil.isEmptyString(postid)) {
        throw new Error("未找到postid，无法删除，请手动在平台删除")
      }

      // 初始化API
      const api = await getPublishApi(key, cfg)

      // 处理删除
      singleFormData.publishProcessStatus = await api.deletePost(postid, id, publishCfg)

      // 删除成功才去移除文章发布信息
      if (singleFormData.publishProcessStatus) {
        const postMeta = ObjectUtil.getProperty(setting, id, {})
        const updatedPostMeta = { ...postMeta }
        if (updatedPostMeta.hasOwnProperty(posidKey)) {
          delete updatedPostMeta[posidKey]
        }
        if (updatedPostMeta.hasOwnProperty(SiyuanAttr.Custom_slug)) {
          delete updatedPostMeta[SiyuanAttr.Custom_slug]
        }

        setting[id] = updatedPostMeta
        await updateSetting(setting)

        // 清空属性
        const yamlKey = getDynYamlKey(key)
        await kernelApi.setSingleBlockAttr(id, yamlKey, "")
      }
    } catch (e) {
      singleFormData.errMsg = t("main.opt.failure") + "=>" + e
      deleteErrorDetails = formatPublishDiagnosticError(e)
      logger.error(`[publish] delete failed platform=${key} doc=${id}: ${String(e?.message ?? e)}`)
      logger.error(`[publish] delete failed detail platform=${key} doc=${id}: ${deleteErrorDetails}`)
      // ElMessage.error(singleFormData.errMsg)
      await kernelApi.pushErrMsg({
        msg: singleFormData.errMsg,
        timeout: 7000,
      })
    }

    return {
      key: key,
      status: singleFormData.publishProcessStatus,
      errMsg: sanitizePublishText(singleFormData.errMsg),
      errDetails: sanitizePublishText(deleteErrorDetails || singleFormData.errMsg),
    }
  }

  /**
   * 统一的强制删除操作
   *
   * @param key - 平台 key
   * @param id - 思源笔记的ID
   * @param publishCfg - 发布配置
   */
  const doForceSingleDelete = async (key: string, id: string, publishCfg: IPublishCfg): Promise<boolean> => {
    try {
      const cfg: BlogConfig = publishCfg.cfg

      // 检测是否发布
      const posidKey = cfg.posidKey
      if (StrUtil.isEmptyString(posidKey)) {
        throw new Error("配置错误，posidKey不能为空，请检查配置")
      }

      // 只解除「文档 ↔ 平台」的本地关联（含平台 YAML 属性），别名保留，因为别的平台可能还在用
      await unbindPublishRecord(id, key, posidKey)

      await kernelApi.pushMsg({
        msg: t("main.opt.ok"),
        timeout: 2000,
      })
      ElMessage.success(`[${key}] [${id}] 文章发布信息已强制移除`)
      return true
    } catch (e) {
      ElMessage.error(t("main.opt.failure") + "=>" + e)
      logger.error(t("main.opt.failure") + "=>", e)
      await kernelApi.pushErrMsg({
        msg: t("main.opt.failure") + "=>" + e,
        timeout: 7000,
      })
      return false
    }
  }

  const getPostPreviewUrl = async (api: any, id: string, cfg: BlogConfig) => {
    // 获取最新id，兼容某些平台自定义行为
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    const posidKey = cfg.posidKey
    const postMeta = ObjectUtil.getProperty(setting, id, {})
    const newPostid = postMeta[posidKey]
    let previewUrl = await api.getPreviewUrl(newPostid)
    const isAbsoluteUrl = /^[a-z]+:\/\//.test(previewUrl)
    return isAbsoluteUrl ? previewUrl : StrUtil.pathJoin(cfg?.home ?? "", previewUrl)
  }

  const sanitizePublishText = (input: any): string => {
    const sanitized = sanitizeSensitiveForLog(input)
    if (sanitized === null || sanitized === undefined) {
      return ""
    }
    return typeof sanitized === "string" ? sanitized : JSON.stringify(sanitized)
  }

  const formatPublishDiagnosticError = (error: any): string => {
    const diagnostic = error?.diagnosticMessage || error?.cause?.stack || error?.stack || error?.message || error
    return sanitizePublishText(diagnostic)
  }

  /**
   * 读取思源文档的全部属性。
   *
   * 发布前把完整属性合并进 `Post.attrs`，YAML 预设的 `[attr:...]` 才能读取
   * 任意文档属性（包括 `custom-*`）；读取失败时返回 undefined，不阻断发布。
   */
  const readDocAttrs = async (id: string): Promise<Record<string, any> | undefined> => {
    try {
      return (await kernelApi.getBlockAttrs(id)) ?? undefined
    } catch (e) {
      logger.warn(`[publish] read document attrs failed: ${String(e)}`)
      return undefined
    }
  }

  /**
   * 读取平台 YAML 自定义属性，并带回同一次读取的完整文档属性。
   *
   * 属性名以 `getDynYamlKey` 生成的小写形态为准（思源自定义属性名只允许小写，
   * 见 siyuan-note/siyuan#16447）；历史上写入过含大写字母的属性，读取时按
   * 大小写不敏感匹配兜底一次，避免被当成「还没有保存过 YAML」而重新生成默认值。
   *
   * 返回的 `docAttrs` 供发布前合并进 `Post.attrs`，让 YAML 预设的 `[attr:...]`
   * 读取任意文档属性；只调用一次内核接口。
   */
  const readPlatformYamlWithDocAttrs = async (
    id: string,
    platformKey: string
  ): Promise<{ yaml: string; docAttrs?: Record<string, any> }> => {
    const wantKey = getDynYamlKey(platformKey)
    const docAttrs = await readDocAttrs(id)
    if (docAttrs) {
      // 精确命中优先：新旧 SiYuan 同时存在小写与历史大写属性时，取规范形态
      if (docAttrs[wantKey] !== undefined) {
        return { yaml: docAttrs[wantKey] ?? "", docAttrs }
      }
      const matchedKey = Object.keys(docAttrs).find((name) => name.toLowerCase() === wantKey)
      if (matchedKey) {
        return { yaml: docAttrs[matchedKey] ?? "", docAttrs }
      }
    }
    const yaml = (await kernelApi.getSingleBlockAttr(id, wantKey)) ?? ""
    return { yaml, docAttrs }
  }

  /**
   * 通过 zhi-blog-api 的共享契约获取平台默认别名。
   *
   * 平台未提供站点级别名策略、读取失败或返回空值时返回 undefined，由调用方
   * 回退到插件既有的按标题生成规则，避免因站点接口异常阻断发布。
   */
  const resolveSiteDefaultSlug = async (title: string, publishCfg: IPublishCfg): Promise<string | undefined> => {
    if (StrUtil.isEmptyString(title)) {
      return undefined
    }

    const key = publishCfg.dynCfg?.platformKey
    if (StrUtil.isEmptyString(key)) {
      return undefined
    }

    try {
      const api = await getPublishApi(key, publishCfg.cfg)
      const slug = await api.getDefaultSlug(title)
      return StrUtil.isEmptyString(slug) ? undefined : slug
    } catch (e) {
      logger.warn(`[publish] resolve platform default slug failed, fallback to title slug: ${String(e)}`)
      return undefined
    }
  }

  /**
   * 初始化调用
   *
   * @param post - 文章对象
   * @param id - 思源笔记文档ID
   * @param publishCfg - 发布配置
   */
  const initPublishMethods = {
    // 别名初始化
    assignInitSlug: async (doc: Post, id: string, publishCfg: IPublishCfg) => {
      const setting: typeof SypConfig = publishCfg.setting
      const postMeta = ObjectUtil.getProperty(setting, id, {})

      const post = _.cloneDeep(doc) as Post
      // 别名：用户保存过的自定义别名优先；否则按平台站点策略或标题生成
      const slug = ObjectUtil.getProperty(postMeta, SiyuanAttr.Custom_slug, post.wp_slug)
      if (!StrUtil.isEmptyString(slug)) {
        post.wp_slug = slug
      } else {
        // 如果wp_slug为空，则生成一个新的slug
        let newSlug = await resolveSiteDefaultSlug(post.title, publishCfg)
        if (StrUtil.isEmptyString(newSlug)) {
          newSlug = await AliasTranslator.getPageSlug(post.title, true)
        }
        post.wp_slug = `${newSlug}`
      }

      // 发布状态
      post.post_status = PostStatusEnum.PostStatusEnum_Publish
      return post
    },

    // 分配平台相关的初始化属性
    assignInitAttrs: async (
      doc: Post,
      id: string,
      publishCfg: IPublishCfg,
      options?: { followDocMetadata?: boolean }
    ) => {
      const setting: typeof SypConfig = publishCfg.setting
      const cfg: BlogConfig = publishCfg.cfg
      const dynCfg: DynamicConfig = publishCfg.dynCfg
      const key = dynCfg.platformKey
      const isSys = pre.systemCfg.some((item) => item.platformKey === key)
      const postMeta = ObjectUtil.getProperty(setting, id, {})

      // 别名
      const slugedPost = await initPublishMethods.assignInitSlug(doc, id, publishCfg)

      // 其他属性初始化
      let post = _.cloneDeep(slugedPost) as Post
      if (!isSys) {
        // 无表单的发布路径（快速发布）没有「平台文章」可读，文档本身就是元数据权威源：
        // 平台 YAML 保存的只是上次发布时的快照，不能让旧快照反过来覆盖文档里改过的
        // 标题/摘要/标签/分类。用户此前在详细模式里显式改过的字段仍按覆盖集合保留，
        // 与详细模式共用同一套 applyDocMetadataOverrides 规则。
        if (options?.followDocMetadata) {
          const metadataPost = post as PublishMetadataPost
          metadataPost.siyuanMetadata = extractSiyuanMetadata(doc)
          metadataPost.metadataOverrides = [
            ...parseMetadataOverrides(ObjectUtil.getProperty(postMeta, getDynMetadataOverridesKey(key), "")),
          ]
        }

        // 读取一次文档属性：既用于平台 YAML，也合并进 Post.attrs 供 YAML 预设的
        // [attr:...] 读取任意文档属性（包括 custom-*）。
        const { yaml, docAttrs } = await readPlatformYamlWithDocAttrs(id, key)
        post.attrs = mergeDocAttrs(post.attrs, docAttrs)
        const checkYaml = YamlUtil.extractFrontmatter(yaml).trim()

        // YAML属性转换
        const yamlAdaptor: YamlConvertAdaptor = await Adaptors.getYamlAdaptor(key, cfg)
        if (null !== yamlAdaptor) {
          // 有适配器
          if (StrUtil.isEmptyString(checkYaml)) {
            const yamlFormatObj = yamlAdaptor.convertToYaml(post, undefined, cfg)
            post = yamlAdaptor.convertToAttr(post, yamlFormatObj, cfg)
            post.yamlType = YamlStrategy.Yaml_custom_auto
          } else {
            const yamlFormatObj = new YamlFormatObj()
            const yamlObj = await YamlUtil.yaml2ObjAsync(yaml)
            yamlFormatObj.yamlObj = yamlObj
            post = yamlAdaptor.convertToAttr(post, yamlFormatObj, cfg)
            post.yamlType = YamlStrategy.Yaml_custom_hand
          }
        } else {
          post.yamlType = YamlStrategy.YAML_default
          // 无适配器
          if (!StrUtil.isEmptyString(checkYaml)) {
            const yamlObj = await YamlUtil.yaml2ObjAsync(yaml)
            post.yaml = yaml
            PostUtil.fromYaml(post, yamlObj)
          } else {
            // 未保存过，默认不处理
          }
        }

        // 统一摘要/标签字段，兼容 Astro/Docsify 只写 mt_excerpt 或历史 YAML 的标签格式
        post = normalizePlatformPostMetadata(post)

        // 详细模式的元数据覆盖策略：用户主动改过的字段保留平台侧的值，
        // 没改过的字段跟随思源文档（标题/摘要/标签/分类/时间）。
        post = applyDocMetadataOverrides(post)

        // 封面：静态站从平台元数据回填（封面最终写 Front Matter，不能混进平台 YAML）；
        // 原生封面平台仍从平台 YAML 的 featured_image 回填。
        if (isYamlCoverEnabled(cfg)) {
          const savedCover = ObjectUtil.getProperty(postMeta, getDynCoverKey(key), "")
          if (!StrUtil.isEmptyString(savedCover)) {
            ;(post as FeaturedImagePost).featuredImage = savedCover
          }
        } else if (isFeaturedImageEnabled(cfg)) {
          initFeaturedImageFromYaml(post)
        }
      }

      return post
    },

    // 常规发布初始化
    doInitSinglePage: async (
      key: string,
      id: string,
      method: MethodEnum = MethodEnum.METHOD_ADD,
      publishCfg: IPublishCfg
    ) => {
      const setting: typeof SypConfig = publishCfg.setting
      const cfg: BlogConfig = publishCfg.cfg
      const dynCfg: DynamicConfig = publishCfg.dynCfg

      // 检测是否发布
      const posidKey = cfg.posidKey
      if (StrUtil.isEmptyString(posidKey)) {
        throw new Error("配置错误，posidKey不能为空，请检查配置")
      }

      const postMeta = ObjectUtil.getProperty(setting, id, {})
      const postid = ObjectUtil.getProperty(postMeta, posidKey)

      // 初始化API
      const api = await getPublishApi(key, cfg)

      // vars
      let postPreviewUrl: string = ""
      let mergedPost = {} as Post

      // 思源笔记原始文章数据
      const siyuanPost = await blogApi.getPost(id)
      if (method === MethodEnum.METHOD_ADD) {
        // 更新属性
        mergedPost = _.cloneDeep(siyuanPost) as Post
        mergedPost.mt_keywords = mergedPost?.mt_keywords ?? ""
        mergedPost.categories = mergedPost?.categories ?? []
      } else {
        if (StrUtil.isEmptyString(postid)) {
          throw new Error("未找到postid，将无法进行更新")
        }

        // 查询平台文章；不同平台 YAML 适配器写摘要/标签的字段不一致，先统一再与思源合并
        const platformPost = normalizePlatformPostMetadata(await api.getPost(postid))
        mergedPost = _.cloneDeep(platformPost) as Post
        // 标题以思源笔记为准（思源是权威源）。web 平台适配器的 getPost 通常不返回标题，
        // 若直接使用 platformPost.title 会得到空字符串，导致编辑表单标题丢失。
        if (StrUtil.isEmptyString(mergedPost.title)) {
          mergedPost.title = siyuanPost.title
        }
        // 摘要（shortDesc/mt_excerpt）：平台未返回时回退到思源笔记（思源仍是权威源）。
        // web 平台 getPost 可能不返回或返回为空，直接保留会清空编辑表单的摘要。
        if (StrUtil.isEmptyString(mergedPost.shortDesc)) {
          mergedPost.shortDesc = siyuanPost.shortDesc
        }
        if (StrUtil.isEmptyString(mergedPost.mt_excerpt)) {
          mergedPost.mt_excerpt = siyuanPost.mt_excerpt
        }
        // 标签/分类：平台未返回时回退到思源笔记（思源仍是权威源）。
        // web 平台 getPost 可能不返回或返回为空，直接覆盖会清空编辑表单的标签/分类。
        if (StrUtil.isEmptyString(mergedPost.mt_keywords)) {
          mergedPost.mt_keywords = siyuanPost.mt_keywords
        }
        if (!mergedPost.categories?.length) {
          mergedPost.categories = siyuanPost.categories ?? []
        }
        if (StrUtil.isEmptyString(mergedPost.tags_slugs)) {
          mergedPost.tags_slugs = siyuanPost.tags_slugs
        }
        if (!mergedPost.cate_slugs?.length) {
          mergedPost.cate_slugs = siyuanPost.cate_slugs ?? []
        }
        // 知识空间（专栏）为配置存值、编辑时只读：平台未返回时回退到配置的默认专栏
        if (!mergedPost.cate_slugs?.length && cfg.knowledgeSpaceEnabled) {
          mergedPost.cate_slugs = StrUtil.isEmptyString(cfg.blogid) ? [] : [cfg.blogid]
        }
        // 链接需要使用思源笔记的
        mergedPost.originalId = siyuanPost.originalId
        mergedPost.link = siyuanPost.link
        // 正文需要使用思源笔记的
        mergedPost.markdown = siyuanPost.markdown
        mergedPost.html = siyuanPost.html
        mergedPost.description = siyuanPost.description
        // 更新时间以思源笔记文档为准（issue #2054）：平台侧的 updated 是上次发布时的值，
        // 沿用下去会让「更新时间」永远不前进。这里先取文档时间，后续 YAML 解析更晚时才覆盖。
        mergedPost.dateUpdated = siyuanPost.dateUpdated

        // 更新预览链接
        postPreviewUrl = await getPostPreviewUrl(api, id, cfg)
      }

      // 记录思源文档侧元数据快照，并在 assignInitAttrs 解析平台 YAML 之后按覆盖策略回填。
      // 新增文章不继承历史覆盖；更新时读取该平台保存的覆盖字段集合。
      const metadataPost = mergedPost as PublishMetadataPost
      metadataPost.siyuanMetadata = extractSiyuanMetadata(siyuanPost)
      metadataPost.metadataOverrides =
        method === MethodEnum.METHOD_ADD
          ? []
          : [...parseMetadataOverrides(ObjectUtil.getProperty(postMeta, getDynMetadataOverridesKey(key), ""))]

      return {
        mergedPost,
        postPreviewUrl,
      }
    },

    doOverideBatchPost: (post: Post, newPost: Post): Post => {
      // 复制原始 newPost 对象以避免直接修改它
      const mergedPost = _.cloneDeep(newPost) as Post

      mergedPost.title = post.title
      mergedPost.originalId = post.originalId
      mergedPost.link = post.link
      mergedPost.shortDesc = post.shortDesc
      mergedPost.mt_excerpt = post.mt_excerpt
      mergedPost.mt_keywords = post.mt_keywords
      mergedPost.categories = post.categories

      return mergedPost
    },

    doMergeBatchPost: (post: Post, newPost: Post): Post => {
      // 复制原始 newPost 对象以避免直接修改它
      const mergedPost = _.cloneDeep(newPost) as Post

      // 这两个属性需要保持
      mergedPost.originalId = post.originalId
      mergedPost.link = post.link

      // 摘要
      if (StrUtil.isEmptyString(mergedPost.shortDesc)) {
        mergedPost.shortDesc = mergedPost.mt_excerpt
      }
      if (StrUtil.isEmptyString(mergedPost.mt_excerpt)) {
        mergedPost.mt_excerpt = mergedPost.shortDesc
      }

      const postKeywords = post?.mt_keywords?.split(",") ?? []
      const newPostKeywords = newPost?.mt_keywords?.split(",") ?? []
      // 合并并去重关键词
      const mergedKeywords = [
        ...new Set([...postKeywords.map((tag) => tag.trim()), ...newPostKeywords.map((tag) => tag.trim())]),
      ].filter((tag) => tag.trim() !== "")
      mergedPost.mt_keywords = mergedKeywords.join(",")

      // 合并并去重分类
      const mergedCategories = [
        ...new Set([
          ...(post?.categories ?? []).map((cate) => cate.trim()),
          ...(newPost?.categories ?? []).map((cate) => cate.trim()),
        ]),
      ].filter((cate) => cate.trim() !== "")
      mergedPost.categories = mergedCategories

      return mergedPost
    },
  }

  return {
    singleFormData,
    doSinglePublish,
    doSingleDelete,
    doForceSingleDelete,
    initPublishMethods,
    getPostPreviewUrl,
  }
}

export { usePublish }
