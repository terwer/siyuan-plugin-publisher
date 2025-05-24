<template>
  <div class="publish-options">
    <div class="form-group">
      <label for="status">发布状态</label>
      <select id="status" v-model="localOptions.status" @change="updateOptions">
        <option value="draft">草稿</option>
        <option value="published">发布</option>
        <option value="private">私密</option>
      </select>
    </div>

    <div class="form-group">
      <label for="publishDate">发布时间</label>
      <input
        id="publishDate"
        type="datetime-local"
        v-model="localPublishDate"
        @change="updateOptions"
      />
    </div>

    <button @click="publish" class="publish-btn" :disabled="isPublishing">
      {{ isPublishing ? "发布中..." : "发布" }}
    </button>

    <div v-if="publishResult" class="result" :class="{ success: publishResult.success }">
      <p v-if="publishResult.success">
        发布成功！
        <a :href="publishResult.url" target="_blank">查看文章</a>
      </p>
      <p v-else>发布失败：{{ publishResult.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import type { PublishOptions, PublishResult } from "@siyuan-publisher/common"

const props = defineProps<{
  options: PublishOptions
  isPublishing: boolean
  publishResult: PublishResult | null
}>()

const emit = defineEmits<{
  (e: "optionsUpdate", options: PublishOptions): void
  (e: "publish"): void
}>()

const localOptions = ref<PublishOptions>({ ...props.options })
const localPublishDate = ref(props.options.publishDate.toISOString().slice(0, 16))

watch(() => props.options, (newOptions) => {
  localOptions.value = { ...newOptions }
  localPublishDate.value = newOptions.publishDate.toISOString().slice(0, 16)
}, { deep: true })

const updateOptions = () => {
  localOptions.value.publishDate = new Date(localPublishDate.value)
  emit("optionsUpdate", localOptions.value)
}

const publish = () => {
  emit("publish")
}
</script>

<style scoped>
.publish-options {
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

select,
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.publish-btn {
  padding: 10px 20px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
}

.publish-btn:hover {
  background-color: #0056b3;
}

.publish-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
}

.result.success {
  background-color: #e6ffe6;
  color: #006600;
}

.result:not(.success) {
  background-color: #ffe6e6;
  color: #cc0000;
}
</style> 