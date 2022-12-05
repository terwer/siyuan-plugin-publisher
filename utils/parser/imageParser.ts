/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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
import { inSiyuan } from "~/utils/platform/siyuan/siyuanUtil"
import { imageToBase64 } from "~/utils/parser/imageToBase64"
import { getEnv } from "~/utils/envUtil"
import { appandStr } from "~/utils/strUtil"

/**
 * 图片解析器
 * 自动解析文章中的img标签
 * 自动处理src外链、base64数据
 * @author terwer
 * @since 0.1.0
 */
export class ImageParser {
  private readonly logger = LogFactory.getLogger("utils/parser/imageParser.ts")

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
   * @param content
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
  public async replaceImagesWithBase64(content: string): Promise<string> {
    let newcontent = content

    const imgRegex = /!\[.*]\((http|https):\/.*\/.*\)/g
    const matches = newcontent.match(imgRegex)
    // 没有图片，无需处理
    if (matches == null || matches.length === 0) {
      return newcontent
    }

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i]
      this.logger.debug("img=>", match)

      const src = match.replace(/!\[]\(/g, "").replace(/\)/, "")
      this.logger.debug("src=>", src)

      let newImg
      if (inSiyuan()) {
        const imageBase64WithURI = await imageToBase64({ uri: src })
        newImg = imageBase64WithURI?.base64 ?? "no pic"
      } else {
        const middleWareUrl = getEnv("VITE_MIDDLEWARE_URL") ?? "/api/middleware"
        const middleApiUrl = middleWareUrl + "/imageToBase64"

        const data = {
          fetchParams: {
            imgUrl: src,
          },
        }

        const middleFetchOption = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }

        this.logger.debug("middleApiUrl=>", middleApiUrl)
        this.logger.debug("middleFetchOption=>", middleFetchOption)

        const response: Response = await fetch(middleApiUrl, middleFetchOption)
        const resJson = await response.json()
        this.logger.debug("resJson=>", resJson)
        newImg = resJson?.body?.base64str ?? "parse error"
      }

      newImg = appandStr(
        '<img src="data:image/png;base64,',
        newImg,
        '"  alt="base64Image"/>'
      )
      newcontent = newcontent.replace(match, newImg)
    }

    return newcontent
  }

  /**
   * 将外链外链图片替换为ascii码
   * @param content
   */
  public replaceImagesWithAscii(content: string): string {
    const newcontent = content
    return newcontent
  }

  /**
   * 将外链外链图片替换为彩色ascii码
   * @param content
   */
  public replaceImagesWithColorAscii(content: string): string {
    const newcontent = content
    return newcontent
  }

  /**
   * 上传外链图片到图床
   * @param content
   */
  public async uploadImageToBeds(content: string): Promise<string> {
    const newcontent = content

    return newcontent
  }

  /**
   * 下载图片到本地并打包成zip
   */
  public async downloadMdWithImages(): Promise<void> {}

  /**
   * 下载图片到本地并保存到思源
   * @deprecated 思源笔记已经有此功能
   */
  public async downloadImagesToSiyuan(): Promise<void> {
    throw new Error("思源笔记已经有此功能，无需重新实现")
  }
}
