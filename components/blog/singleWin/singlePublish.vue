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
  <div id="publish-body">
    <el-page-header
      class="publish-header"
      :icon="ArrowLeft"
      title="返回"
      @click="onBack"
    >
      <template #content>
        <div class="flex items-center">
          <span
            class="text-large font-600 mr-3"
            :title="props.publishData.title"
          >
            {{ shortTitle }} - 文章发布
          </span>
        </div>
      </template>
    </el-page-header>

    <publish-service :page-id="props.publishData.postid" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft } from "@element-plus/icons-vue"
import PublishService from "~/components/publish/PublishService.vue"
import { Post } from "~/utils/models/post"
import { getByLength } from "~/utils/strUtil"

const props = defineProps({
  publishData: {
    type: Post,
    default: new Post(),
  },
})

const shortTitle = getByLength(props.publishData.title, 18, false)

const emits = defineEmits(["on-change"]) // 语法糖
const onBack = () => {
  emits("on-change")
}
</script>

<style scoped>
#publish-body {
  min-width: 600px !important;
  margin-top: 20px;
}

.publish-header {
  margin-bottom: 16px;
}
</style>
