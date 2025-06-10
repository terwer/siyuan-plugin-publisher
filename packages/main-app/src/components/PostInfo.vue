<template>
  <div class="post-info">
    <div class="form-group">
      <label for="title">文章标题</label>
      <input id="title" v-model="localPost.title" type="text" placeholder="输入文章标题" @input="updatePost" />
    </div>

    <div class="form-group">
      <label for="content">文章内容</label>
      <textarea
        id="content"
        v-model="localPost.content"
        rows="10"
        placeholder="输入文章内容"
        @input="updatePost"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="excerpt">文章摘要</label>
      <textarea
        id="excerpt"
        v-model="localPost.excerpt"
        rows="3"
        placeholder="输入文章摘要"
        @input="updatePost"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="tags">标签</label>
      <input
        id="tags"
        v-model="localTagsInput"
        type="text"
        placeholder="输入标签，用逗号分隔"
        @input="handleTagsInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import type { Post } from "@siyuan-publisher/common"

const props = defineProps<{
  post: Post
  tagsInput: string
}>()

const emit = defineEmits<{
  (e: "postUpdate", post: Post): void
  (e: "tagsInput", input: string): void
}>()

const localPost = ref<Post>({ ...props.post })
const localTagsInput = ref(props.tagsInput)

watch(
  () => props.post,
  (newPost) => {
    localPost.value = { ...newPost }
  },
  { deep: true },
)

watch(
  () => props.tagsInput,
  (newInput) => {
    localTagsInput.value = newInput
  },
)

const updatePost = () => {
  emit("postUpdate", localPost.value)
}

const handleTagsInput = () => {
  emit("tagsInput", localTagsInput.value)
}
</script>

<style scoped>
.post-info {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  resize: vertical;
}
</style>
