<template>
  <div>
    <publish-service :page-id="undefined" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import logUtil from "../../utils/logUtil"
import PublishService from "../../components/publish/PublishService.vue"
import { isInChromeExtension } from "~/utils/browser/ChromeUtil"
import { getWidgetId } from "~/utils/platform/siyuan/siyuanUtil"

onMounted(async () => {
  logUtil.logWarn("MODE=>", import.meta.env.MODE)

  const widgetResult = getWidgetId()
  if (widgetResult.isInSiyuan) {
    logUtil.logWarn("当前页面ID是=>", widgetResult.widgetId)
    logUtil.logWarn("当前处于挂件模式，使用electron的fetch获取数据")
  } else if (isInChromeExtension()) {
    logUtil.logWarn("当前处于Chrome插件中，需要模拟fetch解决CORS跨域问题")
  } else {
    logUtil.logWarn("当前处于非挂件模式，已开启请求代理解决CORS跨域问题")
  }
})
</script>

<script lang="ts">
/* eslint-disable vue/multi-word-component-names */
export default {
  name: "publish",
}
</script>
