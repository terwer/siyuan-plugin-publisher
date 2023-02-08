<!--
  - Copyright (c) 2022-2023, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<template>
  <AppLayout>
    <div>
      <div v-if="isPublish">
        <PublishIndex />
      </div>
      <div v-else>
        <BlogIndex />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import AppLayout from "~/layouts/AppLayout.vue"
import BlogIndex from "~/components/blog/BlogIndex.vue"
import PublishIndex from "~/components/publish/PublishIndex.vue"
import { onMounted, ref } from "vue"
import { LogFactory } from "~/utils/logUtil"
import {
  getPageId,
  isInSiyuanOrSiyuanNewWin,
  isInSiyuanWidget,
} from "~/utils/platform/siyuan/siyuanUtil"
import { SiYuanApiAdaptor } from "~/utils/platform/siyuan/siYuanApiAdaptor"
import { isInChromeExtension } from "~/utils/browserUtil"
import siyuanBrowserUtil, {
  getSiyuanNewWinPageId,
  isInSiyuanNewWinBrowser,
} from "~/utils/otherlib/siyuanBrowserUtil"

const logger = LogFactory.getLogger("pages/index/App.vue")

const isPublish = ref(false)

const init = async () => {
  logger.warn("MODE=>", import.meta.env.MODE)

  if (isInSiyuanOrSiyuanNewWin()) {
    if (isInSiyuanWidget()) {
      setTimeout(siyuanBrowserUtil.fitTheme, 3500)
    }

    let postid
    if (isInSiyuanNewWinBrowser()) {
      const newWinPageId = getSiyuanNewWinPageId()
      if (newWinPageId) {
        postid = newWinPageId
      }
      logger.warn("思源笔记新窗口，postid为=>", postid)
    } else {
      postid = await getPageId()
    }
    logger.warn("当前页面ID是=>", postid)

    const api = new SiYuanApiAdaptor()
    const result = await api.getSubPostCount(postid)
    logger.debug("子文档个数", result)

    if (result > 1) {
      isPublish.value = false
      logger.warn("检测到子文档，将转到显示列表页面")
    } else {
      isPublish.value = true
      logger.warn("没有子文档显示发布页面")
    }
  } else if (isInChromeExtension()) {
    logger.warn("当前处于Chrome插件中，需要模拟fetch解决CORS跨域问题")
  } else {
    logger.warn("当前处于非挂件模式，已开启请求代理解决CORS跨域问题")
  }
}

// =====================
// life cycle
// =====================
onMounted(async () => {
  await init()
})
</script>
