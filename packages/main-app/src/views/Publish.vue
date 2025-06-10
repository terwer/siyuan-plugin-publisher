<template>
  <div class="publish">
    <h1>发布文章</h1>
    <div class="content">
      <TgTabs :items="publishTabs" v-model="activeTabIndex" @change="handleTabChange">
        <template #platform>
          <WordPressConfig :config="platformConfig" @update:config="handleConfigUpdate" @test="testConnection" />
        </template>
        <template #post>
          <PostInfo
            :post="post"
            :tags-input="tagsInput"
            @post-update="handlePostUpdate"
            @tags-input="handleTagsInput"
          />
        </template>
        <template #options>
          <PublishOptionsPanel
            :options="publishOptions"
            :is-publishing="isPublishing"
            :publish-result="publishResult"
            @options-update="handleOptionsUpdate"
            @publish="publish"
          />
        </template>
      </TgTabs>
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
  ErrorType,
  PlatformAdaptor,
} from "@siyuan-publisher/common"
import { TgTabs } from "@terwer/ui"
import WordPressConfig from "../components/platform-configs/wordpress.vue"
import PostInfo from "../components/PostInfo.vue"
import PublishOptionsPanel from "../components/PublishOptionsPanel.vue"

const { getPluginConfig } = usePluginSystem()

const { publish: publishService, isPublishing, error: publishError, platformAdaptors } = usePublisher()

const selectedPlatform = ref("")
const platformConfig = ref<PlatformConfig>({
  type: "",
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
  metadata: {},
})

const publishOptions = ref<PublishOptions>({
  status: "draft",
  publishDate: new Date(),
})

const publishResult = ref<PublishResult | null>(null)
const tagsInput = ref("")
const activeTabIndex = ref("platform")

// 定义发布流程的标签页
const publishTabs = computed(() => [
  {
    key: "platform",
    label: "选择平台",
  },
  {
    key: "post",
    label: "文章信息",
  },
  {
    key: "options",
    label: "发布选项",
  },
])

// 处理标签页切换
const handleTabChange = (key: string | number) => {
  activeTabIndex.value = key as string
}

// 处理平台选择
const handlePlatformSelect = (platformId: string) => {
  selectedPlatform.value = platformId
}

// 处理配置更新
const handleConfigUpdate = (newConfig: PlatformConfig) => {
  platformConfig.value = newConfig
}

// 处理文章信息更新
const handlePostUpdate = (newPost: Post) => {
  post.value = newPost
}

// 处理标签输入
const handleTagsInput = (input: string) => {
  tagsInput.value = input
  post.value.tags = input
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}

// 处理发布选项更新
const handleOptionsUpdate = (newOptions: PublishOptions) => {
  publishOptions.value = newOptions
}

// 测试平台连接
const testConnection = async () => {
  try {
    const platform = platformAdaptors.value.find((p) => p.id === selectedPlatform.value)
    if (!platform) {
      showMessage("未找到选中的平台", "error")
      return
    }

    const result = await testConnection(platform, platformConfig.value)
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
  } as any
  return errorMessages[errorType] || "操作失败"
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

// 发布文章
const publish = async () => {
  try {
    const platform = platformAdaptors.value.find((p) => p.id === selectedPlatform.value)
    if (!platform) {
      showMessage("未找到选中的平台", "error")
      return
    }

    isPublishing.value = true
    const result = await publishService(
      platform,
      {
        ...post.value,
        status: publishOptions.value.status as PostStatus,
      },
      publishOptions.value,
    )

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

// 监听插件加载状态，初始化平台
// watch(isLoading, (loading) => {
//   if (!loading && availablePlatforms.value.length > 0 && !selectedPlatform.value) {
//     selectedPlatform.value = availablePlatforms.value[0].id
//     const config = getPluginConfig(availablePlatforms.value[0].id)
//     if (config) {
//       platformConfig.value = config
//     }
//   }
// })
</script>

<style scoped>
.publish {
  padding: 20px;
}

.content {
  max-width: 800px;
  margin: 0 auto;
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
