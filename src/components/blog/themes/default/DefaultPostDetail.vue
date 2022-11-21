<template>
  <div id="post-detail-body">
    <el-page-header :icon="ArrowLeft" title="返回" @click="onBack">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3" :title="post.title"> {{ shortTitle }} </span>
        </div>
      </template>
    </el-page-header>

    <div class="post-detail-content-box">
      <div class="btn-publish">
        <el-button size="small" @click="handlePublish">发布到其他平台</el-button>
        <el-button size="small" type="primary" @click="handleNewWinPublish">新窗口发布到其他平台</el-button>
      </div>

      <!-- 文章详情 -->
      <DefaultPostDetailService :page-id="props.post.postid"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Post} from "../../../../utils/common/post";
import {ArrowLeft} from '@element-plus/icons-vue'
import {goToPage} from "../../../../utils/browser/ChromeUtil";
import DefaultPostDetailService from "./DefaultPostDetailService.vue";
import {getByLength} from "../../../../utils/strUtil";

const props = defineProps({
  post: {
    type: Post,
    default: new Post()
  },
})
const emit = defineEmits<{
  (e: 'on-change'): void,
  (e: 'on-publish-change', post: Post): void
}>()

const shortTitle = getByLength(props.post?.title,10,false)

const onBack = () => {
  emit("on-change");
}
const handlePublish = (e: any) => {
  emit('on-publish-change', props.post)
}
const handleNewWinPublish = (e: any) => {
  e.preventDefault()
  goToPage("/publish/index.html?id=" + props.post?.postid, "/")
}
</script>

<script lang="ts">
export default {
  name: "DefaultPostDetail"
}
</script>

<style scoped>
#post-detail-body {
  min-width: 600px !important;
}

#post-detail-body .btn-publish {
  /*margin-left: 10px;*/
  cursor: pointer;
  padding: 10px 0;
}
</style>