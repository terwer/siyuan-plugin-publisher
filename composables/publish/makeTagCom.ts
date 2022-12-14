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

import { reactive } from "vue"
import { appendStr } from "~/utils/strUtil"
import { ElMessage } from "element-plus"
import { LogFactory } from "~/utils/logUtil"
import { useI18n } from "vue-i18n"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { cutWords, jiebaToHotWords } from "~/utils/util"
import { getPublishCfg } from "~/utils/publishUtil"
import { useSiyuanPage } from "~/composables/publish/siyuanPageCom"
import { SiyuanDataObj } from "~/utils/models/siyuanDataObj"
import { PostForm } from "~/utils/models/postForm"

/**
 * 标签组件
 */
export const useTag = (props) => {
  // private data
  const logger = LogFactory.getLogger("composables/publish/makeTagCom.ts")
  const { t } = useI18n()
  const siyuanApi = new SiYuanApi()
  // public data
  const tagData = reactive({
    isTagLoading: false,
    tagSwitch: false,
    tag: {
      inputValue: "",
      dynamicTags: <string[]>[],
      inputVisible: false,
    },
    // https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
    // https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
    // https://www.helloworld.net/p/2721375043
    // tagRefInput: ref(),
  })

  // deps
  const { siyuanPageMethods } = useSiyuanPage(props)

  // public methods
  const tagMethods = {
    tagHandleClose: (tag: any) => {
      tagData.tag.dynamicTags.splice(tagData.tag.dynamicTags.indexOf(tag), 1)
    },
    tagShowInput: () => {
      tagData.tag.inputVisible = true

      // this.$refs.tagRefInput.focus()
      // nextTick(() => {
      //   tagData.tagRefInput.value.focus()
      // })
    },
    tagHandleInputConfirm: () => {
      if (tagData.tag.inputValue) {
        tagData.tag.dynamicTags.push(tagData.tag.inputValue)
      }
      tagData.tag.inputVisible = false
      tagData.tag.inputValue = ""
    },
    fetchTag: async (hideTip?: any) => {
      try {
        if (!tagData.tagSwitch) {
          ElMessage.warning(t("main.tag.auto.switch.no.tip"))
          return
        }

        tagData.isTagLoading = true

        // 获取最新属性
        const pageId = await siyuanPageMethods.getPageId()

        const data = await siyuanApi.exportMdContent(pageId)
        const md = data.content
        const genTags = await cutWords(md)
        logger.debug("genTags=>", genTags)

        const hotTags = jiebaToHotWords(genTags, 5)
        logger.debug("hotTags=>", hotTags)

        // 如果标签不存在，保存新标签到表单
        for (let i = 0; i < hotTags.length; i++) {
          if (!tagData.tag.dynamicTags.includes(hotTags[i])) {
            tagData.tag.dynamicTags.push(hotTags[i])
          }
        }

        // 保存属性到思源
        const customAttr = {
          tags: tagData.tag.dynamicTags.join(","),
        }
        await siyuanApi.setBlockAttrs(pageId, customAttr)

        if (hideTip !== true) {
          ElMessage.success(t("main.opt.success"))
        }
      } catch (e) {
        const errmsg = appendStr(t("main.opt.failure"), "=>", e)
        if (hideTip !== true) {
          ElMessage.error(errmsg)
        }
        logger.error(errmsg)
      }

      tagData.isTagLoading = false
      if (hideTip !== true) {
        ElMessage.success(t("main.opt.success"))
      }
    },

    getTagData: (): string[] => {
      return tagData.tag.dynamicTags
    },

    /**
     * 初始化
     */
    initTag: (siyuanData: SiyuanDataObj) => {
      const publishCfg = getPublishCfg()

      // 初始化标签
      tagData.tag.dynamicTags = []
      const tagstr = siyuanData.meta.tags || ""
      const tgarr = tagstr.split(",")
      for (let i = 0; i < tgarr.length; i++) {
        const tg = tgarr[i]
        if (tg !== "") {
          tagData.tag.dynamicTags.push(tgarr[i])
        }
      }

      if (publishCfg.autoTag && tagData.tag.dynamicTags.length === 0) {
        tagData.tagSwitch = true
      }
    },

    /**
     * 同步FormData到属性
     * @param postForm
     */
    syncTag: (postForm: PostForm) => {
      for (let i = 0; i < postForm.formData.tag.dynamicTags.length; i++) {
        const tag = postForm.formData.tag.dynamicTags[i]
        if (!tagData.tag.dynamicTags.includes(tag) && tag !== "") {
          tagData.tag.dynamicTags.push(tag)
        }
      }
    },
  }

  return {
    tagData,
    tagMethods,
  }
}
