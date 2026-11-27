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
import { GitlabhugoYamlConverterAdaptor } from "~/src/adaptors/api/gitlab-hugo/gitlabhugoYamlConverterAdaptor.ts"
import { isLeafBundleLayout, resolvePostMdFilename } from "~/src/adaptors/api/base/contentLayout.ts"
import { YamlUtil } from "zhi-common"

/**
 * Hugo API 适配器
 *
 * @author terwer
 * @version 1.14.0
 * @since 1.14.0
 */
class GitlabhugoApiAdaptor extends CommonGitlabApiAdaptor {
  public override getYamlAdaptor(): YamlConvertAdaptor {
    return new GitlabhugoYamlConverterAdaptor()
  }

  public override async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    // 页面目录模式要在图片处理前确定目录名；mdFilenameRule 缺失时用 slug 兜底，
    // 保证 newMediaObject() 与 newPost() 推导出同一个目录。
    const cfg: BlogConfig = publishCfg?.cfg
    if (isLeafBundleLayout(cfg as any) && !post.mdFilename) {
      post = _.cloneDeep(post)
      post.mdFilename = resolvePostMdFilename(post)
    }

    // 公共的属性预处理
    const doc = await super.preEditPost(post, id, publishCfg)

    // HUGO 自带的处理
    const updatedPost = _.cloneDeep(doc) as Post

    // 自定义处理
    const md = updatedPost.markdown
    const yfm = YamlUtil.extractFrontmatter(md, true)
    let updatedMd = YamlUtil.extractMarkdown(md)

    // ======
    // 可修改 updatedMd
    // ======

    updatedPost.markdown = `${yfm}\n${updatedMd}`

    // 发布格式
    if (cfg?.pageType == PageTypeEnum.Markdown) {
      updatedPost.description = updatedPost.markdown
    } else {
      updatedPost.description = updatedPost.html
    }

    return updatedPost
  }
}

export { GitlabhugoApiAdaptor }
