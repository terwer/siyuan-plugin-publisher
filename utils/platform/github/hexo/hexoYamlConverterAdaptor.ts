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

import {
  IYamlConvertAdaptor,
  YamlConvertAdaptor,
} from "~/utils/platform/yamlConvertAdaptor"
import { PostForm } from "~/utils/models/postForm"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { YamlFormatObj } from "~/utils/models/yamlFormatObj"
import { LogFactory } from "~/utils/logUtil"
import { obj2Yaml } from "~/utils/yamlUtil"
import { formatIsoToZhDate } from "~/utils/dateUtil"
import { isEmptyString } from "~/utils/util"

/**
 * Hexo平台的YAML解析器
 */
export class HexoYamlConverterAdaptor
  extends YamlConvertAdaptor
  implements IYamlConvertAdaptor
{
  private readonly logger = LogFactory.getLogger(
    "utils/platform/github/hexo/hexoYamlConverterAdaptor.ts"
  )

  convertToYaml(postForm: PostForm, githubCfg?: IGithubCfg): YamlFormatObj {
    let yamlFormatObj: YamlFormatObj = new YamlFormatObj()
    this.logger.debug("您正在使用 Hexo Yaml Converter", postForm)

    // title
    yamlFormatObj.yamlObj.title = postForm.formData.title

    // date
    // yamlFormatObj.yamlObj.date = postForm.formData.created

    // updated
    yamlFormatObj.yamlObj.updated = formatIsoToZhDate(
      new Date().toISOString(),
      true
    )

    // excerpt
    yamlFormatObj.yamlObj.excerpt = postForm.formData.desc

    // tags
    yamlFormatObj.yamlObj.tags = postForm.formData.tag.dynamicTags

    // categories
    yamlFormatObj.yamlObj.categories = postForm.formData.categories

    // permalink
    let link = "/post/" + postForm.formData.customSlug + ".html"
    if (githubCfg && !isEmptyString(githubCfg.previewUrl)) {
      link = githubCfg.previewUrl.replace(
        "[postid]",
        postForm.formData.customSlug
      )

      const created = postForm.formData.created
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
        link = link.replace(
          /\[cats]/,
          yamlFormatObj.yamlObj.categories.join("/")
        )
      } else {
        link = link.replace(/\/\[cats]/, "")
      }
    }
    yamlFormatObj.yamlObj.permalink = link

    // comments
    yamlFormatObj.yamlObj.comments = true

    // toc
    yamlFormatObj.yamlObj.toc = true

    // formatter
    let yaml = obj2Yaml(yamlFormatObj.yamlObj)
    // 修复yaml的ISO日期格式（js-yaml转换的才需要）
    yaml = formatIsoToZhDate(yaml, true)
    // this.logger.debug("yaml=>", yaml)

    yamlFormatObj.formatter = yaml
    yamlFormatObj.mdContent = postForm.formData.mdContent
    yamlFormatObj.mdFullContent =
      yamlFormatObj.formatter + "\n\n" + yamlFormatObj.mdContent
    yamlFormatObj.htmlContent = postForm.formData.htmlContent

    return yamlFormatObj
  }

  convertToAttr(
    yamlFormatObj: YamlFormatObj,
    githubCfg?: IGithubCfg
  ): PostForm {
    return super.convertToAttr(yamlFormatObj, githubCfg)
  }
}
