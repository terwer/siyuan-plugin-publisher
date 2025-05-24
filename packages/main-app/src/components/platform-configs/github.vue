<template>
  <div class="github-config">
    <div class="form-group">
      <label for="token">GitHub Token</label>
      <input
        id="token"
        v-model="localConfig.settings.token"
        type="password"
        placeholder="输入 GitHub Personal Access Token"
        @input="updateConfig"
      />
    </div>

    <div class="form-group">
      <label for="owner">仓库所有者</label>
      <input
        id="owner"
        v-model="localConfig.settings.owner"
        type="text"
        placeholder="输入 GitHub 用户名或组织名"
        @input="updateConfig"
      />
    </div>

    <div class="form-group">
      <label for="repo">仓库名称</label>
      <input
        id="repo"
        v-model="localConfig.settings.repo"
        type="text"
        placeholder="输入仓库名称"
        @input="updateConfig"
      />
    </div>

    <div class="form-group">
      <label for="branch">分支</label>
      <input
        id="branch"
        v-model="localConfig.settings.branch"
        type="text"
        placeholder="输入分支名称"
        @input="updateConfig"
      />
    </div>

    <div class="form-group">
      <label for="path">文件路径</label>
      <input
        id="path"
        v-model="localConfig.settings.path"
        type="text"
        placeholder="输入文件路径"
        @input="updateConfig"
      />
    </div>

    <button @click="$emit('test')" class="test-btn">测试连接</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import type { PlatformConfig } from "@siyuan-publisher/common"

const props = defineProps<{
  config: PlatformConfig
}>()

const emit = defineEmits<{
  "update:config": [config: PlatformConfig]
  test: []
}>()

const localConfig = ref<PlatformConfig>({
  type: "github",
  enabled: true,
  settings: {
    token: "",
    owner: "",
    repo: "",
    branch: "main",
    path: "README.md",
  },
})

// 监听外部配置变化
watch(
  () => props.config,
  (newConfig) => {
    if (newConfig) {
      localConfig.value = { ...newConfig }
    }
  },
  { immediate: true }
)

// 更新配置
const updateConfig = () => {
  emit("update:config", localConfig.value)
}
</script>

<style scoped>
.github-config {
  padding: 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.test-btn {
  padding: 8px 16px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.test-btn:hover {
  background-color: #0056b3;
}
</style> 