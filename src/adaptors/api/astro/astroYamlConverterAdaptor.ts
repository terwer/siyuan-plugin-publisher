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
import { normalizeTagValue, tagValueToKeywords } from "~/src/utils/tagValue.ts"

/**
 * Astro平台的YAML解析器
 *
 * @see {https://docs.astro.build/en/guides/markdown/ front-tmatter}
 * @author terwer
 * @since 1.40.0
 */
class AstroYamlConverterAdaptor extends YamlConvertAdaptor {

  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    // 没有的情况默认初始化一个
    if (!yamlFormatObj) {
      yamlFormatObj = new YamlFormatObj()
      // title
      yamlFormatObj.yamlObj.title = post.title

      // description（表单绑定 shortDesc，发布前 BaseExtendApi 会同步到 mt_excerpt）
      yamlFormatObj.yamlObj.description = post.shortDesc || post.mt_excerpt || ""

      // pubDate
      // let tzstr = "+00:00"
      // const tz = new Date().getTimezoneOffset() / -60
      // const sign = tz > 0 ? "+" : "-"
      // if (tz.toString().length < 2) {
      //   tzstr = `${sign}0${tz}:00`
      // } else {
      //   tzstr = `${sign}${tz}:00`
      // }
      // yamlFormatObj.yamlObj.pubDate = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true) + tzstr
      // 精简格式：yyyy-MM-dd
      yamlFormatObj.yamlObj.pubDate = DateUtil.formatIsoToZhDate(post.dateCreated.toISOString(), true)

      // heroImage
      // 暂不支持

      // draft
      // yamlFormatObj.yamlObj.draft = false

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

      // 上面是固定配置。下面是个性配置
      applyDynYamlCfg(yamlFormatObj.yamlObj, cfg?.dynYamlCfg, post)
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
    if (yamlFormatObj.yamlObj?.pubDate) {
      post.dateCreated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj?.pubDate)
    }

    // 摘要：表单绑定 shortDesc，必须同时回填两个字段
    const description = yamlFormatObj.yamlObj?.description
    if (typeof description === "string" && description.trim() !== "") {
      post.shortDesc = description
      post.mt_excerpt = description
    }

    // 题图
    // 暂不支持

    // 标签：兼容数组、字符串、单数 tag 与空值
    post.mt_keywords = tagValueToKeywords(yamlFormatObj.yamlObj?.tags ?? yamlFormatObj.yamlObj?.tag)

    // 分类
    post.categories = yamlFormatObj.yamlObj?.categories

    // 添加新的YAML
    post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    return post
  }
}

export { AstroYamlConverterAdaptor }
