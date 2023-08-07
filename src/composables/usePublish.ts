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
import { AliasTranslator, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { AppInstance } from "~/src/appInstance.ts"
import Adaptors from "~/src/adaptors"
import { Utils } from "~/src/utils/utils.ts"
import { BlogAdaptor, BlogConfig, PageTypeEnum, Post } from "zhi-blog-api"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { pre } from "~/src/utils/import/pre.ts"
import { MethodEnum } from "~/src/models/methodEnum.ts"
import { DynamicConfig, DynamicJsonCfg, getDynCfgByKey } from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { CommonblogConfig } from "~/src/adaptors/api/base/CommonblogConfig.ts"

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

  // datas
  const singleFormData = reactive({
    isPublishLoading: false,
    publishProcessStatus: false,
    isAdd: true,
    errMsg: "",
  })

  const doSinglePublish = async (
    key: string,
    id: string,
    doc: Post,
    setting: typeof SypConfig,
    cfg: CommonblogConfig,
    dynCfg: DynamicConfig
  ) => {
    try {
      // 系统内置
      const isSys = pre.systemCfg.some((item) => item.platformKey === key)
      logger.info("isSys=>", isSys)

      if (isSys) {
        // 内置平台直接用思源的ID
        singleFormData.postid = id
      } else {
        // 检测是否发布
        const posidKey = singleFormData.cfg.posidKey
        if (StrUtil.isEmptyString(posidKey)) {
          throw new Error("配置错误，posidKey不能为空，请检查配置")
        }

        const postMeta = ObjectUtil.getProperty(singleFormData.setting, id, {})
        singleFormData.postid = ObjectUtil.getProperty(postMeta, posidKey)
      }

      singleFormData.isAdd = StrUtil.isEmptyString(singleFormData.postid)
      if (singleFormData.isAdd) {
        logger.info("文章未发布，准备发布")
        logger.debug("before preHandlePost newPost, doc=>", toRaw(doc))
        const post = preHandlePost(doc, singleFormData.cfg)
        logger.debug("after preHandlePost newPost, doc=>", toRaw(post))
        // result 正常情况下就是 postid
        const result = await api.newPost(post)

        // 写入属性到配置
        singleFormData.postid = result
        const posidKey = singleFormData.cfg.posidKey
        const postMeta = ObjectUtil.getProperty(singleFormData.setting, id, {})
        postMeta[posidKey] = singleFormData.postid
        postMeta["custom-slug"] = doc.wp_slug
        singleFormData.setting[id] = postMeta
        await updateSetting(singleFormData.setting)

        logger.info("new post=>", result)
      } else {
        logger.info("文章已发布，准备更新")
        logger.debug("before preHandlePost editPost, doc=>", toRaw(doc))
        const post = preHandlePost(doc, singleFormData.cfg)
        logger.debug("after preHandlePost editPost, doc=>", toRaw(post))
        // result 正常情况下是 true
        const result = await api.editPost(singleFormData.postid, post)

        // 写入属性到配置
        const postMeta = ObjectUtil.getProperty(singleFormData.setting, id, {})
        postMeta["custom-slug"] = doc.wp_slug
        singleFormData.setting[id] = postMeta
        await updateSetting(singleFormData.setting)

        logger.info("edit post=>", result)
      }

      // 保存
      // 更新预览链接
      await setPreviewUrl(api, singleFormData.postid)
      logger.info(" save attrs finish")
      singleFormData.publishProcessStatus = true
    } catch (e) {
      singleFormData.errMsg = t("main.opt.failure") + "=>" + e
      logger.error(e)
      // ElMessage.error(singleFormData.errMsg)
      await kernelApi.pushErrMsg({
        msg: singleFormData.errMsg,
        timeout: 7000,
      })
      singleFormData.publishProcessStatus = false
    }

    return {
      key: key,
      status: singleFormData.publishProcessStatus,
      name: singleFormData.cfg?.blogName,
      previewUrl: singleFormData.previewUrl,
      errMsg: singleFormData.errMsg,
    }
  }

  const doSingleDelete = async (
    key: string,
    id: string,
    setting: typeof SypConfig,
    cfg: CommonblogConfig,
    dynCfg: DynamicConfig
  ) => {
    try {
      // 加载配置
      singleFormData.setting = await getSetting()
      singleFormData.cfg = JsonUtil.safeParse<any>(singleFormData.setting[key], {} as any)

      // 检测是否发布
      const posidKey = singleFormData.cfg.posidKey
      if (StrUtil.isEmptyString(posidKey)) {
        throw new Error("配置错误，posidKey不能为空，请检查配置")
      }

      const postMeta = ObjectUtil.getProperty(singleFormData.setting, id, {})
      const postid = ObjectUtil.getProperty(postMeta, posidKey)
      if (StrUtil.isEmptyString(postid)) {
        throw new Error("未找到postid，无法删除，请手动在平台删除")
      }

      // 初始化API
      const appInstance = new AppInstance()
      const apiAdaptor = await Adaptors.getAdaptor(key)
      const api = Utils.blogApi(appInstance, apiAdaptor)
      logger.info("api=>", api)

      singleFormData.publishProcessStatus = await api.deletePost(postid)

      // 删除成功才去移除文章发布信息
      if (singleFormData.publishProcessStatus) {
        const postMeta = ObjectUtil.getProperty(singleFormData.setting, id, {})
        const updatedPostMeta = { ...postMeta }
        if (updatedPostMeta.hasOwnProperty(posidKey)) {
          delete updatedPostMeta[posidKey]
        }

        singleFormData.setting[id] = updatedPostMeta
        await updateSetting(singleFormData.setting)
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

  const doForceSingleDelete = async (
    key: string,
    id: string,
    setting: typeof SypConfig,
    cfg: CommonblogConfig,
    dynCfg: DynamicConfig
  ) => {
    try {
      // 加载配置
      singleFormData.setting = await getSetting()
      singleFormData.cfg = JsonUtil.safeParse<any>(singleFormData.setting[key], {} as any)

      // 检测是否发布
      const posidKey = singleFormData.cfg.posidKey
      if (StrUtil.isEmptyString(posidKey)) {
        throw new Error("配置错误，posidKey不能为空，请检查配置")
      }
      if (!StrUtil.isEmptyString(posidKey)) {
        const postMeta = ObjectUtil.getProperty(singleFormData.setting, id, {})
        const updatedPostMeta = { ...postMeta }
        if (updatedPostMeta.hasOwnProperty(posidKey)) {
          delete updatedPostMeta[posidKey]
        }
        if (updatedPostMeta.hasOwnProperty("custom-slug")) {
          delete updatedPostMeta["custom-slug"]
        }

        singleFormData.setting[id] = updatedPostMeta
        await updateSetting(singleFormData.setting)

        await kernelApi.pushMsg({
          msg: t("main.opt.ok"),
          timeout: 2000,
        })
        logger.info(`[${key}] [${id}] 文章发布信息已强制移除`)
      }
    } catch (e) {
      logger.error(e)
      // ElMessage.error(singleFormData.errMsg)
      await kernelApi.pushErrMsg({
        msg: t("main.opt.failure") + "=>" + e,
        timeout: 7000,
      })
    }
  }

  const setPreviewUrl = async (api: BlogAdaptor, postid: string) => {
    const previewUrl = await api.getPreviewUrl(postid)
    const isAbsoluteUrl = /^http/.test(previewUrl)
    singleFormData.previewUrl = isAbsoluteUrl ? previewUrl : `${singleFormData.cfg?.home ?? ""}${previewUrl}`
  }

  const getPublishCfg = () => {
    return {
      setting: typeof SypConfig,
      cfg: CommonblogConfig,
      dynCfg: DynamicConfig
    }
  }

  const preHandlePost = (doc: Post, cfg: BlogConfig): Post => {
    const post = doc
    // 发布格式
    if (cfg?.pageType == PageTypeEnum.Markdown) {
      post.description = post.markdown
    }
    return post
  }

  const assignCompareValue = (title1: string, title2: string) => (title1.length > title2.length ? title1 : title2)

  /**
   * 分配属性
   *
   * @param post - 文章对象
   */
  const assignAttrs = async (post: Post) => {
    // assignSlug
    // const slug = ObjectUtil.getProperty(singleFormData.cfg, "custom-slug", singleFormData.siyuanPost.wp_slug)

    if (StrUtil.isEmptyString(post.wp_slug)) {
      // 如果wp_slug为空，则生成一个新的slug
      const slug = await AliasTranslator.getPageSlug(post.title, true)
      post.wp_slug = `${slug}`
      logger.info("Generated new slug")
    } else {
      // 使用已存在的siyuan note slug
      logger.info("Using existing siyuan note slug")
    }

    // assignShortDesc

    return post
  }

  const doInitPage = async (key: string, id: string, method: MethodEnum = MethodEnum.METHOD_ADD) => {
    // 思源笔记原始文章数据
    singleFormData.siyuanPost = await blogApi.getPost(id)
    logger.debug("doInitPage start init siyuanPost =>", toRaw(singleFormData.siyuanPost))

    // 加载配置
    singleFormData.setting = await getSetting()
    // 平台特定配置
    singleFormData.cfg = JsonUtil.safeParse<any>(singleFormData.setting[key], {} as any)

    // 平台定义配置
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(
      singleFormData.setting[DYNAMIC_CONFIG_KEY],
      {} as DynamicJsonCfg
    )
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []
    singleFormData.dynCfg = getDynCfgByKey(dynamicConfigArray, key)

    // 检测是否发布
    const posidKey = singleFormData.cfg.posidKey
    if (StrUtil.isEmptyString(posidKey)) {
      throw new Error("配置错误，posidKey不能为空，请检查配置")
    }

    const postMeta = ObjectUtil.getProperty(singleFormData.setting, id, {})
    const postid = ObjectUtil.getProperty(postMeta, posidKey)

    // 初始化API
    const appInstance = new AppInstance()
    const apiAdaptor = await Adaptors.getAdaptor(key)
    const api = Utils.blogApi(appInstance, apiAdaptor)
    logger.info("api=>", api)

    if (method === MethodEnum.METHOD_ADD) {
      logger.info("Add, using siyuan post")
      singleFormData.mergedPost = new Post()
      singleFormData.mergedPost.title = singleFormData.siyuanPost.title
      singleFormData.mergedPost.description = singleFormData.siyuanPost.description
      singleFormData.mergedPost.markdown = singleFormData.siyuanPost.markdown
      singleFormData.mergedPost.wp_slug = singleFormData.siyuanPost.wp_slug
      singleFormData.mergedPost.shortDesc = singleFormData.siyuanPost.shortDesc
    } else {
      logger.info("Reading post from remote platform")
      if (StrUtil.isEmptyString(postid)) {
        throw new Error("未找到postid，将无法进行更新")
      }

      singleFormData.platformPost = await api.getPost(postid)

      singleFormData.mergedPost = new Post()
      singleFormData.mergedPost.title = assignCompareValue(
        singleFormData.siyuanPost.title,
        singleFormData.platformPost.title
      )
      // 正文以思源笔记为准
      singleFormData.mergedPost.description = singleFormData.siyuanPost.description
      singleFormData.mergedPost.markdown = singleFormData.siyuanPost.markdown
      // 别名，先读取配置保存的。没有去读取最新生成的，最后再去用远程的
      const slug = ObjectUtil.getProperty(singleFormData.cfg, "custom-slug", singleFormData.siyuanPost.wp_slug)
      singleFormData.mergedPost.wp_slug = StrUtil.isEmptyString(slug) ? singleFormData.platformPost.wp_slug : slug
      // 摘要以思源笔记为准
      singleFormData.mergedPost.shortDesc = singleFormData.siyuanPost.shortDesc

      // 更新预览链接
      await setPreviewUrl(api, postid)
    }

    // 初始化属性
    singleFormData.mergedPost = await assignAttrs(singleFormData.mergedPost)
    return singleFormData
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
