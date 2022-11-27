<template>
  <div id="publish-body">
    <el-page-header class="publish-header" :icon="ArrowLeft" title="返回" @click="onBack">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3"> {{ props.publishData.title }} - 文章发布 </span>
        </div>
      </template>
    </el-page-header>

    <publish-service :page-id="props.publishData.postid"/>
  </div>
</template>

<script lang="ts" setup>
import {ArrowLeft} from "@element-plus/icons-vue";
import PublishService from "../../../publish/PublishService.vue";
import {Post} from "~/utils/common/post";

const props = defineProps({
  publishData: {
    type: Post,
    default: new Post()
  }
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
  name: "DefaultPublish"
}
</script>

<style scoped>
.publish-header{
  margin-bottom: 16px;
}
#publish-body {
  min-width: 600px !important;
}
</style>