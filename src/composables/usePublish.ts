/*
 * Copyright (c) 2023, Terwer . All rights reserved.
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

import { createAppLogger } from "~/src/utils/appLogger.ts"
import { reactive } from "vue"
import { SypConfig } from "~/syp.config.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { AppInstance } from "~/src/appInstance.ts"
import Adaptors from "~/src/adaptors"
import { Utils } from "~/src/utils/utils.ts"
import { Post } from "zhi-blog-api"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { pre } from "~/src/utils/import/pre.ts"

/**
 * 通用发布组件
 */
const usePublish = () => {
  const logger = createAppLogger("use-publish")

  // uses
  const { t } = useVueI18n()
  const { getSetting, updateSetting } = useSettingStore()
  const { kernelApi } = useSiyuanApi()

  // datas
  const singleFormData = reactive({
    isPublishLoading: false,
    publishProcessStatus: false,
    errMsg: "",

    setting: {} as typeof SypConfig,
    cfg: {} as any,
    isAdd: true,
    postid: "",
    previewUrl: "",
  })

  const doSinglePublish = async (key: string, id: string, doc: Post) => {
    try {
      // 加载配置
      singleFormData.setting = await getSetting()
      singleFormData.cfg = JsonUtil.safeParse<any>(singleFormData.setting[key], {} as any)

      // 系统内置
      const isSys = pre.systemCfg.some((item) => item.platformKey === key)
      logger.info("isSys=>", isSys)

      // 初始化API
      const appInstance = new AppInstance()
      const apiAdaptor = await Adaptors.getAdaptor(key)
      const api = Utils.blogApi(appInstance, apiAdaptor)
      logger.info("api=>", api)

      // 检测是否发布
      const posidKey = singleFormData.cfg.posidKey
      if (StrUtil.isEmptyString(posidKey)) {
        throw new Error("配置错误，posidKey不能为空，请检查配置")
      }
      const postMeta = singleFormData.setting[id] ?? {}
      singleFormData.postid = postMeta[posidKey] ?? ""
      singleFormData.isAdd = StrUtil.isEmptyString(singleFormData.postid)

      if (!singleFormData.isAdd || isSys) {
        logger.info("文章已发布，准备更新")
        const post = new Post()
        post.title = doc.title
        post.description = doc.description
        // result 正常情况下就是 postid
        const result = await api.editPost(singleFormData.postid, post)
        logger.info("edit post=>", result)
      } else {
        logger.info("文章未发布，准备发布")
        const post = new Post()
        post.title = doc.title
        post.description = doc.description
        // result 正常情况下就是 postid
        const result = await api.newPost(post)

        // 写入postid到配置
        singleFormData.postid = result
        postMeta[posidKey] = singleFormData.postid
        singleFormData.setting[id] = postMeta
        await updateSetting(singleFormData.setting)
        logger.info("new post=>", result)
      }
      const previewUrl = await api.getPreviewUrl(singleFormData.postid)
      singleFormData.previewUrl = `${singleFormData.cfg.home}${previewUrl}`

      singleFormData.publishProcessStatus = true
    } catch (e) {
      singleFormData.errMsg = t("main.opt.failure") + "=>" + e
      logger.error(e)
      // ElMessage.error(singleFormData.errMsg)
      await kernelApi.pushErrMsg({
        msg: singleFormData.errMsg,
        timeout: 7000,
      })
      singleFormData.publishProcessStatus = false
    }

    return {
      key: key,
      status: singleFormData.publishProcessStatus,
      name: singleFormData.cfg?.blogName,
      previewUrl: singleFormData.previewUrl,
      errMsg: singleFormData.errMsg,
    }
  }

  return {
    singleFormData,
    doSinglePublish,
  }
}

export { usePublish }
