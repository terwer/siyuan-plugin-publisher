<!--
  - Copyright (c) 2022, Terwer . All rights reserved.
  -  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  -  This code is free software; you can redistribute it and/or modify it
  -  under the terms of the GNU General Public License version 2 only, as
  -  published by the Free Software Foundation.  Terwer designates this
  -  particular file as subject to the "Classpath" exception as provided
  -  by Terwer in the LICENSE file that accompanied this code.
  -
  -  This code is distributed in the hope that it will be useful, but WITHOUT
  -  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  -  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  -  version 2 for more details (a copy is included in the LICENSE file that
  -  accompanied this code).
  -
  -  You should have received a copy of the GNU General Public License version
  -  2 along with this work; if not, write to the Free Software Foundation,
  -  Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  -  Please contact Terwer, Shenzhen, Guangdong, 518000 China
  -  or visit www.terwer.space if you need additional information or have any
  -  questions.
  -->

<template>
  <div id="post-detail-content" v-highlight v-html="post.description"></div>
</template>

<script lang="ts" setup>
import { Post } from "~/utils/common/post"
import { onMounted, ref, watch } from "vue"
import { API } from "~/utils/api"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import logUtil from "~/utils/logUtil"

const props = defineProps({
  pageId: {
    type: String,
    default: undefined,
  },
})

/* 监听props */
watch(
  () => props.pageId,
  /**/ (oldValue, newValue) => {
    // Here you can add you functionality
    // as described in the name you will get old and new value of watched property
    // 默认选中vuepress
    // setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
    initPage()
    logUtil.logInfo("文章详情查看初始化")
  }
)

const defaultPost = new Post()
const post = ref(defaultPost)

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

<script lang="ts">
export default {
  name: "DefaultPostDetailService",
}
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
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 4px;
  margin-inline-end: 24px;
  border: solid 1px green;
  border-radius: 4px;
  padding: 0 10px;
  background: var(--custom-app-bg-color);
}

#post-detail-content mjx-container[jax="SVG"][display="true"] {
  text-align: left;
}
</style>
<style scoped></style>
