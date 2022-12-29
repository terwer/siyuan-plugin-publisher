<template>
  <div id="post-detail-body">
    <el-page-header :icon="ArrowLeft" title="返回" @click="onBack">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3" :title="props.post.title">
            {{ shortTitle }} - Anki
          </span>
        </div>
      </template>
    </el-page-header>

    <div class="post-detail-content-box">
      <anki-index :page-id="props.post.postid" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Post } from "~/utils/models/post"
import { getByLength } from "~/utils/strUtil"
import { onMounted, ref } from "vue"
import { getPublishCfg } from "~/utils/publishUtil"
import { parseBoolean } from "~/utils/util"
import { ArrowLeft } from "@element-plus/icons-vue"
import AnkiIndex from "~/components/anki/AnkiIndex.vue"

const props = defineProps({
  post: {
    type: Post,
    default: new Post(),
  },
})
const emits = defineEmits(["on-change"])

const shortTitle = getByLength(props.post?.title, 18, false)
const isNewWin = ref(true)

const onBack = () => {
  emits("on-change")
}

onMounted(() => {
  const publishCfg = getPublishCfg()
  isNewWin.value = parseBoolean(publishCfg.newWin)
})
</script>

<style scoped>
#post-detail-body {
  min-width: 600px !important;
  margin-top: 20px;
  margin-bottom: 16px;
}

#post-detail-body .btn-publish {
  /*margin-left: 10px;*/
  cursor: pointer;
  padding: 0;
  margin-top: 20px;
}
</style>
