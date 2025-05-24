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
        <component 
          :is="platformConfigComponent" 
          v-model:config="platformConfig" 
          @test="testConnection"
          @update:config="handleConfigUpdate" 
        />
      </div>

      <div class="form-group">
        <label for="title">文章标题</label>
        <input id="title" v-model="post.title" type="text" placeholder="输入文章标题" />
      </div>

      <div class="form-group">
        <label for="content">文章内容</label>
        <textarea id="content" v-model="post.content" rows="10" placeholder="输入文章内容"></textarea>
      </div>

      <div class="form-group">
        <label for="excerpt">文章摘要</label>
        <textarea id="excerpt" v-model="post.excerpt" rows="3" placeholder="输入文章摘要"></textarea>
      </div>

      <div class="form-group">
        <label for="tags">标签</label>
        <input id="tags" v-model="tagsInput" type="text" placeholder="输入标签，用逗号分隔" @input="handleTagsInput" />
      </div>

      <div class="form-group">
        <label for="status">发布状态</label>
        <select id="status" v-model="publishOptions.status">
          <option value="draft">草稿</option>
          <option value="published">发布</option>
          <option value="private">私密</option>
        </select>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { usePluginSystem } from "../composables/usePluginSystem"
import { usePublisher } from "../composables/usePublisher"
import type { 
  Post, 
  PublishResult, 
  PlatformConfig, 
  PublishOptions,
  PostStatus,
  ErrorType 
} from "@siyuan-publisher/common"
import { defineAsyncComponent } from "vue"

const {
  plugins,
  platformAdapters: availablePlatforms,
  isLoading,
  error: pluginError,
  getPluginConfig,
} = usePluginSystem()

const { publish: publishService, isPublishing, error: publishError } = usePublisher()

const selectedPlatform = ref("")
const platformConfig = ref<PlatformConfig>({
  type: "" ,
  config: {},
} as any)

const post = ref<Post>({
  id: "",
  title: "",
  content: "",
  excerpt: "",
  tags: [],
  categories: [],
  status: "draft",
  metadata: {}
})

const publishOptions = ref<PublishOptions>({
  status: "draft",
  publishDate: new Date(),
})

const publishResult = ref<PublishResult | null>(null)
const tagsInput = ref("")

// 动态加载平台配置组件
const platformConfigComponent = computed(() => {
  if (!selectedPlatform.value) return null
  const component = defineAsyncComponent(() => 
    import(`../components/platform-configs/${selectedPlatform.value}.vue`)
  )
  return component
})

// 监听插件加载状态，初始化平台
watch(isLoading, (loading) => {
  if (!loading && availablePlatforms.value.length > 0 && !selectedPlatform.value) {
    selectedPlatform.value = availablePlatforms.value[0].id
    const config = getPluginConfig(availablePlatforms.value[0].id)
    if (config) {
      platformConfig.value = config
    }
  }
})

// 监听平台选择变化
watch(selectedPlatform, async (newPlatformId) => {
  if (newPlatformId) {
    const config = getPluginConfig(newPlatformId)
    if (config) {
      platformConfig.value = config
    }
  }
})

// 处理标签输入
const handleTagsInput = () => {
  post.value.tags = tagsInput.value
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

// 处理配置更新
const handleConfigUpdate = (newConfig: PlatformConfig) => {
  platformConfig.value = newConfig
}

// 测试平台连接
const testConnection = async () => {
  try {
    const result = await publishService.testConnection(selectedPlatform.value, platformConfig.value)
    if (result.success) {
      showMessage("连接成功", "success")
    } else {
      showMessage(result.error || "连接失败", "error")
    }
  } catch (error) {
    const errorType = error instanceof Error ? (error.message as ErrorType) : "PLATFORM_CONNECTION_FAILED"
    showMessage(getErrorMessage(errorType), "error")
  }
}

// 获取错误消息
const getErrorMessage = (errorType: ErrorType): string => {
  const errorMessages: Record<ErrorType, string> = {
    PLATFORM_CONNECTION_FAILED: "平台连接失败",
    PLATFORM_CONFIG_INVALID: "平台配置无效",
    AUTHENTICATION_FAILED: "认证失败",
    INVALID_CONFIG: "配置无效",
    PUBLISH_FAILED: "发布失败",
    UNKNOWN_ERROR: "未知错误",
    // ... 其他错误类型
  } as any
  return errorMessages[errorType] || "操作失败"
}

// 发布文章
const publish = async () => {
  try {
    isPublishing.value = true
    const result = await publishService.publish({
      platform: {
        type: selectedPlatform.value,
        config: platformConfig.value,
      },
      post: {
        ...post.value,
        status: publishOptions.value.status as PostStatus,
      },
      ...publishOptions.value,
    })
    
    if (result.success) {
      showMessage("发布成功", "success")
      publishResult.value = result
    } else {
      showMessage(result.error || getErrorMessage("PUBLISH_FAILED"), "error")
    }
  } catch (error) {
    const errorType = error instanceof Error ? (error.message as ErrorType) : "PUBLISH_FAILED"
    showMessage(getErrorMessage(errorType), "error")
  } finally {
    isPublishing.value = false
  }
}

// 显示消息
const showMessage = (message: string, type: "success" | "error") => {
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${type}`
  messageDiv.textContent = message
  document.body.appendChild(messageDiv)
  setTimeout(() => {
    messageDiv.remove()
  }, 3000)
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

/* 消息提示样式 */
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 1000;
  animation: fadeInOut 3s ease-in-out;
}

.message.success {
  background-color: #e6ffe6;
  color: #006600;
  border: 1px solid #006600;
}

.message.error {
  background-color: #ffe6e6;
  color: #cc0000;
  border: 1px solid #cc0000;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
