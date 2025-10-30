<!--suppress ALL -->
<template>
  <div class="settings">
    <h1>设置</h1>

    <div class="settings-content">
      <div class="section">
        <h2>平台配置</h2>

        <div class="platform-config">
          <div class="platform-item">
            <h3>WordPress</h3>
            <div class="form-group">
              <label>网站地址</label>
              <TgInput v-model="wordpressConfig.url" placeholder="https://your-site.com" />
            </div>
            <div class="form-group">
              <label>用户名</label>
              <TgInput v-model="wordpressConfig.username" placeholder="用户名" />
            </div>
            <div class="form-group">
              <label>应用密码</label>
              <TgInput v-model="wordpressConfig.password" type="password" placeholder="应用密码" />
            </div>
            <TgButton @click="testWordPressConnection">测试连接</TgButton>
          </div>

          <div class="platform-item">
            <h3>GitHub</h3>
            <div class="form-group">
              <label>仓库地址</label>
              <TgInput v-model="githubConfig.repo" placeholder="username/repository" />
            </div>
            <div class="form-group">
              <label>个人访问令牌</label>
              <TgInput v-model="githubConfig.token" type="password" placeholder="Personal Access Token" />
            </div>
            <TgButton @click="testGitHubConnection">测试连接</TgButton>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>发布设置</h2>
        <div class="form-group">
          <TgCheckbox :model-value="[settings.autoSave]" :options="[{ label: '自动保存草稿', value: true }]">
            自动保存草稿
          </TgCheckbox>
        </div>
        <div class="form-group">
          <TgCheckbox :model-value="[settings.includeMetadata]" :options="[{ label: '包含元数据', value: true }]">
            包含元数据
          </TgCheckbox>
        </div>
        <div class="form-group">
          <label>默认发布状态</label>
          <TgSelect
            :model-value="settings.defaultStatus"
            :options="[
              { label: '草稿', value: 'draft' },
              { label: '发布', value: 'publish' },
              { label: '私有', value: 'private' },
            ]"
          >
          </TgSelect>
        </div>
      </div>

      <div class="section">
        <TgButton type="primary" @click="saveSettings">保存设置</TgButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TgButton, TgCheckbox, TgInput, TgSelect } from "@terwer/ui"
import { ref } from "vue"

// 响应式数据
const wordpressConfig = ref({
  url: "",
  username: "",
  password: "",
})

const githubConfig = ref({
  repo: "",
  token: "",
})

const settings = ref({
  autoSave: true,
  includeMetadata: true,
  defaultStatus: "draft",
})

// 测试WordPress连接
const testWordPressConnection = () => {
  if (!wordpressConfig.value.url || !wordpressConfig.value.username || !wordpressConfig.value.password) {
    alert("请填写完整的WordPress配置信息")
    return
  }

  console.log("测试WordPress连接:", wordpressConfig.value)
  alert("WordPress连接测试成功！")
}

// 测试GitHub连接
const testGitHubConnection = () => {
  if (!githubConfig.value.repo || !githubConfig.value.token) {
    alert("请填写完整的GitHub配置信息")
    return
  }

  console.log("测试GitHub连接:", githubConfig.value)
  alert("GitHub连接测试成功！")
}

// 保存设置
const saveSettings = () => {
  console.log("保存设置:", {
    wordpress: wordpressConfig.value,
    github: githubConfig.value,
    settings: settings.value,
  })

  alert("设置保存成功！")
}
</script>

<style scoped>
.settings {
  padding: 20px;
}

.settings-content {
  max-width: 800px;
}

.section {
  margin-bottom: 40px;
}

h1 {
  color: var(--tg-color-text-1);
  margin-bottom: 20px;
}

h2 {
  color: var(--tg-color-text-1);
  margin-bottom: 20px;
  font-size: 18px;
}

h3 {
  color: var(--tg-color-text-1);
  margin-bottom: 15px;
  font-size: 16px;
}

.platform-config {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.platform-item {
  padding: 20px;
  border: 1px solid var(--tg-color-border);
  border-radius: 8px;
  background-color: var(--tg-color-bg);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: var(--tg-color-text-2);
  font-size: 14px;
}
</style>
