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
 * Vuepress平台的YAML解析器
 *
 * @see {https://doc.xugaoyi.com/pages/3216b0/ front-tmatter}
 * @author terwer
 * @since 0.8.1
 */
class VuepressYamlConverterAdaptor extends YamlConvertAdaptor {
  private readonly logger = createAppLogger("vuepress-yaml-converter-adaptor")

  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    this.logger.debug("您正在使用 Vuepress Yaml Converter", { post: toRaw(post) })
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

    // meta
    yamlFormatObj.yamlObj.meta = []
    if (!StrUtil.isEmptyString(post.mt_keywords)) {
      yamlFormatObj.yamlObj.meta.push({
        name: "keywords",
        content: post.mt_keywords.split(",").join(" ") || "",
      })
    }
    if (!StrUtil.isEmptyString(post.shortDesc)) {
      yamlFormatObj.yamlObj.meta.push({
        name: "description",
        content: post.shortDesc,
      })
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
      yamlFormatObj.yamlObj.permalink = link
    }

    // author
    const githubCfg = cfg as CommonGithubConfig
    let githubUrl = githubCfg.site
    if (StrUtil.isEmptyString(githubCfg.site)) {
      githubUrl = StrUtil.pathJoin(githubCfg.home, "/" + githubCfg.username)
    }
    yamlFormatObj.yamlObj.author = {
      name: githubCfg.author ?? "terwer",
      link: githubUrl,
    }

    // 日记
    if (post?.title?.includes("[日记]")) {
      yamlFormatObj.yamlObj.article = false
    }

    // 上面是固定配置。下面是个性配置
    const dynYamlCfg = JsonUtil.safeParse<any>(cfg?.dynYamlCfg ?? "{}", {})
    if (!ObjectUtil.isEmptyObject(dynYamlCfg)) {
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

    // 摘要
    const yamlMeta = yamlFormatObj.yamlObj.meta
    for (let i = 0; i < yamlMeta.length; i++) {
      const m = yamlMeta[i]
      if (m.name === "description" && !StrUtil.isEmptyString(m.content)) {
        post.shortDesc = m.content
        break
      }
    }

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

export { VuepressYamlConverterAdaptor }
