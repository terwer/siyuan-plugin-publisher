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

import {
  IYamlConvertAdaptor,
  YamlConvertAdaptor,
} from "~/utils/platform/yamlConvertAdaptor"
import { PostForm } from "~/utils/models/postForm"
import { YamlObj } from "~/utils/models/yamlObj"
import { LogFactory } from "~/utils/logUtil"
import { covertStringToDate, formatIsoToZhDate } from "~/utils/dateUtil"
import { obj2Yaml } from "~/utils/yamlUtil"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { isEmptyString } from "~/utils/util"

export class VuepressYamlConvertAdaptor
  extends YamlConvertAdaptor
  implements IYamlConvertAdaptor
{
  private readonly logger = LogFactory.getLogger(
    "utils/platform/github/vuepress/VuepressYamlConvertAdaptor.ts"
  )

  convert(postForm: PostForm, githubCfg?: IGithubCfg): YamlObj {
    let yamlObj: YamlObj = new YamlObj()
    this.logger.debug("您正在使用 Vuepress Yaml Converter", postForm)
    yamlObj.yamlObj.title = postForm.formData.title
    let link = "/post/" + postForm.formData.customSlug + ".html"
    if (githubCfg && !isEmptyString(githubCfg.previewUrl)) {
      link = githubCfg.previewUrl.replace(
        "[postid]",
        postForm.formData.customSlug
      )
    }
    this.logger.debug("link=>", link)
    yamlObj.yamlObj.permalink = link

    yamlObj.yamlObj.date = covertStringToDate(postForm.formData.created)
    yamlObj.yamlObj.meta = [
      {
        name: "keywords",
        content: postForm.formData.tag.dynamicTags.join(" "),
      },
      {
        name: "description",
        content: postForm.formData.desc,
      },
    ]
    yamlObj.yamlObj.tags = postForm.formData.tag.dynamicTags
    yamlObj.yamlObj.categories = postForm.formData.categories

    // formatter
    let yaml = obj2Yaml(yamlObj.yamlObj)
    // 修复yaml的ISO日期格式（js-yaml转换的才需要）
    yaml = formatIsoToZhDate(yaml, true)
    yamlObj.formatter = yaml
    yamlObj.mdContent = postForm.formData.mdContent
    yamlObj.mdFullContent = yamlObj.formatter + yamlObj.mdContent
    yamlObj.htmlContent = postForm.formData.htmlContent

    return yamlObj
  }
}
