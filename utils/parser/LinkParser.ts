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

import { LogFactory } from "~/utils/logUtil"
import { getPublishCfg } from "~/utils/publishUtil"
import { removeTitleNumber } from "~/utils/htmlUtil"
import { type IApi } from "~/utils/api"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"

/**
 * 链接解析器，复制将思源笔记的 siyuan:// 外链转换为真实文章之间的跳转链接
 * @author terwer
 * @since 0.6.1
 */
export class LinkParser {
  private readonly logger = LogFactory.getLogger("utils/parser/LinkParser.ts")
  private readonly siyuanApi = new SiYuanApi()

  /**
   * 转换思源内部链接为真实链接
   *
   * @param content
   */
  public convertSiyuanLinkToInnerLink(content: string): string {
    let newcontent = content

    const linkRegex = /\[.*]\(.*\)/g
    const matches = newcontent.match(linkRegex)
    // 没有图片，无需处理
    if (matches == null || matches.length === 0) {
      this.logger.warn("未匹配到链接，将不会替换链接")
      return newcontent
    }

    for (let i = 0; i < matches.length; i++) {
      const mstr = matches[i]

      if (!mstr.includes("siyuan://blocks")) {
        continue
      }

      this.logger.debug("找到思源链接=>", mstr)

      const src = mstr.replace(/\[.*]\(/g, "").replace(/\)/, "")
      this.logger.debug("src=>", src)

      let title = mstr.replace(/\[/g, "").replace(/]\(.*\)/g, "")
      const publishCfg = getPublishCfg()
      if (publishCfg.fixTitle) {
        title = removeTitleNumber(title)
      }
      this.logger.debug("title=>", title)

      let linkUrl = src.replace(/siyuan:\/\/blocks\//g, "")
      linkUrl = "/detail/index.html?id=" + linkUrl
      const newLink = `[${title}](${linkUrl})`
      this.logger.debug("newLink=>", newLink)

      newcontent = newcontent.replaceAll(mstr, newLink)
    }

    return newcontent
  }

  /**
   * 转换思源内部链接为平台内部链接
   *
   * @param content - 需要转换的内容
   * @param api - API对象
   */
  public async convertSiyuanLinkToPlatformLink(content: string, api: IApi): Promise<string> {
    let newcontent = content

    const linkRegex = /\[.*]\(.*\)/g
    const matches = newcontent.match(linkRegex)
    // 未找到链接，无需处理
    if (matches == null || matches.length === 0) {
      this.logger.warn("未匹配到链接，将不会替换链接")
      return newcontent
    }

    for (let i = 0; i < matches.length; i++) {
      const mstr = matches[i]

      if (!mstr.includes("siyuan://blocks")) {
        continue
      }

      this.logger.debug("找到思源链接=>", mstr)

      const src = mstr.replace(/\[.*]\(/g, "").replace(/\)/, "")
      this.logger.debug("src=>", src)

      let title = mstr.replace(/\[/g, "").replace(/]\(.*\)/g, "")
      const publishCfg = getPublishCfg()
      if (publishCfg.fixTitle) {
        title = removeTitleNumber(title)
      }
      this.logger.debug("title=>", title)

      const pageId = src.replace(/siyuan:\/\/blocks\//g, "")
      let rootId = pageId
      const pidObj = await this.siyuanApi.getRootBlock(pageId)
      if (pidObj) {
        rootId = pidObj.root_id
      }
      const meta = await this.siyuanApi.getBlockAttrs(rootId)
      const customSlug = meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]
      const url = await api.getPreviewUrl(customSlug)
      this.logger.debug("url=>", url)

      // 新地址
      const newLink = `[${title}](${url})`
      this.logger.debug("newLink=>", newLink)

      newcontent = newcontent.replaceAll(mstr, newLink)
    }

    return newcontent
  }
}
