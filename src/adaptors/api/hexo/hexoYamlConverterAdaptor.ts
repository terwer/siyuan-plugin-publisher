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

/**
 * Hexo平台的YAML解析器
 *
 * @author terwer
 * @since 0.8.1
 */
export class HexoYamlConverterAdaptor extends YamlConvertAdaptor {
  private readonly logger = createAppLogger("hexo-yaml-converter-adaptor")

  convertToYaml(post: Post, cfg?: BlogConfig): YamlFormatObj {
    let yamlFormatObj: YamlFormatObj = new YamlFormatObj()
    this.logger.debug("您正在使用 Hexo Yaml Converter", post)

    // title
    yamlFormatObj.yamlObj.title = post.title

    // date
    yamlFormatObj.yamlObj.date = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true)

    // updated
    yamlFormatObj.yamlObj.updated = DateUtil.formatIsoToZh(post.dateUpdated.toISOString(), true)

    // excerpt
    yamlFormatObj.yamlObj.excerpt = post.shortDesc

    // tags
    yamlFormatObj.yamlObj.tags = post.mt_keywords.split(",")

    // categories
    yamlFormatObj.yamlObj.categories = post.categories

    // permalink
    let link = "/post/" + post.wp_slug + ".html"
    if (cfg instanceof CommonGithubConfig) {
      const githubCfg = cfg as CommonGithubConfig
      if (!StrUtil.isEmptyString(cfg.previewPostUrl)) {
        link = githubCfg.previewPostUrl.replace("[postid]", post.wp_slug)
        const created = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true)
        const datearr = created.split(" ")[0]
        const numarr = datearr.split("-")
        this.logger.debug("created numarr=>", numarr)
        const y = numarr[0]
        const m = numarr[1]
        const d = numarr[2]
        link = link.replace(/\[yyyy]/g, y)
        link = link.replace(/\[MM]/g, m)
        link = link.replace(/\[mm]/g, m)
        link = link.replace(/\[dd]/g, d)

        if (yamlFormatObj.yamlObj.categories.length > 0) {
          link = link.replace(/\[cats]/, yamlFormatObj.yamlObj.categories.join("/"))
        } else {
          link = link.replace(/\/\[cats]/, "")
        }
      }
    }
    yamlFormatObj.yamlObj.permalink = link

    // comments
    yamlFormatObj.yamlObj.comments = true

    // toc
    yamlFormatObj.yamlObj.toc = true

    // formatter
    let yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)
    this.logger.debug("yaml=>", yaml)

    yamlFormatObj.formatter = yaml
    yamlFormatObj.mdContent = post.markdown
    yamlFormatObj.mdFullContent = yamlFormatObj.formatter + "\n\n" + yamlFormatObj.mdContent
    yamlFormatObj.htmlContent = post.html
    return yamlFormatObj
  }

  convertToAttr(post: Post, yamlFormatObj: YamlFormatObj, cfg?: BlogConfig): Post {
    this.logger.debug("开始转换YAML到Post", yamlFormatObj)

    // 标题
    post.title = yamlFormatObj.yamlObj?.title

    // 发布时间
    post.dateCreated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj.date)
    post.dateUpdated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj.updated)

    // 摘要
    post.shortDesc = yamlFormatObj.yamlObj?.excerpt

    // 标签
    post.mt_keywords = yamlFormatObj.yamlObj?.tags?.join(",")

    // 分类
    post.categories = yamlFormatObj.yamlObj?.categories

    // 添加新的YAML
    post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)
    const regex = /^---\n([\s\S]*?\n)---/;
    if (regex.test(post.markdown)) {
      post.markdown = post.markdown.replace(regex, "");
      this.logger.debug("发现原有的YAML，已移除")
    }
    post.markdown = `${post.yaml}\n${post.markdown}`

    this.logger.debug("转换完成，post =>", post)
    return post
  }
}
