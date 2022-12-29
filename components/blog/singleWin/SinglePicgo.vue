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
  <div id="post-detail-body">
    <el-page-header :icon="ArrowLeft" title="返回" @click="onBack">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3" :title="props.post.title">
            {{ shortTitle }} - Picgo
          </span>
        </div>
      </template>
    </el-page-header>

    <div class="post-detail-content-box">
      <picgo-index :page-id="props.post.postid" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Post } from "~/utils/models/post"
import { getByLength } from "~/utils/strUtil"
import { onMounted, ref } from "vue"
import { getPublishCfg } from "~/utils/publishUtil"
import { parseBoolean } from "~/utils/util"
import { ArrowLeft } from "@element-plus/icons-vue"
import PicgoIndex from "~/components/picgo/PicgoIndex.vue"

const props = defineProps({
  post: {
    type: Post,
    default: new Post(),
  },
})
const emits = defineEmits(["on-change"])

const shortTitle = getByLength(props.post?.title, 18, false)
const isNewWin = ref(true)

const onBack = () => {
  emits("on-change")
}

onMounted(() => {
  const publishCfg = getPublishCfg()
  isNewWin.value = parseBoolean(publishCfg.newWin)
})
</script>

<style scoped>
#post-detail-body {
  min-width: 600px !important;
  margin-top: 20px;
  margin-bottom: 16px;
}

#post-detail-body .btn-publish {
  /*margin-left: 10px;*/
  cursor: pointer;
  padding: 0;
  margin-top: 20px;
}
</style>
