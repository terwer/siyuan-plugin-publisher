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

import { IYamlConvertAdaptor, YamlConvertAdaptor } from "~/utils/platform/yamlConvertAdaptor"
import { PostForm } from "~/utils/models/postForm"
import { YamlFormatObj } from "~/utils/models/yamlFormatObj"
import { LogFactory } from "~/utils/logUtil"
import { covertStringToDate, formatIsoToZhDate } from "~/utils/dateUtil"
import { obj2Yaml } from "~/utils/yamlUtil"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { isEmptyString, pathJoin } from "~/utils/util"

export class VuepressYamlConvertAdaptor extends YamlConvertAdaptor implements IYamlConvertAdaptor {
  private readonly logger = LogFactory.getLogger("utils/platform/github/vuepress/VuepressYamlConvertAdaptor.ts")

  convertToYaml(postForm: PostForm, githubCfg?: IGithubCfg): YamlFormatObj {
    let yamlFormatObj: YamlFormatObj = new YamlFormatObj()
    this.logger.debug("您正在使用 Vuepress Yaml Converter", postForm)

    // title
    yamlFormatObj.yamlObj.title = postForm.formData.title

    // permalink
    let link = "/post/" + postForm.formData.customSlug + ".html"
    if (githubCfg && !isEmptyString(githubCfg.previewUrl)) {
      link = githubCfg.previewUrl.replace("[postid]", postForm.formData.customSlug)
    }
    this.logger.debug("link=>", link)
    yamlFormatObj.yamlObj.permalink = link

    // date
    yamlFormatObj.yamlObj.date = covertStringToDate(postForm.formData.created)

    // meta
    yamlFormatObj.yamlObj.meta = [
      {
        name: "keywords",
        content: postForm.formData.tag.dynamicTags.join(" "),
      },
      {
        name: "description",
        content: postForm.formData.desc,
      },
    ]

    // tags
    yamlFormatObj.yamlObj.tags = postForm.formData.tag.dynamicTags

    // categories
    yamlFormatObj.yamlObj.categories = postForm.formData.categories

    // author
    let githubUrl = "https://github.com/terwer"
    if (githubCfg.baseUrl) {
      githubUrl = pathJoin(githubCfg.baseUrl, "/" + githubCfg.githubUser)
    }
    yamlFormatObj.yamlObj.author = {
      name: githubCfg.author ?? "terwer",
      link: githubUrl,
    }

    // formatter
    let yaml = obj2Yaml(yamlFormatObj.yamlObj)
    // 修复yaml的ISO日期格式（js-yaml转换的才需要）
    yaml = formatIsoToZhDate(yaml, true)
    // this.logger.debug("yaml=>", yaml)

    yamlFormatObj.formatter = yaml
    yamlFormatObj.mdContent = postForm.formData.mdContent
    yamlFormatObj.mdFullContent = yamlFormatObj.formatter + "\n\n" + yamlFormatObj.mdContent
    yamlFormatObj.htmlContent = postForm.formData.htmlContent

    return yamlFormatObj
  }

  convertToAttr(yamlFormatObj: YamlFormatObj, githubCfg?: IGithubCfg): PostForm {
    const yamlObj = yamlFormatObj.yamlObj

    const postForm = new PostForm()
    postForm.formData.title = yamlObj.title
    postForm.formData.customSlug = yamlObj.permalink
      .replace("/pages/", "")
      .replace("/post/", "")
      .replace(".html", "")
      .replace("/", "")
    postForm.formData.created = formatIsoToZhDate(yamlObj.date.toISOString(), false)

    const yamlMeta = yamlObj.meta
    for (let i = 0; i < yamlMeta.length; i++) {
      const m = yamlMeta[i]
      if (m.name === "description") {
        postForm.formData.desc = m.content
        break
      }
    }

    for (let j = 0; j < yamlObj.tags.length; j++) {
      const tag = yamlObj.tags[j]
      if (!postForm.formData.tag.dynamicTags.includes(tag) && tag !== "") {
        postForm.formData.tag.dynamicTags.push(tag)
      }
    }

    postForm.formData.categories = yamlObj.categories
    return postForm
  }
}
