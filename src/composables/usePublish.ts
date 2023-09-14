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
  Post,
  PostStatusEnum,
  PostUtil,
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

      // 确保每次发布都是新的副本
      const post = _.cloneDeep(doc) as Post
      logger.debug("准备开始发布处理, doc =>", { post: toRaw(doc) })
      // 保证postid一致
      post.postid = postid

      // 初始化API
      const api = await getPublishApi(key, cfg)

      // ===================================
      // 文章预处理开始
      // ===================================
      logger.info(`开始文章预处理, isAdd =>${singleFormData.isAdd}`)
      logger.debug(`post=>`, toRaw(post))
      const finalPost = await api.preEditPost(post, id, publishCfg)
      logger.info(`文章全部预处理完毕，id=${id},key=${key}`)
      logger.debug(`最终结果 =>`, { finalPost: toRaw(finalPost) })
      // ===================================
      // 文章预处理结束
      // ===================================

      // 处理发布：新增 或者 更新
      if (singleFormData.isAdd) {
        logger.info("文章未发布，准备发布")

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

        logger.info("new post=>", result)
        logger.info("文章发布成功")
      } else {
        logger.info("文章已发布，准备更新")

        // result 正常情况下是 true
        const result = await api.editPost(postid, finalPost)

        // 写入属性到配置
        // 这里更新 slug 的原因是历史文章有可能没有生成过别名
        const postMeta = ObjectUtil.getProperty(setting, id, {})
        if (!postMeta.hasOwnProperty(SiyuanAttr.Custom_slug)) {
          logger.info("检测到未生成过别名，准备更新别名")
          postMeta[SiyuanAttr.Custom_slug] = finalPost.wp_slug
          setting[id] = postMeta
          await updateSetting(setting)
        } else {
          // 确保别名不被修改
          finalPost.wp_slug = postMeta[SiyuanAttr.Custom_slug]
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
        await kernelApi.setSingleBlockAttr(id, yamlKey, finalPost.yaml)
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

        // 清空属性
        const yamlKey = getDynYamlKey(key)
        await kernelApi.setSingleBlockAttr(id, yamlKey, "")
        logger.info(`[${key}] [${id}] 属性已移除`)
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
    assignInitSlug: async (doc: Post, id: string, publishCfg: IPublishCfg) => {
      const setting: typeof SypConfig = publishCfg.setting
      const postMeta = ObjectUtil.getProperty(setting, id, {})

      const post = _.cloneDeep(doc) as Post
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

    // 分配平台相关的初始化属性
    assignInitAttrs: async (doc: Post, id: string, publishCfg: IPublishCfg) => {
      const setting: typeof SypConfig = publishCfg.setting
      const cfg: BlogConfig = publishCfg.cfg
      const dynCfg: DynamicConfig = publishCfg.dynCfg
      const key = dynCfg.platformKey
      const isSys = pre.systemCfg.some((item) => item.platformKey === key)

      // 别名
      const slugedPost = await initPublishMethods.assignInitSlug(doc, id, publishCfg)

      // 其他属性初始化
      let post = _.cloneDeep(slugedPost) as Post
      const title = post.title
      if (!isSys) {
        // 平台相关自定义属性（摘要、标签、分类）
        const yamlKey = getDynYamlKey(key)
        const yaml = await kernelApi.getSingleBlockAttr(id, yamlKey)
        const checkYaml = YamlUtil.extractFrontmatter(yaml).trim()

        // YAML属性转换
        const yamlAdaptor: YamlConvertAdaptor = await Adaptors.getYamlAdaptor(key, cfg)
        if (null !== yamlAdaptor) {
          // 有适配器
          let yamlFormatObj: YamlFormatObj
          if (StrUtil.isEmptyString(checkYaml)) {
            yamlFormatObj = yamlAdaptor.convertToYaml(post, cfg)
            logger.info("YAML未保存，使用适配器生成默认的yamlFormatObj", { yamlFormatObj: toRaw(yamlFormatObj) })
            post.yaml = yaml
            post = yamlAdaptor.convertToAttr(post, yamlFormatObj, cfg)
            logger.debug("使用适配器初始化转换yamlObj到post完成 =>", { post: toRaw(post) })
          } else {
            // yamlFormatObj = new YamlFormatObj()
            // const yamlObj = await YamlUtil.yaml2ObjAsync(yaml)
            // yamlFormatObj.yamlObj = yamlFormatObj
            // getPost以已经处理过了
            logger.info("有适配器且YAML已保存，无需处理")
          }
        } else {
          // 无适配器
          if (!StrUtil.isEmptyString(checkYaml)) {
            const yamlObj = await YamlUtil.yaml2ObjAsync(yaml)
            post.yaml = yaml
            PostUtil.fromYaml(post, yamlObj)
            logger.info("读取已经存在的YAML，无适配器，使用fromYaml生成默认的yamlObj")
          } else {
            // 未保存过，默认不处理
            logger.info("未保存过YAML，未找到适配器，默认不处理")
          }
        }
      }

      // 文件名
      if (cfg.useMdFilename && post?.mdFilename.includes(".md")) {
        post.title = post.mdFilename
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
        logger.info("Add, using siyuan post")
        // 更新属性
        mergedPost = _.cloneDeep(siyuanPost) as Post
        mergedPost.mt_keywords = mergedPost?.mt_keywords ?? ""
        mergedPost.categories = mergedPost?.categories ?? []
      } else {
        logger.info("Reading post from remote platform")
        if (StrUtil.isEmptyString(postid)) {
          throw new Error("未找到postid，将无法进行更新")
        }

        // 查询平台文章
        const platformPost = await api.getPost(postid)
        mergedPost = _.cloneDeep(platformPost) as Post
        logger.debug("get init platformPost ok =>", mergedPost)
        mergedPost.title = platformPost.title
        // 正文需要使用思源笔记的
        mergedPost.markdown = siyuanPost.markdown
        mergedPost.html = siyuanPost.html
        mergedPost.description = siyuanPost.description
        // 标签分类需要合并
        mergedPost = initPublishMethods.doMergeBatchPost(siyuanPost, mergedPost)

        // 更新预览链接
        postPreviewUrl = await getPostPreviewUrl(api, postid, cfg)
      }

      logger.debug("doInitPage finished mergedPost =>", toRaw(mergedPost))

      return {
        mergedPost,
        postPreviewUrl,
      }
    },

    doOverideBatchPost: (post: Post, newPost: Post): Post => {
      // 复制原始 newPost 对象以避免直接修改它
      const mergedPost = _.cloneDeep(newPost) as Post

      mergedPost.title = post.title
      mergedPost.shortDesc = post.shortDesc
      mergedPost.mt_keywords = post.mt_keywords
      mergedPost.categories = post.categories

      return mergedPost
    },

    doMergeBatchPost: (post: Post, newPost: Post): Post => {
      // 复制原始 newPost 对象以避免直接修改它
      const mergedPost = _.cloneDeep(newPost) as Post

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
      const mergedKeywords = [...new Set([...postKeywords, ...newPostKeywords])].filter((tag) => tag.trim() !== "")
      mergedPost.mt_keywords = mergedKeywords.join(",")

      // 合并并去重分类
      const mergedCategories = [...new Set([...(post?.categories ?? []), ...(newPost?.categories ?? [])])].filter(
        (cate) => cate.trim() !== ""
      )
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
