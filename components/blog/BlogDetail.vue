<template>
  <div class="post-detail-content-box">
    <div class="btn-publish">
      <el-button size="small" type="primary" @click="handlePublish"
        >发布到其他平台</el-button
      >
    </div>

    <!-- 文章详情 -->
    <DefaultPostDetailService :page-id="pid" />

    <!--
    <div id="dt-tool">
      <locale-changer/>
    </div>
    -->
    <el-footer>
      <DefaultFooter />
    </el-footer>
  </div>
</template>

<script lang="ts" setup>
import DefaultFooter from "./themes/default/DefaultFooter.vue"
import DefaultPostDetailService from "./themes/default/DefaultPostDetailService.vue"
import { onMounted, ref } from "vue"
import { getPageId, getWidgetId } from "~/utils/platform/siyuan/siyuanUtil"
import { goToPage } from "~/utils/browser/ChromeUtil"

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
    goToPage("/index.html?id=" + pid.value, "/")
  } else {
    goToPage("/publish/index.html?id=" + pid.value, "/")
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
