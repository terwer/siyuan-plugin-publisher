/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { reactive } from "vue"
import copy from "copy-to-clipboard"
import { ElMessage } from "element-plus"
import { LogFactory } from "~/utils/logUtil"
import { useI18n } from "vue-i18n"
import { YamlConvertAdaptor } from "~/utils/platform/yamlConvertAdaptor"
import { PostForm } from "~/utils/models/postForm"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { appendStr } from "~/utils/strUtil"
import { copyToClipboardInBrowser, isBrowser } from "~/utils/browserUtil"
import { YamlFormatObj } from "~/utils/models/yamlFormatObj"

/**
 * YAML组件
 */
export const useYaml = () => {
  const logger = LogFactory.getLogger("composables/publish/makeYamlCom.ts")
  const { t } = useI18n()
  const yamlData = reactive({
    yamlObj: {} as any,
    readMode: true,
    yamlPreviewContent: "",
    yamlContent: "",
    isSaved: true,
    formatter: "",
    mdContent: "",
    mdFullContent: "",
    htmlContent: "",
  })

  const yamlMethods = {
    /**
     * @param event
     */
    onYamlContentFocus: (event) => {
      event.preventDefault()

      const target = event.target as HTMLTextAreaElement
      target.select()

      if (isBrowser()) {
        copyToClipboardInBrowser(yamlData.yamlContent)
      }
    },

    onYamlContentInput: () => {
      yamlData.isSaved = false
    },

    onYamlContextMenu: (event) => {
      event.preventDefault()
    },

    doConvertAttrToYAML: (
      yamlConverter: YamlConvertAdaptor,
      postForm: PostForm,
      githubCfg?: IGithubCfg
    ): void => {
      if (!yamlConverter) {
        yamlConverter = new YamlConvertAdaptor()
        logger.error("未指定YAML转换器")
      }

      const yamlFormatObj = yamlConverter.convertToYaml(postForm, githubCfg)
      yamlData.yamlObj = yamlFormatObj.yamlObj
      yamlData.formatter = yamlFormatObj.formatter
      yamlData.mdContent = yamlFormatObj.mdContent
      yamlData.mdFullContent =
        yamlFormatObj.formatter + "\n\n" + yamlFormatObj.mdContent
      yamlData.htmlContent = yamlFormatObj.htmlContent
    },

    doConvertYAMLToAttr: (
      yamlConverter: YamlConvertAdaptor,
      yamlFormatObj: YamlFormatObj,
      githubCfg?: IGithubCfg
    ): PostForm => {
      if (!yamlConverter) {
        yamlConverter = new YamlConvertAdaptor()
        logger.error("未指定YAML转换器")
      }

      const postForm = yamlConverter.convertToAttr(yamlFormatObj, githubCfg)
      logger.debug("doConvertYAMLToAttr转换中转数据postForm=>", postForm)

      return postForm
    },

    copyYamlToClipboard: () => {
      copy(yamlData.yamlContent)
      ElMessage.success(t("main.opt.success"))
    },

    /**
     * 提供给其他组件访问数据的方法
     */
    getYamlData: () => {
      return yamlData
    },

    /**
     * 初始化
     * @param yaml
     */
    initYaml: (yaml: string) => {
      yamlData.yamlContent = yaml
      yamlData.yamlPreviewContent = appendStr(yaml)
    },
  }

  return {
    yamlData,
    yamlMethods,
  }
}
