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

  public convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
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
    if (yamlFormatObj.yamlObj?.date) {
      post.dateCreated = DateUtil.convertStringToDate(yamlFormatObj.yamlObj?.date)
    }

    // 摘要
    post.mt_excerpt = yamlFormatObj.yamlObj?.description

    // 添加新的YAML
    post.yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)

    return post
  }
}

export { DocsifyYamlConverterAdaptor }
