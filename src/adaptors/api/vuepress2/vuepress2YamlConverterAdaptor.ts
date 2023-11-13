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
import { StrUtil, YamlUtil } from "zhi-common"
import { toRaw } from "vue"

/**
 * Vuepress2 平台的YAML解析器
 *
 * @see {https://vuepress2.io/docs/front-matter front-tmatter}
 * @author terwer
 * @since 0.8.1
 */
class Vuepress2YamlConverterAdaptor extends YamlConvertAdaptor {
  private readonly logger = createAppLogger("vuepress2-yaml-converter-adaptor")

  /**
   * 将文章转换为YAML格式对象
   *
   * @param post - 要转换的文章对象
   * @param yamlFormatObj （可选）
   * @param cfg - 博客配置（可选）
   * @returns 返回YAML格式对象
   */
  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    this.logger.debug("您正在使用 Vuepress2 Yaml Converter", { post: toRaw(post) })
    // 没有的情况默认初始化一个
    if (!yamlFormatObj) {
      yamlFormatObj = new YamlFormatObj()
    }

    // title
    yamlFormatObj.yamlObj.title = post.title

    // short_title
    yamlFormatObj.yamlObj.short_title = ""

    // date
    yamlFormatObj.yamlObj.date = post.dateCreated

    // description
    if (!StrUtil.isEmptyString(post.shortDesc)) {
      yamlFormatObj.yamlObj.description = post.shortDesc
    }

    // tag
    if (!StrUtil.isEmptyString(post.mt_keywords)) {
      const tag = post.mt_keywords.split(",")
      yamlFormatObj.yamlObj.tag = tag
    }

    // category
    if (post.categories?.length > 0) {
      yamlFormatObj.yamlObj.category = post.categories
    }

    // article
    yamlFormatObj.yamlObj.article = true

    // timeline
    yamlFormatObj.yamlObj.timeline = false

    // isOriginal
    yamlFormatObj.yamlObj.isOriginal = true

    // formatter
    const yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    yamlFormatObj.formatter = this.removeTZ(yaml)
    yamlFormatObj.mdContent = post.markdown
    yamlFormatObj.mdFullContent = YamlUtil.addYamlToMd(yamlFormatObj.formatter, yamlFormatObj.mdContent)
    yamlFormatObj.htmlContent = post.html
    this.logger.info("生成默认的YAML")

    return yamlFormatObj
  }

  /**
   * 将文章转换为属性
   *
   * @param post - 要转换的文章对象
   * @param yamlFormatObj - YAML 格式对象
   * @param cfg - 博客配置（可选）
   * @returns 转换后的文章对象
   */
  public convertToAttr(post: Post, yamlFormatObj: YamlFormatObj, cfg?: BlogConfig): Post {
    this.logger.debug("开始转换YAML到Post", yamlFormatObj)

    // 标题
    if (yamlFormatObj.yamlObj?.title) {
      post.title = yamlFormatObj.yamlObj?.title
    }

    // 发布时间
    if (yamlFormatObj.yamlObj?.date) {
      post.dateCreated = yamlFormatObj.yamlObj?.date
    }

    // 摘要
    post.shortDesc = yamlFormatObj.yamlObj?.description

    // 标签
    post.mt_keywords = yamlFormatObj.yamlObj?.tag?.join(",")

    // 分类
    post.categories = yamlFormatObj.yamlObj?.category

    // 添加新的YAML
    const yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)
    post.yaml = this.removeTZ(yaml)

    this.logger.debug("转换完成，post =>", post)
    return post
  }

  // ================
  // private methods
  // ================
  /**
   * 移除YAML字符串中的时间戳信息（TZ）
   *
   * @param {string} yamlString - 要处理的YAML字符串
   * @returns {string} - 移除了时间戳信息的YAML字符串
   */
  private removeTZ(yamlString: string): string {
    return yamlString.replace(/---([\s\S]*?)---/g, function (match, captureGroup) {
      return match.replace(/T/g, " ").replace(/\.\d{3}Z/g, "")
    })
  }
}

export { Vuepress2YamlConverterAdaptor }
