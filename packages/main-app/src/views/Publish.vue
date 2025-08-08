<template>
  <div class="publish">
    <h1>发布内容</h1>
    
    <div class="publish-content">
      <div class="section">
        <h2>选择平台</h2>
        <div class="platform-selector">
          <TgSelect v-model="selectedPlatform" placeholder="请选择发布平台">
            <option value="wordpress">WordPress</option>
            <option value="github">GitHub</option>
            <option value="blog">博客平台</option>
          </TgSelect>
        </div>
      </div>

      <div class="section">
        <h2>内容信息</h2>
        <div class="form-group">
          <label>标题</label>
          <TgInput v-model="postTitle" placeholder="请输入文章标题" />
        </div>
        <div class="form-group">
          <label>摘要</label>
          <TgInput v-model="postSummary" placeholder="请输入文章摘要" />
        </div>
        <div class="form-group">
          <label>标签</label>
          <TgInput v-model="postTags" placeholder="请输入标签，用逗号分隔" />
        </div>
      </div>

      <div class="section">
        <h2>发布选项</h2>
        <div class="form-group">
          <TgCheckbox v-model="publishAsDraft">发布为草稿</TgCheckbox>
        </div>
        <div class="form-group">
          <TgCheckbox v-model="includeImages">包含图片</TgCheckbox>
        </div>
      </div>

      <div class="section">
        <TgButton type="primary" @click="handlePublish" :loading="publishing">
          {{ publishing ? '发布中...' : '发布' }}
        </TgButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TgButton, TgCheckbox, TgInput, TgSelect } from '@terwer/ui'
import { ref } from 'vue'

// 响应式数据
const selectedPlatform = ref('')
const postTitle = ref('')
const postSummary = ref('')
const postTags = ref('')
const publishAsDraft = ref(false)
const includeImages = ref(true)
const publishing = ref(false)

// 发布处理
const handlePublish = async () => {
  if (!selectedPlatform.value) {
    alert('请选择发布平台')
    return
  }
  
  if (!postTitle.value) {
    alert('请输入文章标题')
    return
  }

  publishing.value = true
  
  try {
    // 模拟发布过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('发布信息:', {
      platform: selectedPlatform.value,
      title: postTitle.value,
      summary: postSummary.value,
      tags: postTags.value,
      asDraft: publishAsDraft.value,
      includeImages: includeImages.value
    })
    
    alert('发布成功！')
  } catch (error) {
    alert('发布失败：' + error)
  } finally {
    publishing.value = false
  }
}
</script>

<style scoped>
.publish {
  padding: 20px;
}

.publish-content {
  max-width: 600px;
}

.section {
  margin-bottom: 30px;
}

h1 {
  color: var(--tg-color-text-1);
  margin-bottom: 20px;
}

h2 {
  color: var(--tg-color-text-1);
  margin-bottom: 15px;
  font-size: 16px;
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

.platform-selector {
  margin-bottom: 15px;
}
</style>
