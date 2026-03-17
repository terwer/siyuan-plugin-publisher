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
 * Astro平台的YAML解析器
 *
 * @see {https://docs.astro.build/en/guides/markdown/ front-tmatter}
 * @author terwer
 * @since 1.40.0
 */
class AstroYamlConverterAdaptor extends YamlConvertAdaptor {
  private readonly logger = createAppLogger("astro-yaml-converter-adaptor")

  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    this.logger.debug("您正在使用 Astro Yaml Converter", { post: toRaw(post) })
    // 没有的情况默认初始化一个
    if (!yamlFormatObj) {
      yamlFormatObj = new YamlFormatObj()
      // title
      yamlFormatObj.yamlObj.title = post.title

      // description
      if (!StrUtil.isEmptyString(post.mt_excerpt)) {
        yamlFormatObj.yamlObj.description = post.mt_excerpt
      } else {
        yamlFormatObj.yamlObj.description = ""
      }

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
        const tags = post.mt_keywords.split(",")
        yamlFormatObj.yamlObj.tags = tags
      }

      // categories
      if (post.categories?.length > 0) {
        yamlFormatObj.yamlObj.categories = post.categories
      }

      // seo
      if (!StrUtil.isEmptyString(post.mt_keywords)) {
        yamlFormatObj.yamlObj.keywords = post.mt_keywords
      }

      // 上面是固定配置。下面是个性配置
      const dynYamlCfg = JsonUtil.safeParse<any>(cfg?.dynYamlCfg ?? "{}", {})
      if (ObjectUtil.isEmptyObject(dynYamlCfg)) {
        // 在这里加入 astro 的个性配置
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
    if (yamlFormatObj.yamlObj?.pubDate) {
      post.dateCreated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj?.pubDate)
    }

    // 摘要
    post.mt_excerpt = yamlFormatObj.yamlObj?.description

    // 题图
    // 暂不支持

    // 标签
    post.mt_keywords = yamlFormatObj.yamlObj?.tags?.join(",")

    // 分类
    post.categories = yamlFormatObj.yamlObj?.categories

    // 添加新的YAML
    post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    this.logger.debug("转换完成，post =>", post)
    return post
  }
}

export { AstroYamlConverterAdaptor }
