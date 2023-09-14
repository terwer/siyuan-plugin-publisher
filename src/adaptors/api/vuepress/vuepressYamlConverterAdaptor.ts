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
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { toRaw } from "vue"

/**
 * Vuepress平台的YAML解析器
 *
 * @see {https://doc.xugaoyi.com/pages/3216b0/ front-tmatter}
 * @author terwer
 * @since 0.8.1
 */
class VuepressYamlConverterAdaptor extends YamlConvertAdaptor {
  private readonly logger = createAppLogger("vuepress-yaml-converter-adaptor")

  public convertToYaml(post: Post, cfg?: BlogConfig): YamlFormatObj {
    this.logger.debug("您正在使用 Vuepress Yaml Converter", { post: toRaw(post) })
    let yamlFormatObj: YamlFormatObj = new YamlFormatObj()
    // title
    yamlFormatObj.yamlObj.title = post.title

    // date
    yamlFormatObj.yamlObj.date = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true)

    // meta
    yamlFormatObj.yamlObj.meta = [
      {
        name: "keywords",
        content: post.mt_keywords.split(",").join(" "),
      },
      {
        name: "description",
        content: post.shortDesc ?? "",
      },
    ]

    // tags
    if (!StrUtil.isEmptyString(post.mt_keywords)) {
      const tags = post.mt_keywords.split(",")
      yamlFormatObj.yamlObj.tags = tags
    }

    // categories
    if (post.categories?.length > 0) {
      yamlFormatObj.yamlObj.categories = post.categories
    }

    // permalink
    if (cfg.yamlLinkEnabled) {
      let link = "/post/" + post.wp_slug + ".html"
      yamlFormatObj.yamlObj.permalink = link
    }

    // author
    let githubUrl = "https://github.com/terwer"
    const githubCfg = cfg as CommonGithubConfig
    if (githubCfg.home) {
      githubUrl = StrUtil.pathJoin(githubCfg.home, "/" + githubCfg.username)
    }
    yamlFormatObj.yamlObj.author = {
      name: githubCfg.author ?? "terwer",
      link: githubUrl,
    }

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
    const yamlMeta = yamlFormatObj.yamlObj.meta
    for (let i = 0; i < yamlMeta.length; i++) {
      const m = yamlMeta[i]
      if (m.name === "description" && !StrUtil.isEmptyString(m.content)) {
        post.shortDesc = m.content
        break
      }
    }

    // 标签
    post.mt_keywords = yamlFormatObj.yamlObj?.tags?.join(",")

    // 分类
    post.categories = yamlFormatObj.yamlObj?.categories

    // 添加新的YAML
    post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    this.logger.debug("转换完成，post =>", post)
    return post
  }
}

export { VuepressYamlConverterAdaptor }
