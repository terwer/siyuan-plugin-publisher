/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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

import { nextTick, reactive, ref } from "vue"
import copy from "copy-to-clipboard"
import { ElMessage } from "element-plus"
import { LogFactory } from "~/utils/logUtil"
import { useI18n } from "vue-i18n"
import { YamlConvertAdaptor } from "~/utils/platform/yamlConvertAdaptor"
import { PostForm } from "~/utils/common/postForm"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"

/**
 * YAML组件
 */
export const useYaml = () => {
  const logger = LogFactory.getLogger("composables/makeSlugCom.ts")
  const { t } = useI18n()
  const yamlData = reactive({
    yamlObj: {},
    yamlContent: "",
    formatter: "",
    mdContent: "",
    mdFullContent: "",
    htmlContent: "",
  })

  const onYamlContentFocus = (event) => {
    const target = event.target as HTMLTextAreaElement
    target.select()
  }

  const doConvertAttrToYAML = (
    yamlConverter: YamlConvertAdaptor,
    postForm: PostForm,
    githubCfg?: IGithubCfg
  ): void => {
    if (!yamlConverter) {
      yamlConverter = new YamlConvertAdaptor()
      logger.error("未指定YAML转换器")
    }

    const yamlObj = yamlConverter.convert(postForm, githubCfg)
    yamlData.formatter = yamlObj.formatter
    yamlData.mdContent = yamlObj.mdContent
    yamlData.mdFullContent = yamlObj.formatter + "\n" + yamlObj.mdContent
    yamlData.htmlContent = yamlObj.htmlContent
  }

  const convertYAMLToAttr = () => {
    // TODO
    throw new Error("Not implemented")
  }

  const fmtRefInput = ref()
  const copyToClipboard = () => {
    // this.$refs.fmtRefInput.focus();
    // document.execCommand('copy');

    nextTick(() => {
      fmtRefInput.value.focus()

      copy(yamlData.yamlContent)

      ElMessage.success(t("main.opt.success"))
    })
  }

  /**
   * 初始化
   * @param yaml
   */
  const initYaml = (yaml: string) => {
    yamlData.yamlContent = yaml
  }

  return {
    yamlData,
    onYamlContentFocus,
    doConvertAttrToYAML,
    convertYAMLToAttr,
    copyToClipboard,
    initYaml,
  }
}
