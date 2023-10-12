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
import { CommonGitlabApiAdaptor } from "~/src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.ts"
import _ from "lodash"
import { GitlabvuepressYamlConverterAdaptor } from "~/src/adaptors/api/gitlab-vuepress/gitlabvuepressYamlConverterAdaptor.ts"
import { YamlUtil } from "zhi-common"
import { SiyuanDevice } from "zhi-device"

/**
 * Hexo API 适配器
 *
 * @author terwer
 * @version 1.3.2
 * @since 0.8.1
 */
class GitlabvuepressApiAdaptor extends CommonGitlabApiAdaptor {
  public override getYamlAdaptor(): YamlConvertAdaptor {
    return new GitlabvuepressYamlConverterAdaptor()
  }

  public override async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    // 公共的属性预处理
    const doc = await super.preEditPost(post, id, publishCfg)

    // HEXO 自带的处理
    const cfg: BlogConfig = publishCfg?.cfg
    const updatedPost = _.cloneDeep(doc) as Post

    // 自定义处理
    const md = updatedPost.markdown
    this.logger.info("准备处理 Gitlabvuepress 正文")
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

    // ======
    // 自动推测保存路径
    const selectedPath = updatedPost.cate_slugs?.[0] ?? cfg.blogid
    if ("docs" === selectedPath) {
      const doc = await this.baseExtendApi.kernelApi.getDoc(id)
      const docPath = doc.path
      const saveFile = await this.autoMapPublishDir(docPath)
      updatedPost.cate_slugs = [saveFile]
    }
    // 自动生成一级目录
    // ======

    updatedPost.markdown = `${yfm}\n${updatedMd}`
    this.logger.info("Gitlabvuepress 正文处理完毕")
    this.logger.debug("updatedMd =>", { yfm: yfm, updatedMd: updatedMd })

    // 发布格式
    if (cfg?.pageType == PageTypeEnum.Markdown) {
      updatedPost.description = updatedPost.markdown
    } else {
      updatedPost.description = updatedPost.html
    }

    return updatedPost
  }

  // ================
  // private methods
  // ================
  private async autoMapPublishDir(docPath: string) {
    this.logger.info("start autoMapPublishDir, docPath =>", docPath)

    const win = SiyuanDevice.siyuanWindow()
    const path = win.require("path")
    const paths = docPath
      .replace(/\.sy/, "")
      .split("/")
      .filter((x: string) => x !== "")

    let save_dir: string
    let save_file: string
    const dir_arr = []
    for (const item of paths) {
      const attrs = await this.baseExtendApi.kernelApi.getBlockAttrs(item)
      dir_arr.push(attrs.title)
    }
    const toDir = path.join("docs", ...dir_arr)
    const toFile = toDir + ".md"
    save_dir = path.dirname(toFile)
    save_file = toFile
    this.logger.info("finished autoMapPublishDir, save_dir =>", save_dir)
    this.logger.info("finished autoMapPublishDir, save_file =>", save_file)

    // 生成一级目录
    // 暂时不做

    // 注意：这里不包括文件名
    return save_dir
  }
}

export { GitlabvuepressApiAdaptor }
