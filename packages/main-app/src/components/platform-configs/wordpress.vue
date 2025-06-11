<template>
  <div class="wordpress-config">
    <div class="form-group">
      <label for="apiUrl">API URL</label>
      <input
        id="apiUrl"
        v-model="localConfig.settings.apiUrl"
        type="text"
        placeholder="https://your-wordpress-site.com"
        @input="updateConfig"
      />
    </div>
    <div class="form-group">
      <label for="username">用户名</label>
      <input
        id="username"
        v-model="localConfig.settings.username"
        type="text"
        placeholder="WordPress 用户名"
        @input="updateConfig"
      />
    </div>
    <div class="form-group">
      <label for="password">密码</label>
      <input
        id="password"
        v-model="localConfig.settings.password"
        type="password"
        placeholder="WordPress 密码"
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
  type: "wordpress",
  enabled: true,
  settings: {
    apiUrl: "",
    username: "",
    password: "",
  },
})

// 监听外部配置变化
watch(
  () => props.config,
  (newConfig) => {
    if (newConfig) {
      localConfig.value = {
        type: newConfig.type || "wordpress",
        enabled: newConfig.enabled ?? true,
        settings: {
          apiUrl: newConfig.settings?.apiUrl || "",
          username: newConfig.settings?.username || "",
          password: newConfig.settings?.password || "",
        },
      }
    }
  },
  { immediate: true },
)

// 更新配置
const updateConfig = () => {
  emit("update:config", localConfig.value)
}
</script>

<style scoped>
.wordpress-config {
  width: 100%;
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
