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

import { BlogConfig, PageTypeEnum, Post, YamlConvertAdaptor } from "zhi-blog-api"
import { Gitlabvuepress2YamlConverterAdaptor } from "~/src/adaptors/api/gitlab-vuepress2/gitlabvuepress2YamlConverterAdaptor.ts"
import { CommonGitlabApiAdaptor } from "~/src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.ts"
import * as _ from "lodash-es"
import { YamlUtil } from "zhi-common"

/**
 * Gitlabvuepress2 API 适配器
 *
 * @author terwer
 * @version 1.3.2
 * @since 0.8.1
 */
class Gitlabvuepress2ApiAdaptor extends CommonGitlabApiAdaptor {
  public override getYamlAdaptor(): YamlConvertAdaptor {
    return new Gitlabvuepress2YamlConverterAdaptor()
  }

  public override async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    // 公共的属性预处理
    const doc = await super.preEditPost(post, id, publishCfg)

    // Vuepress2 自带的处理
    const cfg: BlogConfig = publishCfg?.cfg
    const updatedPost = _.cloneDeep(doc) as Post

    // 自定义处理
    const md = updatedPost.markdown
    this.logger.info("准备处理 Gitlabvuepress2 正文")
    this.logger.debug("md =>", { md: md })
    const yfm = YamlUtil.extractFrontmatter(md, true)
    let updatedMd = YamlUtil.extractMarkdown(md)

    // ======
    // 摘要
    const shortDesc = updatedPost.shortDesc ?? ""
    const descRegex = /(\n{2}<!-- more -->\n{2})/
    if (!descRegex.test(updatedMd)) {
      updatedMd = `${shortDesc}\n\n<!-- more -->\n\n${updatedMd}`
    }
    // ======

    updatedPost.markdown = `${yfm}\n${updatedMd}`
    this.logger.info("Gitlabvuepress2 正文处理完毕")
    this.logger.debug("updatedMd =>", { yfm: yfm, updatedMd: updatedMd })

    // 发布格式
    if (cfg?.pageType == PageTypeEnum.Markdown) {
      updatedPost.description = updatedPost.markdown
    } else {
      updatedPost.description = updatedPost.html
    }

    return updatedPost
  }
}

export { Gitlabvuepress2ApiAdaptor }
