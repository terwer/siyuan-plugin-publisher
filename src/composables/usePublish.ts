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
import { AliasTranslator, ObjectUtil, StrUtil, YamlUtil } from "zhi-common"
import {
  BlogAdaptor,
  BlogConfig,
  PageTypeEnum,
  Post,
  PostStatusEnum,
  YamlConvertAdaptor,
  YamlFormatObj,
} from "zhi-blog-api"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { pre } from "~/src/utils/import/pre.ts"
import { MethodEnum } from "~/src/models/methodEnum.ts"
import { DynamicConfig, getDynYamlKey } from "~/src/platforms/dynamicConfig.ts"
import { IPublishCfg } from "~/src/types/IPublishCfg.ts"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { ElMessage } from "element-plus"
import { SiyuanAttr } from "zhi-siyuan-api"
import _ from "lodash"
import Adaptors from "~/src/adaptors"

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
  const { updateSetting } = useSettingStore()
  const { kernelApi, blogApi } = useSiyuanApi()
  const { getPublishApi } = usePublishConfig()

  // datas
  const singleFormData = reactive({
    isPublishLoading: false,
    publishProcessStatus: false,
    isAdd: true,
    errMsg: "",
  })

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
    try {
      // 系统内置
      const isSys = pre.systemCfg.some((item) => item.platformKey === key)
      logger.info(`isSys=>${isSys}`)

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

      let post = doc
      // 保证postid一致
      post.postid = postid

      // 初始化API
      const api = await getPublishApi(key, cfg)

      // ===================================
      // 文章处理开始
      // ===================================
      // 平台相关的正文预处理 - 仅在发布的时候调用
      logger.debug(`before preEditPost, isAdd ${singleFormData.isAdd}, post=>`, toRaw(post))
      post = await api.preEditPost(post, id, publishCfg)
      logger.debug(`after preEditPost, post=>`, toRaw(post))

      // 发布格式
      if (cfg?.pageType == PageTypeEnum.Markdown) {
        post.description = post.markdown
      } else {
        post.description = post.html
      }
      logger.debug(`文章全部预处理完毕，最终结果 =>id=${id},key=${key},`, { post: toRaw(post) })
      // ===================================
      // 文章处理结束
      // ===================================

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
        postMeta[SiyuanAttr.Custom_slug] = post.wp_slug
        setting[id] = postMeta
        await updateSetting(setting)

        logger.info("new post=>", result)
        logger.info("文章发布成功")
      } else {
        logger.info("文章已发布，准备更新")

        // result 正常情况下是 true
        const result = await api.editPost(postid, post)

        // 写入属性到配置
        // 这里更新 slug 的原因是历史文章有可能没有生成过别名
        const postMeta = ObjectUtil.getProperty(setting, id, {})
        if (!postMeta.hasOwnProperty(SiyuanAttr.Custom_slug)) {
          logger.info("检测到未生成过别名，准备更新别名")
          postMeta[SiyuanAttr.Custom_slug] = post.wp_slug
          setting[id] = postMeta
          await updateSetting(setting)
        } else {
          // 确保别名不被修改
          post.wp_slug = postMeta[SiyuanAttr.Custom_slug]
        }

        logger.info("edit post=>", result)
        logger.info("文章更新成功")
      }

      logger.info("发布完成，准备处理文章属性")
      // 保存属性用于初始化
      if (isSys) {
        logger.info("内置平台，忽略保存属性")
      } else {
        const yamlKey = getDynYamlKey(key)
        await kernelApi.setSingleBlockAttr(id, yamlKey, post.yaml)
      }
      logger.info("文章属性处理完成")

      // 更新预览链接
      postPreviewUrl = await getPostPreviewUrl(api, postid, cfg)

      singleFormData.publishProcessStatus = true
    } catch (e) {
      singleFormData.errMsg = t("main.opt.failure") + "=>" + e
      // logger.error(t("main.opt.failure") + "=>", e)
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
        if (updatedPostMeta.hasOwnProperty(SiyuanAttr.Custom_slug)) {
          delete updatedPostMeta[SiyuanAttr.Custom_slug]
        }

        setting[id] = updatedPostMeta
        await updateSetting(setting)
        logger.info(`[${key}] [${id}] 文章发布信息已移除`)
      }
    } catch (e) {
      singleFormData.errMsg = t("main.opt.failure") + "=>" + e
      // logger.error(t("main.opt.failure") + "=>", e)
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

  /**
   * 统一的强制删除操作
   *
   * @param key - 平台 key
   * @param id - 思源笔记的ID
   * @param publishCfg - 发布配置
   */
  const doForceSingleDelete = async (key: string, id: string, publishCfg: IPublishCfg) => {
    try {
      const setting: typeof SypConfig = publishCfg.setting
      const cfg: BlogConfig = publishCfg.cfg
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
      logger.error(t("main.opt.failure") + "=>", e)
      await kernelApi.pushErrMsg({
        msg: t("main.opt.failure") + "=>" + e,
        timeout: 7000,
      })
    }
  }

  const getPostPreviewUrl = async (api: BlogAdaptor, postid: string, cfg: BlogConfig) => {
    const previewUrl = await api.getPreviewUrl(postid)
    const isAbsoluteUrl = /^http/.test(previewUrl)
    return isAbsoluteUrl ? previewUrl : `${cfg?.home ?? ""}${previewUrl}`
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
    assignInitSlug: async (post: Post, id: string, publishCfg: IPublishCfg) => {
      const setting: typeof SypConfig = publishCfg.setting
      const postMeta = ObjectUtil.getProperty(setting, id, {})

      // 别名
      const slug = ObjectUtil.getProperty(postMeta, SiyuanAttr.Custom_slug, post.wp_slug)
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
    },

    // 分配平台相关的YAML属性
    assignInitAttrs: async (post: Post, id: string, publishCfg: IPublishCfg) => {
      const setting: typeof SypConfig = publishCfg.setting
      const cfg: BlogConfig = publishCfg.cfg
      const dynCfg: DynamicConfig = publishCfg.dynCfg
      const key = dynCfg.platformKey
      const isSys = pre.systemCfg.some((item) => item.platformKey === key)

      // 别名
      post = await initPublishMethods.assignInitSlug(post, id, publishCfg)
      const slug = post.wp_slug

      if (!isSys) {
        // 平台相关自定义属性（摘要、标签、分类）
        const yamlKey = getDynYamlKey(key)
        const yaml = await kernelApi.getSingleBlockAttr(id, yamlKey)
        const savedYaml = YamlUtil.extractFrontmatter(yaml).trim()

        // YAML属性转换
        const yamlAdaptor: YamlConvertAdaptor = await Adaptors.getYamlAdaptor(key, cfg)
        if (null !== yamlAdaptor) {
          // 有适配器
          let yamlObj: any
          if (!StrUtil.isEmptyString(savedYaml)) {
            yamlObj = YamlUtil.yaml2Obj(savedYaml)
            logger.info("读取已经存在的YAML，不再使用适配器，直接转换yamlObj")
          } else {
            yamlObj = await YamlUtil.yaml2ObjAsync(post.description)
            logger.info("未保存过YAML，使用适配器生成yamlObj")
          }
          const yamlFormatObj = new YamlFormatObj()
          yamlFormatObj.yamlObj = yamlObj
          post = yamlAdaptor.convertToAttr(post, yamlFormatObj, cfg)
          logger.debug("使用适配器转换yamlObj到post完成 =>", yamlObj)
        } else {
          // 无适配器
          if (!StrUtil.isEmptyString(savedYaml)) {
            const yamlObj = YamlUtil.yaml2Obj(savedYaml)
            post.yaml = yaml
            post.fromYaml(yamlObj)
            logger.info("读取已经存在的YAML，无适配器，使用fromYaml生成默认的yamlObj")
          } else {
            // 未保存过，默认不处理
            logger.info("未保存过YAML，未找到适配器，默认不处理")
          }
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

      // 思源笔记原始文章数据
      const siyuanPost = await blogApi.getPost(id)
      let platformPost = {} as Post
      let mergedPost = siyuanPost
      logger.debug("doInitPage start init siyuanPost =>", toRaw(siyuanPost))

      if (method === MethodEnum.METHOD_ADD) {
        logger.info("Add, using siyuan post")
        // 更新属性
        mergedPost.categories = []
      } else {
        logger.info("Reading post from remote platform")
        if (StrUtil.isEmptyString(postid)) {
          throw new Error("未找到postid，将无法进行更新")
        }

        // 查询平台文章
        platformPost = await api.getPost(postid)
        // 更新属性
        mergedPost.shortDesc = platformPost.shortDesc
        mergedPost.mt_keywords = platformPost.mt_keywords
        mergedPost.categories = platformPost.categories
        mergedPost.cate_slugs = platformPost.cate_slugs

        // 更新预览链接
        postPreviewUrl = await getPostPreviewUrl(api, postid, cfg)
      }

      logger.debug("doInitPage finished platformPost =>", toRaw(platformPost))
      logger.debug("doInitPage finished mergedPost =>", toRaw(mergedPost))

      return {
        siyuanPost,
        platformPost,
        mergedPost,
        postPreviewUrl,
      }
    },

    doMergeBatchPost: (post: Post, newPost: Post): Post => {
      // 复制原始 post 对象以避免直接修改它
      const mergedPost = _.cloneDeep(post) as Post

      const postKeywords = post.mt_keywords.split(",")
      const newPostKeywords = newPost.mt_keywords.split(",")
      // 合并并去重关键词
      const mergedKeywords = [...new Set([...postKeywords, ...newPostKeywords])]
      mergedPost.mt_keywords = mergedKeywords.join(",")

      // 合并并去重分类
      const mergedCategories = [...new Set([...post.categories, ...newPost.categories])]
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
  }
}

export { usePublish }
