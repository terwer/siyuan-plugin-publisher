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
import { JsonUtil, ObjectUtil, StrUtil, YamlUtil } from "zhi-common"
import { toRaw } from "vue"

/**
 * Vuepress2 平台的YAML解析器
 *
 * @see {https://vuepress2.io/docs/front-matter front-tmatter}
 * @author terwer
 * @since 0.8.1
 */
class Vuepress2YamlConverterAdaptor extends YamlConvertAdaptor {
  private readonly logger = createAppLogger("vuepress2-yaml-converter-adaptor")

  /**
   * 将文章转换为YAML格式对象
   *
   * @param post - 要转换的文章对象
   * @param yamlFormatObj （可选）
   * @param cfg - 博客配置（可选）
   * @returns 返回YAML格式对象
   */
  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    this.logger.debug("您正在使用 Vuepress2 Yaml Converter", { post: toRaw(post) })
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

    // short_title
    yamlFormatObj.yamlObj.short_title = ""

    // date
    yamlFormatObj.yamlObj.date = post.dateCreated

    // description
    if (!StrUtil.isEmptyString(post.shortDesc)) {
      yamlFormatObj.yamlObj.description = post.shortDesc
    }

    // tag
    if (!StrUtil.isEmptyString(post.mt_keywords)) {
      const tag = post.mt_keywords.split(",")
      yamlFormatObj.yamlObj.tag = tag
    }

    // category
    if (post.categories?.length > 0) {
      yamlFormatObj.yamlObj.category = post.categories
    }

    // 上面是固定配置。下面是个性配置
    const dynYamlCfg = JsonUtil.safeParse<any>(cfg?.dynYamlCfg ?? "{}", {})
    if (ObjectUtil.isEmptyObject(dynYamlCfg)) {
      // article
      yamlFormatObj.yamlObj.article = true

      // timeline
      yamlFormatObj.yamlObj.timeline = false

      // isOriginal
      yamlFormatObj.yamlObj.isOriginal = true
    } else {
      Object.keys(dynYamlCfg).forEach((key) => {
        yamlFormatObj.yamlObj[key] = dynYamlCfg[key]
      })
    }

    // formatter
    const yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    yamlFormatObj.formatter = this.removeTZ(yaml)
    yamlFormatObj.mdContent = post.markdown
    yamlFormatObj.mdFullContent = YamlUtil.addYamlToMd(yamlFormatObj.formatter, yamlFormatObj.mdContent)
    yamlFormatObj.htmlContent = post.html
    this.logger.info("生成默认的YAML")

    return yamlFormatObj
  }

  /**
   * 将文章转换为属性
   *
   * @param post - 要转换的文章对象
   * @param yamlFormatObj - YAML 格式对象
   * @param cfg - 博客配置（可选）
   * @returns 转换后的文章对象
   */
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
        if (yamlFormatObj.yamlObj.date) {
          try {
            post.dateCreated = yamlFormatObj.yamlObj.date
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
        post.shortDesc = yamlFormatObj.yamlObj.description
      } catch (e) {
        this.logger.error("摘要解析失败", e)
      }

      // 标签 - 兼容tag和tags两种格式
      try {
        if (Array.isArray(yamlFormatObj.yamlObj.tags) && yamlFormatObj.yamlObj.tags.length > 0) {
          post.mt_keywords = yamlFormatObj.yamlObj.tags.join(",")
        } else if (Array.isArray(yamlFormatObj.yamlObj.tag) && yamlFormatObj.yamlObj.tag.length > 0) {
          post.mt_keywords = yamlFormatObj.yamlObj.tag.join(",")
        }
      } catch (e) {
        this.logger.error("标签解析失败", e)
      }

      // 分类 - 兼容category和categories两种格式
      try {
        if (Array.isArray(yamlFormatObj.yamlObj.categories) && yamlFormatObj.yamlObj.categories.length > 0) {
          post.categories = yamlFormatObj.yamlObj.categories
        } else if (Array.isArray(yamlFormatObj.yamlObj.category) && yamlFormatObj.yamlObj.category.length > 0) {
          post.categories = yamlFormatObj.yamlObj.category
        }
      } catch (e) {
        this.logger.error("分类解析失败", e)
      }

      // 添加新的YAML
      try {
        const yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)
        post.yaml = this.removeTZ(yaml)
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

  // ================
  // private methods
  // ================
  /**
   * 移除YAML字符串中的时间戳信息（TZ）
   *
   * @param {string} yamlString - 要处理的YAML字符串
   * @returns {string} - 移除了时间戳信息的YAML字符串
   */
  private removeTZ(yamlString: string): string {
    return yamlString.replace(/---([\s\S]*?)---/g, function (match, captureGroup) {
      return match.replace(/T/g, " ").replace(/\.\d{3}Z/g, "")
    })
  }
}

export { Vuepress2YamlConverterAdaptor }
