<template>
  <div class="post-detail-content-box">
    <div class="btn-publish">
      <el-button size="small" type="primary" @click="handlePublish">发布到其他平台</el-button>
    </div>

    <!-- 文章详情 -->
    <DefaultPostDetailService :page-id="pid"/>

    <!--
    <div id="dt-tool">
      <locale-changer/>
    </div>
    -->
    <el-footer>
      <DefaultFooter/>
    </el-footer>
  </div>
</template>

<script lang="ts" setup>
import {goToPage} from "../../lib/browser/ChromeUtil";
import {getPageId, getWidgetId} from "../../lib/platform/siyuan/siyuanUtil";
import {onMounted, ref} from "vue";
import DefaultFooter from "./themes/default/DefaultFooter.vue";

const props = defineProps({
  pageId: {
    type: String,
    default: undefined
  }
})

const pid = ref("")

const handlePublish = async (e: any) => {
  e.preventDefault()
  const widgetResult = await getWidgetId()
  if (widgetResult.isInSiyuan) {
    goToPage("/index.html?id=" + pid.value, "/")
  } else {
    goToPage("/publish/index.html?id=" + pid.value, "/")
  }
}

const initPage = async () => {
  const pageId = await getPageId(true, props.pageId);
  if (!pageId || pageId === "") {
    return
  }
  pid.value = pageId
}

onMounted(async () => {
  await initPage()
})
</script>

<script lang="ts">
import DefaultPostDetailService from "./themes/default/DefaultPostDetailService.vue";

export default {
  name: "BlogDetail",
  components: {DefaultPostDetailService}
}
</script>

<style>
#dt-tool .el-form-item__label{
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