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

import { PicgoPostResult } from "~/utils/models/picgoPostResult"
import { ImageParser } from "~/utils/parser/imageParser"
import { LogFactory } from "~/utils/logUtil"
import { ImageItem } from "~/utils/models/imageItem"
import { isEmptyString, pathJoin } from "~/utils/util"
import { CONSTANTS } from "~/utils/constants/constants"
import { parseJSONObj, toJSONString } from "~/utils/configUtil"
import { getSiyuanCfg } from "~/utils/platform/siyuan/siYuanConfig"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { isElectron } from "~/utils/browserUtil"
import { getSiyuanNewWinDataDir } from "~/utils/otherlib/siyuanBrowserUtil"
import { isFileExist } from "~/utils/otherlib/ChromeUtil"
import picgoUtil from "~/utils/otherlib/picgoUtil"
import { ElMessage } from "element-plus"

/**
 * Picgo与文章交互的通用方法
 */
export class PicgoPostApi {
  private readonly logger = LogFactory.getLogger("utils/platform/picgo/picgoPostApi.ts")
  private imageParser: ImageParser
  private siyuanApi: SiYuanApi

  constructor() {
    this.imageParser = new ImageParser()
    this.siyuanApi = new SiYuanApi()
  }

  /**
   * 将字符串数组格式的图片信息转换成图片对象数组
   * @param attrs 文章属性
   * @param retImgs  字符串数组格式的图片信息
   */
  public async doConvertImagesToImagesItemArray(attrs, retImgs: any[]): Promise<ImageItem[]> {
    let ret = <ImageItem[]>[]
    for (let i = 0; i < retImgs.length; i++) {
      const retImg = retImgs[i]
      let isLocal = false
      const originUrl = retImg
      let imgUrl = retImg

      // 获取属性存储的映射数据
      let fileMap = {}
      this.logger.debug("attrs=>", attrs)
      if (!isEmptyString(attrs[CONSTANTS.PICGO_FILE_MAP_KEY])) {
        fileMap = parseJSONObj(attrs[CONSTANTS.PICGO_FILE_MAP_KEY])
        this.logger.debug("fileMap=>", fileMap)
      }

      // 处理思源本地图片预览
      if (/^assets/.test(originUrl)) {
        const baseUrl = getSiyuanCfg().baseUrl
        imgUrl = pathJoin(baseUrl, "/" + imgUrl)
        isLocal = true
      }

      const imageItem = new ImageItem(originUrl, imgUrl, isLocal)
      // logger.debug("imageItem.hash imageItem.name=>", imageItem.name)
      // logger.debug("imageItem.hash fileMap=>", fileMap)
      // logger.debug("imageItem.hash=>", imageItem.hash)
      // logger.debug("fileMap[imageItem.hash]=>", fileMap[imageItem.hash])
      if (fileMap[imageItem.hash]) {
        const newImageItem = fileMap[imageItem.hash]
        this.logger.debug("newImageItem=>", newImageItem)
        if (!newImageItem.isLocal) {
          imageItem.isLocal = false
          imageItem.url = newImageItem.url
        }
      }

      // imageItem.originUrl = decodeURIComponent(imageItem.originUrl)
      imageItem.url = decodeURIComponent(imageItem.url)
      this.logger.debug("imageItem=>", imageItem)
      ret.push(imageItem)
    }

    return ret
  }

  /**
   * 上传当前文章图片到图床
   * @param pageId 文章ID
   * @param attrs 文章属性
   * @param mdContent 文章的Markdown文本
   */
  public async uploadPostImagesToBed(pageId: string, attrs: any, mdContent: string): Promise<PicgoPostResult> {
    let ret = new PicgoPostResult()

    const localImages = this.imageParser.parseLocalImagesToArray(mdContent)
    const uniqueLocalImages = [...new Set([...localImages])]
    this.logger.debug("uniqueLocalImages=>", uniqueLocalImages)

    if (uniqueLocalImages.length == 0) {
      ret.flag = false
      ret.mdContent = mdContent
      return Promise.resolve(ret)
    }

    // 开始上传
    try {
      const imageItemArray = await this.doConvertImagesToImagesItemArray(attrs, uniqueLocalImages)

      let replaceMap = {}
      let hasLocalImages = false
      for (let i = 0; i < imageItemArray.length; i++) {
        const imageItem = imageItemArray[i]
        if (imageItem.originUrl.includes("assets")) {
          replaceMap[imageItem.hash] = imageItem
        }

        if (!imageItem.isLocal) {
          this.logger.warn("已经上传过图床，请勿重复上传=>", imageItem.originUrl)
          continue
        }

        hasLocalImages = true
        // 实际上传逻辑
        await this.uploadSingleImageToBed(pageId, attrs, imageItem)
        // 上传完成，需要获取最新链接
        const newattrs = await this.siyuanApi.getBlockAttrs(pageId)
        const newfileMap = parseJSONObj(newattrs[CONSTANTS.PICGO_FILE_MAP_KEY])
        const newImageItem: ImageItem = newfileMap[imageItem.hash]
        replaceMap[imageItem.hash] = new ImageItem(newImageItem.originUrl, newImageItem.url, false)
      }

      if (!hasLocalImages) {
        ElMessage.warning("未发现本地图片，不上传")
      }

      // 处理链接替换
      this.logger.debug("准备替换正文图片，replaceMap=>", JSON.stringify(replaceMap))
      this.logger.debug("开始替换正文，原文=>", JSON.stringify({ mdContent: mdContent }))
      ret.mdContent = this.imageParser.replaceImagesWithImageItemArray(mdContent, replaceMap)
      this.logger.debug("图片链接替换完成，新正文=>", JSON.stringify({ newmdContent: ret.mdContent }))

      ret.flag = true
      this.logger.debug("正文替换完成，最终结果=>", ret)
    } catch (e) {
      this.logger.error("文章图片上传失败=>", e)
    }
    return Promise.resolve(ret)
  }

  /**
   * 上传单张图片到图床
   * @param pageId 文章ID
   * @param attrs 文章属性
   * @param imageItem 图片信息
   * @param forceUpload 强制上传
   */
  public async uploadSingleImageToBed(
    pageId: string,
    attrs: any,
    imageItem: ImageItem,
    forceUpload?: boolean
  ): Promise<boolean> {
    const mapInfoStr = attrs[CONSTANTS.PICGO_FILE_MAP_KEY] ?? "{}"
    const fileMap = parseJSONObj(mapInfoStr)
    this.logger.warn("fileMap=>", fileMap)

    // 处理上传
    const filePaths = []
    if (forceUpload !== true && !imageItem.isLocal) {
      this.logger.warn("非本地图片，忽略=>", imageItem.url)
      return
    }

    let imageFullPath
    if (isElectron) {
      const imagePath = imageItem.originUrl.substring(imageItem.originUrl.indexOf("assets"), imageItem.originUrl.length)
      const dataDir: string = getSiyuanNewWinDataDir()
      imageFullPath = `${dataDir}/${imagePath}`

      // 不存在就用网页url
      if (!isFileExist(imageFullPath)) {
        imageFullPath = imageItem.url
      }
    } else {
      imageFullPath = imageItem.url
    }
    this.logger.warn("isElectron=>" + isElectron + ", imageFullPath=>", imageFullPath)
    filePaths.push(imageFullPath)

    // 批量上传
    const imageJson: any = await picgoUtil.uploadByPicGO(filePaths)
    this.logger.warn("图片上传完成，imageJson=>", imageJson)
    const imageJsonObj = JSON.parse(imageJson)
    // 处理后续
    if (imageJsonObj && imageJsonObj.length > 0) {
      const img = imageJsonObj[0]
      if (!img || !img.imgUrl || isEmptyString(img.imgUrl)) {
        throw new Error(
          "图片上传失败，可能原因：PicGO配置错误或者该平台不支持图片覆盖，请检查配置或者尝试上传新图片。请打开picgo.log查看更多信息"
        )
      }
      const newImageItem = new ImageItem(imageItem.originUrl, img.imgUrl, false)
      fileMap[newImageItem.hash] = newImageItem
    } else {
      throw new Error("图片上传失败，可能原因：PicGO配置错误，请检查配置。请打开picgo.log查看更多信息")
    }

    this.logger.warn("newFileMap=>", fileMap)

    const newFileMapStr = toJSONString(fileMap)
    await this.siyuanApi.setBlockAttrs(pageId, {
      [CONSTANTS.PICGO_FILE_MAP_KEY]: newFileMapStr,
    })
  }
}
