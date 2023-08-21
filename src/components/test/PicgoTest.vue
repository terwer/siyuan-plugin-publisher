<!--
  - Copyright (c) 2023, Terwer . All rights reserved.
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

<script setup lang="ts">
import { usePicgoBridge } from "~/src/composables/usePicgoBridge.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { getWidgetId } from "~/src/utils/widgetUtils.ts"
import { useRoute } from "vue-router"
import { StrUtil } from "zhi-common"

const logger = createAppLogger("picgo-test")
const { handlePicgo } = usePicgoBridge()
const { query } = useRoute()

// props
const id = (query.id ?? getWidgetId()) as string
const props = defineProps({
  pageId: {
    type: String,
    default: "",
  },
})

const testHandlePicgo = async () => {
  const pageId = StrUtil.isEmptyString(props.pageId) ? id : props.pageId
  const md = await handlePicgo(pageId)
  logger.debug("图片处理完毕, md =>", md)
}
</script>

<template>
  <back-page title="Picgo测试">
    <div id="picgo-test">
      <el-button @click="testHandlePicgo">测试</el-button>
    </div>
  </back-page>
</template>

<style scoped lang="stylus">
#picgo-test
  margin 16px 20px
</style>
