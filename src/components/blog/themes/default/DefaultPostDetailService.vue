<template>
  <div id="post-detail-content"
       v-highlight
       v-html="post.description"
  ></div>
</template>

<script lang="ts" setup>
import {Post} from "../../../../lib/common/post";
import {onMounted, ref, watch} from "vue";
import {API} from "../../../../lib/api";
import {API_TYPE_CONSTANTS} from "../../../../lib/constants/apiTypeConstants";
import logUtil from "../../../../lib/logUtil";

const props = defineProps({
  pageId: {
    type: String,
    default: undefined
  }
})

/*监听props*/
watch(() => props.pageId, /**/(oldValue, newValue) => {
  // Here you can add you functionality
  // as described in the name you will get old and new value of watched property
  // 默认选中vuepress
  // setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  initPage();
  logUtil.logInfo("文章详情查看初始化")
})

const defaultPost = new Post()
const post = ref(defaultPost)

const initPage = async () => {
  const api = new API(API_TYPE_CONSTANTS.API_TYPE_SIYUAN)
  const siyuanPost = await api.getPost(props.pageId || "")
  post.value = siyuanPost
}

onMounted(async () => {
  await initPage()
})
</script>

<script lang="ts">
export default {
  name: "DefaultPostDetailService"
}
</script>

<style>
/* 预览样式 */
#post-detail-content {
}

#post-detail-content img {
  max-width: 99%;
}
</style>
<style scoped>

</style>