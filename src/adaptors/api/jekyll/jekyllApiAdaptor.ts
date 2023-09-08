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

import { CommonGithubApiAdaptor } from "~/src/adaptors/api/base/github/commonGithubApiAdaptor.ts"
import { BlogConfig, PageTypeEnum, Post, YamlConvertAdaptor } from "zhi-blog-api"
import _ from "lodash"
import { JekyllYamlConverterAdaptor } from "~/src/adaptors/api/jekyll/jekyllYamlConverterAdaptor.ts"

/**
 * Jekyll API 适配器
 *
 * @author terwer
 * @version 1.14.0
 * @since 1.14.0
 */
class JekyllApiAdaptor extends CommonGithubApiAdaptor {
  public override getYamlAdaptor(): YamlConvertAdaptor {
    return new JekyllYamlConverterAdaptor()
  }

  public override async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    // 公共的属性预处理
    const doc = await super.preEditPost(post, id, publishCfg)

    // HEXO 自带的处理
    const cfg: BlogConfig = publishCfg?.cfg
    const updatedPost = _.cloneDeep(doc) as Post

    // 自定义处理
    // 信息、警告、错误
    const md = updatedPost.markdown
    this.logger.info("准备处理 Jekyll 正文")
    this.logger.debug("md =>", { md: md })
    let updatedMd = md
    // MD暂时无法处理标记，先搁置
    // 处理MD
    updatedPost.markdown = updatedMd
    this.logger.info("Jekyll 正文处理完毕")
    this.logger.debug("updatedMd =>", { updatedMd: updatedMd })

    // 发布格式
    if (cfg?.pageType == PageTypeEnum.Markdown) {
      post.description = post.markdown
    } else {
      post.description = post.html
    }
    return updatedPost
  }
}

export { JekyllApiAdaptor }
