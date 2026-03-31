/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { toRaw } from "vue"
import { BlogConfig, Post, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { DateUtil, JsonUtil, ObjectUtil, StrUtil, YamlUtil } from "zhi-common"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * Docsify平台的YAML解析器
 *
 * Docsify 支持 frontmatter 通过 docsify-front-matter 插件
 * YAML 格式: title, description, date
 *
 * @see {https://docsify.js.org/#/ docsify}
 * @author terwer
 * @since 1.40.0
 */
class DocsifyYamlConverterAdaptor extends YamlConvertAdaptor {
  private readonly logger = createAppLogger("docsify-yaml-converter-adaptor")

  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    this.logger.debug("您正在使用 Docsify Yaml Converter", { post: toRaw(post) })
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

      // date - Docsify 使用简单的日期格式
      yamlFormatObj.yamlObj.date = DateUtil.formatIsoToZhDate(post.dateCreated.toISOString(), true)

      // 上面是固定配置。下面是个性配置
      const dynYamlCfg = JsonUtil.safeParse<any>(cfg?.dynYamlCfg ?? "{}", {})
      if (ObjectUtil.isEmptyObject(dynYamlCfg)) {
        // 在这里加入 docsify 的个性配置
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
    post.mt_excerpt = yamlFormatObj.yamlObj?.description

    // 添加新的YAML
    post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    this.logger.debug("转换完成，post =>", post)
    return post
  }
}

export { DocsifyYamlConverterAdaptor }
