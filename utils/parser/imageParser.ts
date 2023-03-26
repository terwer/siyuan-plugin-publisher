/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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

import { LogFactory } from "~/utils/logUtil"
// import { imageToBase64 } from "~/utils/otherlib/imageToBase64"
import { ImageItem } from "~/utils/models/imageItem"
import { type ParsedImage } from "~/utils/models/parsedImage"

/**
 * 图片解析器
 * 自动解析文章中的img标签
 * 自动处理src外链、base64数据
 * @author terwer
 * @since 0.1.0
 */
export class ImageParser {
  private readonly logger = LogFactory.getLogger("utils/parser/imageParser.ts")

  /**
   * 检测是否有外链图片
   * @param content 文章正文
   */
  public hasExternalImages(content: string): boolean {
    const flag = false

    const imgRegex = /!\[.*]\((http|https):\/.*\/.*\)/g
    const matches = content.match(imgRegex)
    if (matches != null && matches.length > 0) {
      return true
    }

    const imgBase64Regex = /!\[.*]\((data:image):\/.*\/.*\)/g
    const base64Matches = content.match(imgBase64Regex)
    if (base64Matches != null && base64Matches.length > 0) {
      return true
    }

    return flag
  }

  /**
   * 剔除外链图片
   * @param content 文章正文
   */
  public removeImages(content: string): string {
    let newcontent = content

    newcontent = newcontent.replace(/!\[.*]\((http|https):\/.*\/.*\)/g, "")

    return newcontent
  }

  /**
   * 将外链外链图片替换为base64
   * @param content
   */
  // public async replaceImagesWithBase64(content: string): Promise<string> {
  //   let newcontent = content
  //
  //   const imgRegex = /!\[.*]\((http|https):\/.*\/.*\)/g
  //   const matches = newcontent.match(imgRegex)
  //   // 没有图片，无需处理
  //   if (matches == null || matches.length === 0) {
  //     return newcontent
  //   }
  //
  //   for (let i = 0; i < matches.length; i++) {
  //     const match = matches[i]
  //     this.logger.debug("img=>", match)
  //
  //     const src = match.replace(/!\[.*]\(/g, "").replace(/\)/, "")
  //     this.logger.debug("src=>", src)
  //
  //     let newImg
  //     if (inSiyuan()) {
  //       const imageBase64WithURI = await imageToBase64({ uri: src })
  //       newImg = imageBase64WithURI?.base64 ?? "no pic"
  //     } else {
  //       const middlewareUrl = getEnvOrDefault(
  //         "VITE_MIDDLEWARE_URL",
  //         "/api/middleware"
  //       )
  //       const middleApiUrl = middlewareUrl + "/imageToBase64"
  //
  //       const data = {
  //         fetchParams: {
  //           imgUrl: src,
  //         },
  //       }
  //
  //       const middleFetchOption = {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       }
  //
  //       this.logger.debug("middleApiUrl=>", middleApiUrl)
  //       this.logger.debug("middleFetchOption=>", middleFetchOption)
  //
  //       const response: Response = await fetch(middleApiUrl, middleFetchOption)
  //       const resJson = await response.json()
  //       this.logger.debug("resJson=>", resJson)
  //       newImg = resJson?.body?.base64str ?? "parse error"
  //     }
  //
  //     newImg = appendStr(
  //       '<img src="data:image/png;base64,',
  //       newImg,
  //       '"  alt="base64Image"/>'
  //     )
  //     newcontent = newcontent.replace(match, newImg)
  //   }
  //
  //   return newcontent
  // }

  /**
   * 解析图片块为图片链接
   * @param content 图片块
   * @private
   */
  public parseImagesToArray(content: string): ParsedImage[] {
    let ret = [] as ParsedImage[]
    const remoteImages = this.parseRemoteImagesToArray(content)
    const localImages = this.parseLocalImagesToArray(content)

    // 会有很多重复值
    // ret = ret.concat(remoteImages, localImages)
    // 下面的写法可以去重
    ret = [...new Set([...remoteImages, ...localImages])]

    return ret
  }

  /**
   * 解析图片块为远程图片链接
   *
   * @param markdownText 图片块
   * @private
   */
  public parseRemoteImagesToArray(markdownText: string): ParsedImage[] {
    // 定义正则表达式来匹配以 http 或 https 开头的 Markdown 格式的图片链接
    const regex = /!\[(.*?)\]\(((https|http|ftp)?:\/\/[^\s/$.?#].[^\s]*)\s*"(.*?)"\)\s*{:\s*([^\n]*)}/g

    // 使用正则表达式来匹配 Markdown 格式的图片链接，并提取其中的各个属性
    const ParsedImages = []
    for (const match of markdownText.matchAll(regex)) {
      const altText = match[1] ? match[1] : ""
      const url = match[2] ? match[2] : ""
      const title = match[3] ? match[3].replace(/"/g, "") : ""

      // 将图片链接的各个属性封装成一个对象，并添加到数组中
      ParsedImages.push({
        url,
        alt: altText,
        title,
        isLocal: false,
      })
    }
    this.logger.debug("远程图片解析完毕.")
    return ParsedImages
  }

  /**
   * 解析图片块为本地图片链接
   *
   * @param markdownText 图片块
   */
  public parseLocalImagesToArray(markdownText: string): ParsedImage[] {
    // 定义正则表达式来匹配以 assets 开头但不以 http、https 或 ftp 开头的 Markdown 格式的图片链接
    const regex = /!\[(.*?)\]\(((?!http|https|ftp)assets\/.*?)\s*("(?:.*[^"])")?\)\s*(\{(?:.*[^"])})?/g

    // 使用正则表达式来匹配 Markdown 格式的图片链接，并提取其中的各个属性
    const ParsedImages = []
    for (const match of markdownText.matchAll(regex)) {
      const altText = match[1] ? match[1] : ""
      const url = match[2] ? match[2] : ""
      const title = match[3] ? match[3].replace(/"/g, "") : ""

      // 将图片链接的各个属性封装成一个对象，并添加到数组中
      ParsedImages.push({
        url,
        alt: altText,
        title,
        isLocal: true,
      })
    }
    this.logger.debug("本地图片解析完毕.")
    return ParsedImages
  }

  /**
   * 将外链外链图片替换为图床链接
   * @param content 正文
   * @param replaceMap 替换信息
   */
  public replaceImagesWithImageItemArray(content: string, replaceMap: any): string {
    let newcontent = content

    const imgRegex = /!\[.*]\(assets\/.*\..*\)/g
    const matches = newcontent.match(imgRegex)
    // 没有图片，无需处理
    if (matches == null || matches.length === 0) {
      this.logger.warn("未匹配到本地图片，将不会替换图片链接")
      return newcontent
    }

    for (let i = 0; i < matches.length; i++) {
      const img = matches[i]
      this.logger.debug("img=>", img)

      const src = img.replace(/!\[.*]\(/g, "").replace(/\)/, "")
      this.logger.debug("src=>", src)
      let url
      let title
      const urlAttrs = src.split(" ")
      if (urlAttrs.length > 1) {
        url = urlAttrs[0]
        title = urlAttrs[1].replace(/"/g, "")
      } else {
        url = urlAttrs[0]
      }

      const tempImageItem = new ImageItem(url, "", true)
      const hash = tempImageItem.hash
      const replaceImageItem: ImageItem = replaceMap[hash]
      const alt = replaceImageItem?.alt ?? ""

      let newImg = `![${alt}](${replaceImageItem?.url})`
      if (title) {
        newImg = `![${alt}](${replaceImageItem?.url} "${title}")`
      }
      this.logger.debug("newImg=>", newImg)

      newcontent = newcontent.replaceAll(img, newImg)
    }

    return newcontent
  }

  /**
   * 下载图片到本地并打包成zip
   * @@deprecated 不再支持
   */
  // public async downloadMdWithImages(): Promise<void> {}

  /**
   * 下载图片到本地并保存到思源
   * @deprecated 思源笔记已经有此功能
   */
  // public async downloadImagesToSiyuan(): Promise<void> {
  //   throw new Error("思源笔记已经有此功能，无需重新实现")
  // }
}
