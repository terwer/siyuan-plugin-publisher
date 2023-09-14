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

import { createAppLogger } from "~/src/utils/appLogger.ts"
import { BlogConfig, Post, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { DateUtil, StrUtil, YamlUtil } from "zhi-common"
import { toRaw } from "vue"

/**
 * Vitepress 平台的YAML解析器
 *
 * @see {https://vitepress.dev/guide/frontmatter front-tmatter}
 * @author terwer
 * @since 0.8.1
 */
class VitepressYamlConverterAdaptor extends YamlConvertAdaptor {
  private readonly logger = createAppLogger("vitepress-yaml-converter-adaptor")

  public convertToYaml(post: Post, cfg?: BlogConfig): YamlFormatObj {
    this.logger.debug("您正在使用 Vitepress Yaml Converter", { post: toRaw(post) })
    let yamlFormatObj: YamlFormatObj = new YamlFormatObj()
    // title
    yamlFormatObj.yamlObj.title = post.title

    // titleTemplate
    // yamlFormatObj.yamlObj.titleTemplate = post.title

    // description
    if (!StrUtil.isEmptyString(post.shortDesc)) {
      yamlFormatObj.yamlObj.description = post.shortDesc
    }

    // date
    yamlFormatObj.yamlObj.date = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true)

    // head
    yamlFormatObj.yamlObj.head = [
      [
        "meta",
        {
          name: "description",
          content: post?.shortDesc ?? "",
        },
        "meta",
        {
          name: "keywords",
          content: post?.mt_keywords?.split(",").join(" "),
        },
      ],
    ]

    // categories
    if (post.categories?.length > 0) {
      yamlFormatObj.yamlObj.categories = post.categories
    }

    // layout
    // https://vitepress.dev/reference/frontmatter-config#layout
    // yamlFormatObj.yamlObj.layout = "doc"

    // // date
    // yamlFormatObj.yamlObj.date = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true)

    // outline
    yamlFormatObj.yamlObj.outline = "deep"

    // navbar
    // yamlFormatObj.yamlObj.navbar = true

    // sidebar
    yamlFormatObj.yamlObj.sidebar = false

    // prev && next
    yamlFormatObj.yamlObj.prev = false
    yamlFormatObj.yamlObj.next = false

    // lastUpdated
    // yamlFormatObj.yamlObj.lastUpdated= true

    // editLink
    // yamlFormatObj.yamlObj.editLink = true

    // formatter
    let yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)
    this.logger.debug("yaml=>", yaml)

    yamlFormatObj.formatter = yaml
    yamlFormatObj.mdContent = post.markdown
    yamlFormatObj.mdFullContent = YamlUtil.addYamlToMd(yamlFormatObj.formatter, yamlFormatObj.mdContent)
    yamlFormatObj.htmlContent = post.html
    this.logger.info("生成默认的YAML")

    return yamlFormatObj
  }

  public convertToAttr(post: Post, yamlFormatObj: YamlFormatObj, cfg?: BlogConfig): Post {
    this.logger.debug("开始转换YAML到Post", yamlFormatObj)

    // 标题
    if (yamlFormatObj.yamlObj?.title) {
      post.title = yamlFormatObj.yamlObj?.title
    }

    // 发布时间
    if (yamlFormatObj.yamlObj?.date) {
      post.dateCreated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj?.date)
    }

    // 摘要
    if (yamlFormatObj.yamlObj?.description) {
      post.shortDesc = yamlFormatObj.yamlObj.description
    }

    // 标签
    const head = yamlFormatObj.yamlObj?.head
    if (head && head.length == 4) {
      for (let i = 0; i < head.length; i++) {
        const m = head[i]
        if (m?.name === "keywords" && !StrUtil.isEmptyString(m.content)) {
          post.mt_keywords = m.content?.split(" ")
          break
        }
      }
    }

    // 分类
    post.categories = yamlFormatObj.yamlObj?.categories

    // 添加新的YAML
    post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    this.logger.debug("转换完成，post =>", post)
    return post
  }
}

export { VitepressYamlConverterAdaptor }
