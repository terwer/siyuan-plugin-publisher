/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogConfig, Post, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { DateUtil, StrUtil, YamlUtil } from "zhi-common"
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { applyDynYamlCfg } from "~/src/adaptors/api/base/dynYamlConfig.ts"
import { normalizeTagValue, tagValueToKeywords } from "~/src/utils/tagValue.ts"

/**
 * Quartz平台的YAML解析器
 *
 * @see {https://quartz.jzhao.xyz/configuration#frontmatter-configuration front-matter}
 * @author terwer
 * @since 0.8.1
 */
class QuartzYamlConverterAdaptor extends YamlConvertAdaptor {

  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    // 没有的情况默认初始化一个
    if (!yamlFormatObj) {
      yamlFormatObj = new YamlFormatObj()
      // title
      yamlFormatObj.yamlObj.title = post.title

      // date
      yamlFormatObj.yamlObj.date = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true)

      // updated
      if (!post.dateUpdated) {
        post.dateUpdated = new Date()
      }
      yamlFormatObj.yamlObj.updated = DateUtil.formatIsoToZh(post.dateUpdated.toISOString(), true)

      // excerpt
      if (!StrUtil.isEmptyString(post.shortDesc)) {
        yamlFormatObj.yamlObj.description = post.shortDesc
      }

      // tags
      if (!StrUtil.isEmptyString(post.mt_keywords)) {
        yamlFormatObj.yamlObj.tags = normalizeTagValue(post.mt_keywords)
      }

      // categories
      if (post.categories?.length > 0) {
        yamlFormatObj.yamlObj.categories = post.categories
      }

      // permalink
      if (cfg.yamlLinkEnabled) {
        // 发布链路上的 cfg 是从设置反序列化得到的普通对象（不是配置类实例），
        // 用 instanceof 判断平台会在发布时恒为 false，导致自定义预览规则被静默忽略（issue #2054）
        const githubCfg = cfg as CommonGithubConfig
        let link = "/post/" + post.wp_slug + ".html"
        if (!StrUtil.isEmptyString(githubCfg?.previewPostUrl)) {
          link = githubCfg.previewPostUrl.replace("[postid]", post.wp_slug)
          const created = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true)
          const datearr = created.split(" ")[0]
          const numarr = datearr.split("-")
          const y = numarr[0]
          const m = numarr[1]
          const d = numarr[2]
          link = link.replace(/\[yyyy]/g, y)
          link = link.replace(/\[MM]/g, m)
          link = link.replace(/\[mm]/g, m)
          link = link.replace(/\[dd]/g, d)

          if (yamlFormatObj.yamlObj.categories?.length > 0) {
            link = link.replace(/\[cats]/, yamlFormatObj.yamlObj.categories.join("/"))
          } else {
            link = link.replace(/\/\[cats]/, "")
          }
        }
        yamlFormatObj.yamlObj.permalink = link
      }

      // 上面是固定配置。下面是个性配置
      applyDynYamlCfg(yamlFormatObj.yamlObj, cfg?.dynYamlCfg, post, {
        // Quartz 特定配置
        enableToc: true,
        enableBackLinks: true,
      })
    } else {
    }

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
      post.dateCreated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj?.date)
    }
    if (yamlFormatObj.yamlObj?.updated) {
      post.dateUpdated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj?.updated)
    }

    // 摘要
    post.shortDesc = yamlFormatObj.yamlObj?.description

    // 标签
    post.mt_keywords = tagValueToKeywords(yamlFormatObj.yamlObj?.tags ?? yamlFormatObj.yamlObj?.tag)

    // 分类
    post.categories = yamlFormatObj.yamlObj?.categories

    // 添加新的YAML
    post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    return post
  }
}

export { QuartzYamlConverterAdaptor }
