/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ImageItem, ImageParser, ParsedImage, SiyuanPicGo } from "zhi-siyuan-picgo"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { StrUtil } from "zhi-common"
import { isDev } from "~/src/utils/constants.ts"
import { BlogConfig, PicbedServiceTypeEnum } from "zhi-blog-api"
import {
  formatPublisherPicgoError,
  getPublisherPicgoManager,
} from "~/src/composables/usePublisherPicgoManager.ts"
import { countLocalMarkdownImages } from "~/src/utils/imageUploadPolicy.ts"

type SiyuanConfigBridge = {
  apiUrl?: string
  password?: string
  cookie?: string
  [key: string]: unknown
}

/**
 * Picgo 桥接 API，用于上传并替换图片链接
 *
 * @author terwer
 * @since 1.6.1
 */
const usePicgoBridge = () => {
  const logger = createAppLogger("use-picgo-bridge")
  const { siyuanConfig, kernelApi, blogApi } = useSiyuanApi()

  /**
   * 处理图片上传与替换
   *
   * @param pageId - 页面ID
   * @param mdContent - 正文，如果为空，会用 pageId 去获取最新
   */
  const handlePicgo = async (pageId: string, mdContent?: string) => {
    let md: string = mdContent
    const picgoErrMsg = "文档可能已经成功发布，但是 PicGo 图床内核上传失败，详细信息=>"

    try {
      if (StrUtil.isEmptyString(md)) {
        // 思源笔记原始文章数据
        const siyuanPost = await blogApi.getPost(pageId)
        md = siyuanPost.markdown
      }

      // 以发布正文判断是否有本地图片：数据库块、嵌入块中的图片不属于思源的图片块，
      // 不能再用 getImageBlocksByID 判断，否则会误判为无图片而跳过上传（issue #1999）。
      // 无本地图片时无需初始化图床内核，也无需校验 uploader 配置（issue #2050）。
      const localImageCount = countLocalMarkdownImages(md)
      if (localImageCount === 0) {
        return md
      }

      const attrs = await kernelApi.getBlockAttrs(pageId)
      const picgoManager = await getPublisherPicgoManager()
      // 图片发现、上传与链接替换统一由 zhi-siyuan-picgo 处理（3.2.1+ 已支持数据库图片）
      const picgoPostResult = await picgoManager.uploadMarkdownImages(pageId, attrs, md)
      if (picgoPostResult.hasImages) {
        if (picgoPostResult.flag) {
          md = picgoPostResult.mdContent
        } else {
          throw new Error(picgoPostResult.errmsg || "PicGo headless upload failed")
        }
      }
    } catch (e) {
      const formatted = formatPublisherPicgoError(e)
      const error = new Error(`${picgoErrMsg}${formatted.summary}`)
      ;(error as any).diagnosticMessage = formatted.details
      ;(error as any).errors = formatted.fieldErrors
      logger.error(picgoErrMsg, formatted.details)
      throw error
    }

    return md
  }

  /**
   * 从 Markdown 中提取图片项
   *
   * @param pageId - 思源笔记的文档ID
   * @param md - Markdown字符串
   * @returns 解析后的图片数组
   */
  const getImageItemsFromMd = async (pageId: string, md: string): Promise<ImageItem[]> => {
    const imageParser = new ImageParser()
    let retImgs: ParsedImage[] = []
    const parsedImages = imageParser.parseImagesToArray(md)
    retImgs = [...new Set([...retImgs, ...parsedImages])]

    const attrs = await kernelApi.getBlockAttrs(pageId)
    const baseUrl = siyuanConfig.apiUrl ?? ""
    // 通用方法获取，保证单例
    const picgoPostApi = await SiyuanPicGo.getInstance(siyuanConfig as unknown as SiyuanConfigBridge, isDev)
    const imageItemArray = await picgoPostApi.doConvertImagesToImagesItemArray(attrs, retImgs, baseUrl)
    return imageItemArray
  }

  /**
   * 获取当前图床服务
   *
   * @param cfg
   */
  const getPicbedServiceType = async (cfg: BlogConfig): Promise<PicbedServiceTypeEnum> => {
    let s: PicbedServiceTypeEnum = PicbedServiceTypeEnum.None
    // 如果没有选择，使用默认的
    if (StrUtil.isEmptyString(cfg.picbedService)) {
      if (cfg.picgoPicbedSupported) {
        s = PicbedServiceTypeEnum.PicGo
      } else if (cfg.bundledPicbedSupported) {
        // 如果支持自有的，使用自有的
        s = PicbedServiceTypeEnum.Bundled
      } else {
        // 其他情况，不使用图床
        s = PicbedServiceTypeEnum.None
      }
    } else {
      s = cfg.picbedService
    }

    return s
  }

  /**
   * 检查 Publisher 可用的 PicGo headless lib/runtime 是否就绪。
   * 注意：这里不再检查 `siyuan-plugin-picgo` 插件产品是否安装。
   */
  const checkPicgoInstalled = async (): Promise<boolean> => {
    try {
      await getPublisherPicgoManager()
      return true
    } catch (e) {
      logger.error("PicGo headless runtime is unavailable", formatPublisherPicgoError(e).details)
      return false
    }
  }

  return {
    handlePicgo,
    getImageItemsFromMd,
    getPicbedServiceType,
    checkPicgoInstalled,
  }
}

export { usePicgoBridge }
