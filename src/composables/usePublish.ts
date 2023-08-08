/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { createAppLogger } from "~/src/utils/appLogger.ts"
import { reactive, toRaw } from "vue"
import { SypConfig } from "~/syp.config.ts"
import { AliasTranslator, DateUtil, ObjectUtil, StrUtil } from "zhi-common"
import { BlogAdaptor, BlogConfig, PageTypeEnum, Post, PostStatusEnum } from "zhi-blog-api"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { pre } from "~/src/utils/import/pre.ts"
import { MethodEnum } from "~/src/models/methodEnum.ts"
import { DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { CommonblogConfig } from "~/src/adaptors/api/base/CommonblogConfig.ts"
import { IPublishCfg } from "~/src/types/IPublishCfg.ts"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { YamlConvertAdaptor } from "~/src/platforms/yamlConvertAdaptor.ts"
import { YamlFormatObj } from "~/src/models/yamlFormatObj.ts"
import { ElMessage } from "element-plus"

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
  const { t } = useVueI18n()
  const { getSetting, updateSetting } = useSettingStore()
  const { kernelApi, blogApi } = useSiyuanApi()
  const { getPublishApi, getYamlApi } = usePublishConfig()

  // datas
  const singleFormData = reactive({
    isPublishLoading: false,
    publishProcessStatus: false,
    isAdd: true,
    errMsg: "",
  })

  const doSinglePublish = async (key: string, id: string, publishCfg: IPublishCfg, doc: Post) => {
    const setting: typeof SypConfig = publishCfg.setting
    const cfg: CommonblogConfig = publishCfg.cfg
    const dynCfg: DynamicConfig = publishCfg.dynCfg

    // vars
    let postid: string
    let postPreviewUrl: string
    try {
      // 系统内置
      const isSys = pre.systemCfg.some((item) => item.platformKey === key)
      logger.info("isSys=>", isSys)

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
      // 保证postid一致
      doc.postid = postid

      // 分配属性
      doc = await assignAttrs(doc, id, publishCfg)

      // 全局的预处理
      logger.debug(`before preHandlePost, isAdd ${singleFormData.isAdd}, doc=>`, toRaw(doc))
      const post = preHandlePost(doc, cfg)
      logger.debug(`after preHandlePost, doc=>`, toRaw(post))

      // 平台相关的预处理
      const yamlApi: YamlConvertAdaptor = await getYamlApi(key, cfg)
      if (yamlApi instanceof YamlConvertAdaptor) {
        const yamlObj: YamlFormatObj = yamlApi.convertToYaml(post, cfg)
        post.description = yamlObj.mdFullContent
        logger.info("handled yaml using YamlConvertAdaptor")
      } else {
        logger.info("yaml adaptor not found, ignore convert")
      }

      // 初始化API
      const api = await getPublishApi(key, cfg)

      // 处理发布：新增 或者 更新
      if (singleFormData.isAdd) {
        logger.info("文章未发布，准备发布")

        // result 正常情况下就是 postid
        const result = await api.newPost(post)

        // 写入属性到配置
        postid = result
        const posidKey = cfg.posidKey
        const postMeta = ObjectUtil.getProperty(setting, id, {})
        postMeta[posidKey] = postid
        postMeta["custom-slug"] = doc.wp_slug
        setting[id] = postMeta
        await updateSetting(setting)

        logger.info("new post=>", result)
      } else {
        logger.info("文章已发布，准备更新")

        // result 正常情况下是 true
        const result = await api.editPost(postid, post)

        // 写入属性到配置
        const postMeta = ObjectUtil.getProperty(setting, id, {})
        postMeta["custom-slug"] = doc.wp_slug
        setting[id] = postMeta
        await updateSetting(setting)

        logger.info("edit post=>", result)
      }

      // 更新预览链接
      postPreviewUrl = await getPostPreviewUrl(api, postid, cfg)

      singleFormData.publishProcessStatus = true
    } catch (e) {
      singleFormData.errMsg = t("main.opt.failure") + "=>" + e
      logger.error(e)
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
      errMsg: singleFormData.errMsg,
    }
  }

  const doSingleDelete = async (key: string, id: string, publishCfg: IPublishCfg) => {
    const setting: typeof SypConfig = publishCfg.setting
    const cfg: CommonblogConfig = publishCfg.cfg
    const dynCfg: DynamicConfig = publishCfg.dynCfg

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
      singleFormData.publishProcessStatus = await api.deletePost(postid)

      // 删除成功才去移除文章发布信息
      if (singleFormData.publishProcessStatus) {
        const postMeta = ObjectUtil.getProperty(setting, id, {})
        const updatedPostMeta = { ...postMeta }
        if (updatedPostMeta.hasOwnProperty(posidKey)) {
          delete updatedPostMeta[posidKey]
        }
        if (updatedPostMeta.hasOwnProperty("custom-slug")) {
          delete updatedPostMeta["custom-slug"]
        }

        setting[id] = updatedPostMeta
        await updateSetting(setting)
        logger.info(`[${key}] [${id}] 文章发布信息已移除`)
      }
    } catch (e) {
      singleFormData.errMsg = t("main.opt.failure") + "=>" + e
      logger.error(e)
      // ElMessage.error(singleFormData.errMsg)
      await kernelApi.pushErrMsg({
        msg: singleFormData.errMsg,
        timeout: 7000,
      })
    }

    return {
      key: key,
      status: singleFormData.publishProcessStatus,
      errMsg: singleFormData.errMsg,
    }
  }

  const doForceSingleDelete = async (key: string, id: string, publishCfg: IPublishCfg) => {
    try {
      const setting: typeof SypConfig = publishCfg.setting
      const cfg: CommonblogConfig = publishCfg.cfg
      const dynCfg: DynamicConfig = publishCfg.dynCfg

      // 检测是否发布
      const posidKey = cfg.posidKey
      if (StrUtil.isEmptyString(posidKey)) {
        throw new Error("配置错误，posidKey不能为空，请检查配置")
      }
      if (!StrUtil.isEmptyString(posidKey)) {
        const postMeta = ObjectUtil.getProperty(setting, id, {})
        const updatedPostMeta = { ...postMeta }
        if (updatedPostMeta.hasOwnProperty(posidKey)) {
          delete updatedPostMeta[posidKey]
        }
        // 别名不能删除，因为别的平台可能还用
        // if (updatedPostMeta.hasOwnProperty("custom-slug")) {
        //   delete updatedPostMeta["custom-slug"]
        // }

        setting[id] = updatedPostMeta
        await updateSetting(setting)

        await kernelApi.pushMsg({
          msg: t("main.opt.ok"),
          timeout: 2000,
        })
        logger.info(`[${key}] [${id}] 文章发布信息已强制移除`)
        ElMessage.success(`[${key}] [${id}] 文章发布信息已强制移除`)
      }
    } catch (e) {
      ElMessage.error(t("main.opt.failure") + "=>" + e)
      logger.error(e)
      await kernelApi.pushErrMsg({
        msg: t("main.opt.failure") + "=>" + e,
        timeout: 7000,
      })
    }
  }

  const getPostPreviewUrl = async (api: BlogAdaptor, postid: string, cfg: CommonblogConfig) => {
    const previewUrl = await api.getPreviewUrl(postid)
    const isAbsoluteUrl = /^http/.test(previewUrl)
    return isAbsoluteUrl ? previewUrl : `${cfg?.home ?? ""}${previewUrl}`
  }

  const preHandlePost = (doc: Post, cfg: BlogConfig): Post => {
    const post = doc
    // 发布格式
    if (cfg?.pageType == PageTypeEnum.Markdown) {
      post.description = post.markdown
    } else {
      post.description = post.html
    }
    return post
  }

  // const assignCompareValue = (title1: string, title2: string) => (title1.length > title2.length ? title1 : title2)

  /**
   * 分配属性
   *
   * @param post - 文章对象
   * @param id - 思源笔记文档ID
   * @param publishCfg - 发布配置
   */
  const assignAttrs = async (post: Post, id: string, publishCfg: IPublishCfg) => {
    const setting: typeof SypConfig = publishCfg.setting
    const cfg: CommonblogConfig = publishCfg.cfg
    const dynCfg: DynamicConfig = publishCfg.dynCfg
    const postMeta = ObjectUtil.getProperty(setting, id, {})

    // 别名
    const slug = ObjectUtil.getProperty(postMeta, "custom-slug", post.wp_slug)
    if (!StrUtil.isEmptyString(slug)) {
      post.wp_slug = slug
      logger.info("Using existing siyuan note slug")
    } else {
      // 如果wp_slug为空，则生成一个新的slug
      const slug = await AliasTranslator.getPageSlug(post.title, true)
      post.wp_slug = `${slug}`
      logger.info("Generated new slug")
    }

    // 发布状态
    post.post_status = PostStatusEnum.PostStatusEnum_Publish

    return post
  }

  const doInitPage = async (
    key: string,
    id: string,
    method: MethodEnum = MethodEnum.METHOD_ADD,
    publishCfg: IPublishCfg
  ) => {
    const setting: typeof SypConfig = publishCfg.setting
    const cfg: CommonblogConfig = publishCfg.cfg
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

    // 思源笔记原始文章数据
    const siyuanPost = await blogApi.getPost(id)
    let platformPost = new Post()
    let mergedPost = new Post()
    logger.debug("doInitPage start init siyuanPost =>", toRaw(siyuanPost))

    if (method === MethodEnum.METHOD_ADD) {
      logger.info("Add, using siyuan post")
      mergedPost = siyuanPost
    } else {
      logger.info("Reading post from remote platform")
      if (StrUtil.isEmptyString(postid)) {
        throw new Error("未找到postid，将无法进行更新")
      }

      // 查询平台文章
      platformPost = await api.getPost(postid)

      // 暂时不合并
      mergedPost = siyuanPost

      // 更新预览链接
      postPreviewUrl = await getPostPreviewUrl(api, postid, cfg)
    }

    // 初始化属性
    mergedPost = await assignAttrs(mergedPost, id, publishCfg)

    logger.debug("doInitPage finished platformPost =>", toRaw(platformPost))
    logger.debug("doInitPage finished mergedPost =>", toRaw(mergedPost))

    return {
      siyuanPost,
      platformPost,
      mergedPost,
      postPreviewUrl,
    }
  }

  return {
    singleFormData,
    doSinglePublish,
    doSingleDelete,
    doForceSingleDelete,
    doInitPage,
    assignAttrs,
  }
}

export { usePublish }
