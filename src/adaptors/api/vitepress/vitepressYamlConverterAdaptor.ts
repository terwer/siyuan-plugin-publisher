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
import { DateUtil, JsonUtil, ObjectUtil, StrUtil, YamlUtil } from "zhi-common"
import { toRaw } from "vue"

/**
 * Vitepress 平台的YAML解析器
 *
 * @see {https://vitepress.dev/guide/frontmatter front-tmatter}
 * @author terwer
 * @since 0.8.1
 */
class VitepressYamlConverterAdaptor extends YamlConvertAdaptor {
  private readonly logger = createAppLogger("vitepress-yaml-converter-adaptor")

  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    this.logger.debug("您正在使用 Vitepress Yaml Converter", { post: toRaw(post) })
    // 没有的情况默认初始化一个
    if (!yamlFormatObj) {
      yamlFormatObj = new YamlFormatObj()

      // title
      yamlFormatObj.yamlObj.title = post.title

      // titleTemplate
      // yamlFormatObj.yamlObj.titleTemplate = post.title

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

      // layout
      // https://vitepress.dev/reference/frontmatter-config#layout
      // yamlFormatObj.yamlObj.layout = "doc"

      // // date
      // yamlFormatObj.yamlObj.date = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true)

      // 上面是固定配置。下面是个性配置
      const dynYamlCfg = JsonUtil.safeParse<any>(cfg?.dynYamlCfg ?? "{}", {})
      if (ObjectUtil.isEmptyObject(dynYamlCfg)) {
        // outline
        yamlFormatObj.yamlObj.outline = "deep"

        // navbar
        // yamlFormatObj.yamlObj.navbar = true

        // sidebar
        yamlFormatObj.yamlObj.sidebar = false

        // prev && next
        yamlFormatObj.yamlObj.prev = false
        yamlFormatObj.yamlObj.next = false

        // lastUpdated
        // yamlFormatObj.yamlObj.lastUpdated= true

        // editLink
        // yamlFormatObj.yamlObj.editLink = true
      } else {
        Object.keys(dynYamlCfg).forEach((key) => {
          yamlFormatObj.yamlObj[key] = dynYamlCfg[key]
        })
      }
    } else {
      this.logger.info("yaml 已保存，不使用预设", { post: toRaw(post) })
    }

    // formatter
    let yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)
    this.logger.debug("yaml=>", yaml)

    yamlFormatObj.formatter = yaml
    yamlFormatObj.mdContent = post.markdown
    yamlFormatObj.mdFullContent = YamlUtil.addYamlToMd(yamlFormatObj.formatter, yamlFormatObj.mdContent)
    yamlFormatObj.htmlContent = post.html
    this.logger.info("生成默认的YAML")

    return yamlFormatObj
  }

  public convertToAttr(post: Post, yamlFormatObj: YamlFormatObj, cfg?: BlogConfig): Post {
    this.logger.debug("开始转换YAML到Post", yamlFormatObj)

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

    this.logger.debug("转换完成，post =>", post)
    return post
  }
}

export { VitepressYamlConverterAdaptor }
