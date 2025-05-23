<template>
  <div class="publish">
    <h1>发布文章</h1>
    <div class="content">
      <div class="form-group">
        <label for="platform">选择平台</label>
        <select id="platform" v-model="selectedPlatform">
          <option v-for="platform in availablePlatforms" :key="platform.id" :value="platform.id">
            {{ platform.name }}
          </option>
        </select>
      </div>

      <div v-if="selectedPlatform" class="platform-config">
        <component :is="platformConfigComponent" v-model:config="platformConfig" @test="testConnection" />
      </div>

      <div class="form-group">
        <label for="title">文章标题</label>
        <input id="title" v-model="post.title" type="text" placeholder="输入文章标题" />
      </div>

      <div class="form-group">
        <label for="content">文章内容</label>
        <textarea id="content" v-model="post.content" rows="10" placeholder="输入文章内容"></textarea>
      </div>

      <button @click="publish" class="publish-btn" :disabled="isPublishing">
        {{ isPublishing ? "发布中..." : "发布" }}
      </button>

      <div v-if="publishResult" class="result" :class="{ success: publishResult.success }">
        <p v-if="publishResult.success">发布成功！<a :href="publishResult.url" target="_blank">查看文章</a></p>
        <p v-else>发布失败：{{ publishResult.error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { usePluginSystem } from "../composables/usePluginSystem"
import { usePublisher } from "../composables/usePublisher"
import type { Post, PublishResult, PlatformConfig } from "@siyuan-publisher/core"

const { plugins: availablePlatforms, loadPlugin } = usePluginSystem()
const { publish: publishService, isPublishing } = usePublisher()

const selectedPlatform = ref("")
const platformConfig = ref<PlatformConfig>({
  type: "",
  config: {},
})

const post = ref<Post>({
  title: "",
  content: "",
})

const publishResult = ref<PublishResult | null>(null)

// 动态加载平台配置组件
const platformConfigComponent = computed(() => {
  if (!selectedPlatform.value) return null
  return () => import(`../components/platform-configs/${selectedPlatform.value}.vue`)
})

// 测试平台连接
const testConnection = async () => {
  try {
    const result = await publishService.testConnection(selectedPlatform.value, platformConfig.value)
    alert(result.success ? "连接成功！" : `连接失败：${result.error}`)
  } catch (error) {
    alert(`测试失败：${error instanceof Error ? error.message : "未知错误"}`)
  }
}

// 发布文章
const publish = async () => {
  if (!post.value.title || !post.value.content) {
    alert("请填写文章标题和内容")
    return
  }

  publishResult.value = null

  try {
    publishResult.value = await publishService.publish({
      platform: {
        type: selectedPlatform.value,
        config: platformConfig.value.config,
      },
      post: post.value,
    })
  } catch (error) {
    publishResult.value = {
      success: false,
      error: error instanceof Error ? error.message : "发布失败",
    }
  }
}
</script>

<style scoped>
.publish {
  padding: 20px;
}

.content {
  max-width: 800px;
  margin: 0 auto;
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
select,
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

.publish-btn {
  padding: 10px 20px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
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

.platform-config {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
