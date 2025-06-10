<template>
  <div class="wordpress-config">
    <div class="form-group">
      <label for="apiUrl">API URL</label>
      <input id="apiUrl" v-model="config.apiUrl" type="text" placeholder="https://your-wordpress-site.com" />
    </div>
    <div class="form-group">
      <label for="username">用户名</label>
      <input id="username" v-model="config.username" type="text" placeholder="WordPress 用户名" />
    </div>
    <div class="form-group">
      <label for="password">密码</label>
      <input id="password" v-model="config.password" type="password" placeholder="WordPress 密码" />
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
  (e: "update:config", value: PlatformConfig): void
  (e: "test"): void
}>()

const config = ref({
  apiUrl: "",
  username: "",
  password: "",
})

watch(
  config,
  (newValue) => {
    emit("update:config", {
      type: "wordpress",
      config: newValue,
    } as any)
  },
  { deep: true },
)
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
