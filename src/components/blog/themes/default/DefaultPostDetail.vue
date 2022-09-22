<template>
  <div id="post-detail-body">
    <el-page-header :icon="ArrowLeft" title="返回" @click="onBack">
      <template #content>
        <span class="text-large font-600 mr-3"> {{ post.title }} </span>
      </template>
    </el-page-header>

    <div class="post-detail-content-box">
      {{ post.description }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Post} from "../../../../lib/common/post";
import {ArrowLeft} from '@element-plus/icons-vue'

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
</style>