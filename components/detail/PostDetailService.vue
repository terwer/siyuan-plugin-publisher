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
  <div class="post-detail-wrap">
    <h1 v-if="inSiyuanNewWin" style="display: none">{{ post.title }}</h1>
    <blockquote class="post-detail-id">
      <span class="id-text">本文ID：{{ post.postid }}</span>
      <el-button size="small" type="warning" @click="handleCopyID"
        >{{ $t("post.detail.button.copy.id") }}
      </el-button>
      <el-button size="small" type="primary" @click="handleShareLink"
        >{{ $t("post.detail.button.share.link") }}
      </el-button>
      <el-button size="small" type="danger" @click="handleOpenInBrowser"
        >{{ $t("post.detail.button.browser.open") }}
      </el-button>
    </blockquote>
    <div
      id="post-detail-content"
      v-beauty
      v-highlight
      v-html="post.description"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { Post } from "~/utils/models/post"
import { onMounted, ref, watch } from "vue"
import { API } from "~/utils/api"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { LogFactory } from "~/utils/logUtil"
import { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil"
import { copyToClipboardInBrowser, isBrowser } from "~/utils/browserUtil"
import { getPageUrl, goToPage } from "~/utils/otherlib/ChromeUtil"

const logger = LogFactory.getLogger(
  "components/blog/themes/default/PostDetailService.vue"
)

const props = defineProps({
  pageId: {
    type: String,
    default: undefined,
  },
})

const inSiyuanNewWin = ref(isInSiyuanNewWinBrowser())

/* 监听props */
watch(
  () => props.pageId,
  (oldValue, newValue) => {
    initPage()
    logger.debug("文章详情查看初始化")
  }
)

const defaultPost = new Post()
const post = ref(defaultPost)

const handleCopyID = () => {
  if (isBrowser()) {
    copyToClipboardInBrowser(post.value.postid)
  }
}

const handleShareLink = () => {
  if (isBrowser()) {
    const pageId = post.value.postid
    const pageUrl = "/detail/index.html?id=" + pageId
    const url = getPageUrl(pageUrl)

    copyToClipboardInBrowser(url)
  }
}

const handleOpenInBrowser = () => {
  const pageId = post.value.postid
  goToPage("/detail/index.html?id=" + pageId)
}

const initPage = async () => {
  if (!props.pageId || props.pageId === "") {
    return
  }

  const api = new API(API_TYPE_CONSTANTS.API_TYPE_SIYUAN)
  const siyuanPost = await api.getPost(props.pageId || "")
  post.value = siyuanPost
}

onMounted(async () => {
  await initPage()
})
</script>

<style>
/* 预览样式 */
#post-detail-content {
  font-size: 14px;
  padding: 10px 0;
  min-height: 600px;
}

#post-detail-content img {
  max-width: 99%;
}

#post-detail-content ol,
#post-detail-content ul {
  padding-inline-start: 24px;
}

#post-detail-content ol li,
#post-detail-content ul li {
  /*padding: 5px 0;*/
}

#post-detail-content blockquote {
  display: block;
  border: solid 1px green;
  border-radius: 4px;
  padding: 0 10px;
  margin: 16px 0 0;
  background: var(--custom-app-bg-color);
}

#post-detail-content mjx-container[jax="SVG"][display="true"] {
  text-align: left;
}

.post-detail-wrap h1,
h2 {
  margin: 0;
  padding: 0;
}

.post-detail-wrap h1 {
  margin-top: 16px;
}

.post-detail-wrap .post-detail-id {
  display: block;
  border: solid 1px green;
  border-radius: 4px;
  padding: 10px;
  background: var(--custom-app-bg-color);
  margin: 16px 0 0;
}

.id-text {
  margin-right: 16px;
  vertical-align: middle;
}
</style>
<style scoped></style>
