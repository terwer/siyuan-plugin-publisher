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

/**
 * Vitepress 平台的YAML解析器
 *
 * @see {https://vitepress.dev/guide/frontmatter front-tmatter}
 * @author terwer
 * @since 0.8.1
 */
class VitepressYamlConverterAdaptor extends YamlConvertAdaptor {

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

    // description
    if (!StrUtil.isEmptyString(post.shortDesc)) {
      yamlFormatObj.yamlObj.description = post.shortDesc
    }

    // date
    yamlFormatObj.yamlObj.date = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true)

    // head
    yamlFormatObj.yamlObj.head = []
    if (!StrUtil.isEmptyString(post.mt_keywords)) {
      yamlFormatObj.yamlObj.head.push({
        name: "keywords",
        content: post.mt_keywords.split(",").join(" "),
      })
    }
    if (!StrUtil.isEmptyString(post.shortDesc)) {
      yamlFormatObj.yamlObj.head.push({
        name: "description",
        content: post.shortDesc,
      })
    }

    // categories
    if (post.categories?.length > 0) {
      yamlFormatObj.yamlObj.categories = post.categories
    }

    // 上面是固定配置。下面是个性配置
    applyDynYamlCfg(yamlFormatObj.yamlObj, cfg?.dynYamlCfg, post, {
      // outline
      outline: "deep",

      // sidebar
      sidebar: false,

      // prev && next
      prev: false,
      next: false,
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
      post.dateCreated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj?.date)
    }

    // 摘要
    if (yamlFormatObj.yamlObj?.description) {
      post.shortDesc = yamlFormatObj.yamlObj.description
    }

    // 标签
    const head = yamlFormatObj.yamlObj?.head
    if (head && head.length > 0) {
      for (let i = 0; i < head.length; i++) {
        const m = head[i]
        if (m?.name === "keywords" && !StrUtil.isEmptyString(m.content)) {
          post.mt_keywords = m.content?.split(" ").join(",")
          break
        }
      }
    }

    // 分类
    post.categories = yamlFormatObj.yamlObj?.categories

    // 添加新的YAML
    post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    return post
  }
}

export { VitepressYamlConverterAdaptor }
