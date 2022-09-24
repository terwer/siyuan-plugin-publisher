<template>
  <div class="post-detail-content-box">
    <div class="btn-publish">
      <el-button size="small" type="primary" @click="handlePublish">发布到其他平台</el-button>
    </div>

    <!-- 文章详情 -->
    <DefaultPostDetailService :page-id="pid"/>

    <locale-changer/>
  </div>
</template>

<script lang="ts" setup>
import {goToPage} from "../../lib/chrome/ChromeUtil";
import {getPageId} from "../../lib/platform/siyuan/siyuanUtil";
import {onMounted, ref} from "vue";
import LocaleChanger from "../tab/ChangeLocale.vue";

const props = defineProps({
  pageId: {
    type: String,
    default: undefined
  }
})

const pid = ref("")

const handlePublish = (e: any) => {
  e.preventDefault()
  goToPage("/index.html?id=" + pid.value, "/")
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