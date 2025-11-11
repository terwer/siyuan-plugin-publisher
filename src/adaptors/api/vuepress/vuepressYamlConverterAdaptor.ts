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
    // 确保post对象存在
    if (!post) {
      this.logger.error("post对象为空，无法转换为YAML")
      if (!yamlFormatObj) {
        yamlFormatObj = new YamlFormatObj()
      }
      return yamlFormatObj
    }
    
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
    yamlFormatObj.yamlObj.title = post.title || "未命名文章"

    // date
    try {
      yamlFormatObj.yamlObj.date = post.dateCreated ? DateUtil.formatIsoToZh(post.dateCreated.toISOString(), true) : new Date().toISOString()
    } catch (e) {
      this.logger.error("日期格式化失败", e)
      yamlFormatObj.yamlObj.date = new Date().toISOString()
    }

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
      try {
        const tags = post.mt_keywords.split(",")
        yamlFormatObj.yamlObj.tags = tags
      } catch (e) {
        this.logger.error("标签分割失败", e)
        yamlFormatObj.yamlObj.tags = []
      }
    }

    // categories
    if (post.categories && Array.isArray(post.categories) && post.categories.length > 0) {
      yamlFormatObj.yamlObj.categories = post.categories
    }

    // permalink
    if (cfg?.yamlLinkEnabled && post.wp_slug) {
      let link = "/post/" + post.wp_slug + ".html"
      yamlFormatObj.yamlObj.permalink = link
    }

    // author - 添加额外的安全检查
    try {
      if (cfg) {
        const githubCfg = cfg as CommonGithubConfig
        let githubUrl = githubCfg.site || ""
        if (StrUtil.isEmptyString(githubUrl) && githubCfg.home && githubCfg.username) {
          try {
            githubUrl = StrUtil.pathJoin(githubCfg.home, "/" + githubCfg.username)
          } catch (e) {
            this.logger.error("路径拼接失败", e)
            githubUrl = githubCfg.home || ""
          }
        }
        yamlFormatObj.yamlObj.author = {
          name: githubCfg.author ?? "terwer",
          link: githubUrl,
        }
      }
    } catch (e) {
      this.logger.error("作者信息设置失败", e)
    }

    // 日记
    if (post.title && typeof post.title === "string" && post.title.includes("[日记]")) {
      yamlFormatObj.yamlObj.article = false
    }

    // 上面是固定配置。下面是个性配置
    try {
      const dynYamlCfg = JsonUtil.safeParse<any>(cfg?.dynYamlCfg ?? "{}", {})
      if (!ObjectUtil.isEmptyObject(dynYamlCfg)) {
        Object.keys(dynYamlCfg).forEach((key) => {
          yamlFormatObj.yamlObj[key] = dynYamlCfg[key]
        })
      }
    } catch (e) {
      this.logger.error("动态YAML配置解析失败", e)
    }

    // formatter - 添加try-catch保护
    try {
      let yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)
      this.logger.debug("yaml=>", yaml)

      yamlFormatObj.formatter = yaml
      yamlFormatObj.mdContent = post.markdown || ""
      yamlFormatObj.mdFullContent = YamlUtil.addYamlToMd(yamlFormatObj.formatter, yamlFormatObj.mdContent)
      yamlFormatObj.htmlContent = post.html || ""
      this.logger.info("生成默认的YAML")
    } catch (e) {
      this.logger.error("YAML格式化失败", e)
    }

    return yamlFormatObj
  }

  public convertToAttr(post: Post, yamlFormatObj: YamlFormatObj, cfg?: BlogConfig): Post {
    this.logger.debug("开始转换YAML到Post", yamlFormatObj)
    
    // 确保post对象存在
    if (!post) {
      this.logger.error("post对象为空，无法转换YAML属性")
      return new Post()
    }
    
    // 确保yamlFormatObj对象存在
    if (!yamlFormatObj || !yamlFormatObj.yamlObj) {
      this.logger.error("yamlFormatObj对象为空或yamlObj未定义，无法转换YAML属性")
      return post
    }

    try {
      // 标题
      try {
        if (typeof yamlFormatObj.yamlObj.title === "string" && !StrUtil.isEmptyString(yamlFormatObj.yamlObj.title)) {
          post.title = yamlFormatObj.yamlObj.title
        }
      } catch (e) {
        this.logger.error("标题解析失败", e)
      }

      // 发布时间
      try {
        if (!StrUtil.isEmptyString(yamlFormatObj.yamlObj.date)) {
          try {
            post.dateCreated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj.date)
          } catch (e) {
            this.logger.error("日期解析失败", e)
            // 使用当前日期作为后备
            post.dateCreated = new Date()
          }
        }
      } catch (e) {
        this.logger.error("日期字段解析失败", e)
      }

      // 摘要
      try {
        const yamlMeta = yamlFormatObj.yamlObj.meta
        if (Array.isArray(yamlMeta) && yamlMeta.length > 0) {
          for (let i = 0; i < yamlMeta.length; i++) {
            try {
              const m = yamlMeta[i]
              if (m?.name === "description" && typeof m.content === "string" && !StrUtil.isEmptyString(m.content)) {
                post.shortDesc = m.content
                break
              }
            } catch (e) {
              this.logger.error("meta项解析失败", e)
            }
          }
        }
      } catch (e) {
        this.logger.error("摘要解析失败", e)
      }

      // 标签
      try {
        if (Array.isArray(yamlFormatObj.yamlObj.tags) && yamlFormatObj.yamlObj.tags.length > 0) {
          post.mt_keywords = yamlFormatObj.yamlObj.tags.join(",")
        }
      } catch (e) {
        this.logger.error("标签解析失败", e)
      }

      // 分类
      try {
        if (Array.isArray(yamlFormatObj.yamlObj.categories) && yamlFormatObj.yamlObj.categories.length > 0) {
          post.categories = yamlFormatObj.yamlObj.categories
        }
      } catch (e) {
        this.logger.error("分类解析失败", e)
      }

      // 添加新的YAML
      try {
        post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)
      } catch (e) {
        this.logger.error("YAML生成失败", e)
        post.yaml = ""
      }
    } catch (e) {
      this.logger.error("YAML属性转换过程中发生异常", e)
    }

    this.logger.debug("转换完成，post =>", post)
    return post
  }
}

export { VuepressYamlConverterAdaptor }
