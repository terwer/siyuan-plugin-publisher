/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogConfig, Post, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { YamlUtil } from "zhi-common"

class LocalSystemYamlConvertAdaptor extends YamlConvertAdaptor {
  constructor(cfg: LocalSystemConfig) {
    super()
  }

  convertToYaml(post: Post, yamlFormatObj?: YamlFormatObj, cfg?: BlogConfig): YamlFormatObj {
    const localFsCfg = cfg as LocalSystemConfig
    if (!yamlFormatObj) {
      yamlFormatObj = new YamlFormatObj()
      yamlFormatObj = new YamlFormatObj()
      // title
      yamlFormatObj.yamlObj.title = post.title
    }
    // formatter
    let yaml = YamlUtil.obj2Yaml(yamlFormatObj.yamlObj)
    yamlFormatObj.formatter = yaml
    yamlFormatObj.mdContent = post.markdown
    yamlFormatObj.mdFullContent = YamlUtil.addYamlToMd(yamlFormatObj.formatter, yamlFormatObj.mdContent)
    yamlFormatObj.htmlContent = post.html
    return yamlFormatObj
  }

  convertToAttr(post: Post, yamlFormatObj: YamlFormatObj, cfg?: BlogConfig): Post {
    return post
  }
}

export { LocalSystemYamlConvertAdaptor }
