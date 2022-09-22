<template>
  <div id="post-detail-body">
    <el-page-header :icon="ArrowLeft" title="返回" @click="onBack">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3"> {{ post.title }} </span>
        </div>
      </template>
    </el-page-header>

    <div class="post-detail-content-box">
      <div class="btn-publish">
        <el-button size="small" type="primary" @click="handlePublish">发布到其他平台</el-button>
      </div>

      <div class="post-detail-content-box">
        <div id="post-detail-content"
             v-highlight
             v-html="post.description"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Post} from "../../../../lib/common/post";
import {ArrowLeft} from '@element-plus/icons-vue'
import {goToPage} from "../../../../lib/chrome/ChromeUtil";

const props = defineProps({
  post: {
    type: Post,
    default: new Post()
  },
})
const emit = defineEmits<{
  (e: 'on-change'): void
}>()

const onBack = () => {
  emit("on-change");
}
const handlePublish = (e:any) => {
  e.preventDefault()
  goToPage("/index.html?id=" + props.post?.postid)
}
</script>

<script lang="ts">
export default {
  name: "DefaultPostDetail"
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
#post-detail-body {
  min-width: 600px !important;
}

#post-detail-body .btn-publish {
  /*margin-left: 10px;*/
  cursor: pointer;
  padding: 10px 0;
}
</style>