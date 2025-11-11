<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
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
