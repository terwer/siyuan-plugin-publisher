<!--
  - Copyright (c) 2022, Terwer . All rights reserved.
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
  <div class="post-detail-content-box">
    <div class="btn-publish">
      <el-button size="small" type="primary" @click="handlePublish"
        >发布到其他平台
      </el-button>
    </div>

    <!-- 文章详情 -->
    <PostDetailService :page-id="pid" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { getPageId, getWidgetId } from "~/utils/platform/siyuan/siyuanUtil"
import { goToPage } from "~/utils/otherlib/ChromeUtil"
import { appandStr } from "~/utils/strUtil"
import PostDetailService from "~/components/detail/PostDetailService.vue"

const props = defineProps({
  pageId: {
    type: String,
    default: undefined,
  },
})

const pid = ref("")

const handlePublish = async () => {
  const widgetResult = getWidgetId()
  if (widgetResult.isInSiyuan) {
    goToPage(appandStr("/index.html?id=", pid.value))
  } else {
    goToPage(appandStr("/publish/index.html?id=", pid.value))
  }
}

const initPage = async () => {
  const pageId = await getPageId(true, props.pageId)
  if (!pageId || pageId === "") {
    return
  }
  pid.value = pageId
}

onMounted(async () => {
  await initPage()
})
</script>

<style>
#dt-tool .el-form-item__label {
  width: unset !important;
}
</style>
<style scoped>
.post-detail-content-box {
  padding: 10px;
}

.post-detail-content-box .btn-publish {
  /*margin-left: 10px;*/
  cursor: pointer;
  padding: 10px 10px 0 0;
}
</style>
