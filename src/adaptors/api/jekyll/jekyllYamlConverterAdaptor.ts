/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "~/src/utils/appLogger.ts"
import { BlogConfig, Post, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { DateUtil, StrUtil, YamlUtil } from "zhi-common"
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { applyDynYamlCfg } from "~/src/adaptors/api/base/dynYamlConfig.ts"
import { formatDateTimeWithOffset, parsePublishedDate } from "~/src/utils/dateUtils.ts"
import { normalizeTagValue, tagValueToKeywords } from "~/src/utils/tagValue.ts"

/**
 * Jekyll平台的YAML解析器
 *
 * @see {https://jekyllrb.com/docs/front-matter/ front-tmatter}
 * @author terwer
 * @since 0.8.1
 */
class JekyllYamlConverterAdaptor extends YamlConvertAdaptor {

  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    // 初始化yamlFormatObj
    if (!yamlFormatObj) {
      yamlFormatObj = new YamlFormatObj()
    } else {
      // 清空原有内容，确保使用最新配置
      yamlFormatObj.yamlObj = {}
    }

    // title
    yamlFormatObj.yamlObj.title = post.title

    // date
    yamlFormatObj.yamlObj.date = formatDateTimeWithOffset(post.dateCreated)

    // permalink
    let link = "/post/" + post.wp_slug + ".html"
    const githubCfg = cfg as CommonGithubConfig
    if (githubCfg.yamlLinkEnabled && !StrUtil.isEmptyString(githubCfg.previewPostUrl)) {
      link = githubCfg.previewPostUrl.replace("[postid]", post.wp_slug)
    }
    yamlFormatObj.yamlObj.permalink = link

    // tagline
    if (!StrUtil.isEmptyString(post.shortDesc)) {
      yamlFormatObj.yamlObj.tagline = post.shortDesc
    }

    // tags
    if (!StrUtil.isEmptyString(post.mt_keywords)) {
      yamlFormatObj.yamlObj.tags = normalizeTagValue(post.mt_keywords)
    }

    // categories
    if (post.categories?.length > 0) {
      yamlFormatObj.yamlObj.categories = post.categories
    }

    // 上面是固定配置。下面是个性配置
    applyDynYamlCfg(yamlFormatObj.yamlObj, cfg?.dynYamlCfg, post, {
      // layout
      layout: "post",
      // published
      published: true,
    })

    // formatter
    let yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    yamlFormatObj.formatter = yaml
    yamlFormatObj.mdContent = post.markdown
    yamlFormatObj.mdFullContent = YamlUtil.addYamlToMd(yamlFormatObj.formatter, yamlFormatObj.mdContent)
    yamlFormatObj.htmlContent = post.html

    return yamlFormatObj
  }

  public convertToAttr(post: Post, yamlFormatObj: YamlFormatObj, cfg?: BlogConfig): Post {

    // 标题
    if (yamlFormatObj.yamlObj?.title) {
      post.title = yamlFormatObj.yamlObj?.title
    }

    // 发布时间
    if (yamlFormatObj.yamlObj?.date) {
      post.dateCreated =
        parsePublishedDate(yamlFormatObj.yamlObj?.date) ?? DateUtil.convertStringToDate(yamlFormatObj.yamlObj?.date)
    }

    // 摘要
    post.shortDesc = yamlFormatObj.yamlObj?.tagline

    // 标签
    post.mt_keywords = tagValueToKeywords(yamlFormatObj.yamlObj?.tags ?? yamlFormatObj.yamlObj?.tag)

    // 分类
    post.categories = yamlFormatObj.yamlObj?.categories

    // 添加新的YAML
    post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    return post
  }
}

export { JekyllYamlConverterAdaptor }
