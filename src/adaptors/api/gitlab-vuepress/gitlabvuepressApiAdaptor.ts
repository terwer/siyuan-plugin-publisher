/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogConfig, PageTypeEnum, Post, YamlConvertAdaptor } from "zhi-blog-api"
import { CommonGitlabApiAdaptor } from "~/src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.ts"
import * as _ from "lodash-es"
import { GitlabvuepressYamlConverterAdaptor } from "~/src/adaptors/api/gitlab-vuepress/gitlabvuepressYamlConverterAdaptor.ts"
import { YamlUtil } from "zhi-common"

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

    // Vuepress 自带的处理
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
}

export { GitlabvuepressApiAdaptor }
