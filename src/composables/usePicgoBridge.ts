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
import { ElMessage } from "element-plus"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { StrUtil } from "zhi-common"
import { isDev } from "~/src/utils/constants.ts"
import { BlogConfig, PicbedServiceTypeEnum } from "zhi-blog-api"
import { isFileExists } from "~/src/utils/siyuanUtils.ts"

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
    const picgoErrMsg = "文档可能已经成功发布，但是图片上传失败或者当前场景不支持图片上传，详细信息=>"

    try {
      const attrs = await kernelApi.getBlockAttrs(pageId)
      const siyuanData = {
        pageId: pageId,
        meta: attrs,
      }

      if (StrUtil.isEmptyString(md)) {
        // 思源笔记原始文章数据
        const siyuanPost = await blogApi.getPost(pageId)
        md = siyuanPost.markdown
      }

      // 通用方法获取，保证单例
      const picgoPostApi = await SiyuanPicGo.getInstance(siyuanConfig, isDev)
      const picgoPostResult = await picgoPostApi.uploadPostImagesToBed(siyuanData.pageId, siyuanData.meta, md)
      // 有图片才上传
      if (picgoPostResult.hasImages) {
        // const picgoImageTip = `检测到图片，将使用 PicGo 自动上传图片，若图片较多可能会较慢请耐心等待`
        // await kernelApi.pushMsg({
        //   msg: picgoImageTip,
        //   timeout: 3000,
        // })
        if (picgoPostResult.flag) {
          md = picgoPostResult.mdContent
        } else {
          logger.warn(picgoErrMsg + picgoPostResult.errmsg)
          ElMessage.warning(picgoErrMsg + picgoPostResult.errmsg)
        }
      } else {
        logger.info(picgoErrMsg + picgoPostResult.errmsg)
      }
    } catch (e) {
      logger.error(picgoErrMsg, e)
      ElMessage.error("文档可能已经成功发布，但是图片上传失败或者当前场景不支持图片上传，详细信息=>" + e)
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
    logger.debug("getImageItemsFromMd=>", { md })
    const parsedImages = imageParser.parseImagesToArray(md)
    retImgs = [...new Set([...retImgs, ...parsedImages])]
    logger.debug("retImgs=>", retImgs)

    const attrs = await kernelApi.getBlockAttrs(pageId)
    const baseUrl = siyuanConfig.apiUrl ?? ""
    // 通用方法获取，保证单例
    const picgoPostApi = await SiyuanPicGo.getInstance(siyuanConfig, isDev)
    const imageItemArray = await picgoPostApi.doConvertImagesToImagesItemArray(attrs, retImgs, baseUrl)
    logger.debug("imageItemArray=>", imageItemArray)
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
      // 如果安装了 PicGo 插件，优先使用 PicGo 插件
      const isPicgoInstalled: boolean = await checkPicgoInstalled()
      if (isPicgoInstalled && cfg.picgoPicbedSupported) {
        s = PicbedServiceTypeEnum.PicGo
      } else if (cfg.bundledPicbedSupported) {
        // 如果支持自有的，使用自有的
        s = PicbedServiceTypeEnum.Bundled
      } else {
        // 其他情况，不使用图床
        s = PicbedServiceTypeEnum.None
      }
      logger.info("使用默认的图床服务")
    } else {
      s = cfg.picbedService
      logger.info("使用自定义图床服务")
    }

    return s
  }

  /**
   * 检查 Picgo 是否已安装
   *
   *
   * @returns 一个 Promise，解析为布尔值，表示是否已安装 Picgo
   */
  const checkPicgoInstalled = async () => {
    const { kernelApi } = useSiyuanApi()
    // 检测是否安装 picgo 插件
    return await isFileExists(kernelApi, "/data/plugins/siyuan-plugin-picgo/plugin.json", "text")
  }

  return {
    handlePicgo,
    getImageItemsFromMd,
    getPicbedServiceType,
    checkPicgoInstalled,
  }
}

export { usePicgoBridge }
