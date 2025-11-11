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
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { toRaw } from "vue"

/**
 * Hexo平台的YAML解析器
 *
 * @see {https://hexo.io/docs/front-matter front-tmatter}
 * @author terwer
 * @since 0.8.1
 */
class HexoYamlConverterAdaptor extends YamlConvertAdaptor {
  private readonly logger = createAppLogger("hexo-yaml-converter-adaptor")

  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    this.logger.debug("您正在使用 Hexo Yaml Converter", { post: toRaw(post) })
    // 初始化yamlFormatObj
    if (!yamlFormatObj) {
      yamlFormatObj = new YamlFormatObj()
    } else {
      this.logger.info("yaml 已存在，根据最新配置更新", { post: toRaw(post) })
      // 清空原有内容，确保使用最新配置
      yamlFormatObj.yamlObj = {}
    }

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
      yamlFormatObj.yamlObj.excerpt = post.shortDesc
    }

    // tags
    if (!StrUtil.isEmptyString(post.mt_keywords)) {
      const tags = post.mt_keywords.split(",")
      yamlFormatObj.yamlObj.tags = tags
    }

    // categories
    if (post.categories?.length > 0) {
      yamlFormatObj.yamlObj.categories = post.categories
    }

    // permalink
    if (cfg.yamlLinkEnabled) {
      let link = "/post/" + post.wp_slug + ".html"
      if (cfg instanceof CommonGithubConfig) {
        const githubCfg = cfg as CommonGithubConfig
        if (!StrUtil.isEmptyString(cfg.previewPostUrl)) {
          link = githubCfg.previewPostUrl.replace("[postid]", post.wp_slug)
          const created = DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true)
          const datearr = created.split(" ")[0]
          const numarr = datearr.split("-")
          this.logger.debug("created numarr=>", numarr)
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
      }
      yamlFormatObj.yamlObj.permalink = link
    }

    // 上面是固定配置。下面是个性配置
    const dynYamlCfg = JsonUtil.safeParse<any>(cfg?.dynYamlCfg ?? "{}", {})
    if (ObjectUtil.isEmptyObject(dynYamlCfg)) {
      // comments
      yamlFormatObj.yamlObj.comments = true

      // toc
      yamlFormatObj.yamlObj.toc = true
    } else {
      Object.keys(dynYamlCfg).forEach((key) => {
        yamlFormatObj.yamlObj[key] = dynYamlCfg[key]
      })
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
    if (yamlFormatObj.yamlObj?.updated) {
      post.dateUpdated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj?.updated)
    }

    // 摘要
    post.shortDesc = yamlFormatObj.yamlObj?.excerpt

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

export { HexoYamlConverterAdaptor }
