<!--suppress VueDuplicateTag -->
<template>
  <div>
    <div v-if="isPublish">
      <publish-service :page-id="undefined"/>
    </div>
    <div v-else>
      <blog-index/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import logUtil from "../utils/logUtil";
import PublishService from "../components/publish/PublishService.vue";
import {isInChromeExtension} from "../utils/browser/ChromeUtil";
import {getPageId, getWidgetId} from "../utils/platform/siyuan/siyuanUtil";
import BlogIndex from "../components/blog/BlogIndex.vue";
import {SiYuanApiAdaptor} from "../utils/platform/siyuan/siYuanApiAdaptor";

const isPublish = ref(false)

onMounted(async () => {
  logUtil.logWarn("MODE=>", import.meta.env.MODE)

  const widgetResult = getWidgetId()
  if (widgetResult.isInSiyuan) {
    const postid = await getPageId()
    // logUtil.logInfo("当前页面ID是=>", postid)
    // logUtil.logInfo("当前处于挂件模式，使用electron的fetch获取数据")

    const api = new SiYuanApiAdaptor()
    const result = await api.getSubPostCount(postid)
    // logUtil.logInfo("子文档个数", result)
    if (result > 1) {
      isPublish.value = false
      logUtil.logWarn("检测到子文档，将转到显示列表页面")
    } else {
      isPublish.value = true
      logUtil.logWarn("没有子文档显示发布页面")
    }
  } else if (isInChromeExtension()) {
    logUtil.logWarn("当前处于Chrome插件中，需要模拟fetch解决CORS跨域问题")
  } else {
    logUtil.logWarn("当前处于非挂件模式，已开启请求代理解决CORS跨域问题")
  }
})
</script>