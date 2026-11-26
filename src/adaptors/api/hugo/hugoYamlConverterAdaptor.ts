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
import { applyDynYamlCfg } from "~/src/adaptors/api/base/dynYamlConfig.ts"
import { isLeafBundleLayout, resolveHugoBundleUrl } from "~/src/adaptors/api/base/contentLayout.ts"
import { normalizeTagValue, tagValueToKeywords } from "~/src/utils/tagValue.ts"

/**
 * Hugo平台的YAML解析器
 *
 * @see {https://gohugo.io/content-management/front-matter/ front-tmatter}
 * @author terwer
 * @since 0.8.1
 */
class HugoYamlConverterAdaptor extends YamlConvertAdaptor {

  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    // 没有的情况默认初始化一个
    if (!yamlFormatObj) {
      yamlFormatObj = new YamlFormatObj()
      // title
      yamlFormatObj.yamlObj.title = post.title

      // slug
      yamlFormatObj.yamlObj.slug = post.wp_slug

      // url
      // 页面目录（Leaf Bundle）使用目录式地址；单文件保持原有 .html 约定，避免改变既有站点链接。
      if (cfg.yamlLinkEnabled) {
        yamlFormatObj.yamlObj.url = isLeafBundleLayout(cfg as any)
          ? resolveHugoBundleUrl(cfg as any, post.wp_slug)
          : "/post/" + post.wp_slug + ".html"
      }

      // date
      let tzstr = "+00:00"
      const tz = new Date().getTimezoneOffset() / -60
      const sign = tz > 0 ? "+" : "-"
      if (tz.toString().length < 2) {
        tzstr = `${sign}0${tz}:00`
      } else {
        tzstr = `${sign}${tz}:00`
      }
      yamlFormatObj.yamlObj.date = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true) + tzstr

      // lastmod
      if (!post.dateUpdated) {
        post.dateUpdated = new Date()
      }
      yamlFormatObj.yamlObj.lastmod = DateUtil.formatIsoToZh(post.dateUpdated.toISOString(), true) + tzstr

      // tags
      if (!StrUtil.isEmptyString(post.mt_keywords)) {
        yamlFormatObj.yamlObj.tags = normalizeTagValue(post.mt_keywords)
      }

      // categories
      if (post.categories?.length > 0) {
        yamlFormatObj.yamlObj.categories = post.categories
      }

      // seo
      if (!StrUtil.isEmptyString(post.mt_keywords)) {
        yamlFormatObj.yamlObj.keywords = normalizeTagValue(post.mt_keywords).join(",")
      }
      if (!StrUtil.isEmptyString(post.shortDesc)) {
        yamlFormatObj.yamlObj.description = post.shortDesc
      }

      // // linkTitle
      // const linkTitle = post.linkTitle
      // // weight
      // const weight = parseInt(post.weight.toString())
      // if (weight > 0) {
      //   yamlFormatObj.yamlObj.weight = weight
      // }
      // if (!StrUtil.isEmptyString(linkTitle)) {
      //   yamlFormatObj.yamlObj.linkTitle = linkTitle
      //   if (weight > 0) {
      //     yamlFormatObj.yamlObj.menu = {
      //       main: {
      //         weight: weight,
      //       },
      //     }
      //   }
      // }

      // 上面是固定配置。下面是个性配置
      applyDynYamlCfg(yamlFormatObj.yamlObj, cfg?.dynYamlCfg, post, {
        // toc
        toc: true,

        // isCJKLanguage
        isCJKLanguage: true,
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
    if (yamlFormatObj.yamlObj?.lastmod) {
      post.dateUpdated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj?.lastmod)
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

export { HugoYamlConverterAdaptor }
