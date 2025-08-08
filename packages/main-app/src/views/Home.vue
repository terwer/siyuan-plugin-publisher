<template>
  <div class="home">
    <h1>思源笔记发布插件</h1>
    <div class="content">
      <p>欢迎使用思源笔记发布插件，这是一个帮助您将思源笔记内容发布到各种平台的工具。</p>
      
      <div class="features">
        <h2>主要功能</h2>
        <ul>
          <li>支持多种平台发布（WordPress、GitHub、博客等）</li>
          <li>智能内容转换和格式化</li>
          <li>图片自动处理和上传</li>
          <li>模板系统支持</li>
          <li>发布历史管理</li>
        </ul>
      </div>

      <div class="quick-start">
        <h2>快速开始</h2>
        <ol>
          <li>在"设置"页面配置您的发布平台</li>
          <li>在"发布"页面选择要发布的内容</li>
          <li>选择目标平台并配置发布选项</li>
          <li>点击发布按钮完成发布</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home page component
</script>

<style scoped>
.home {
  padding: 20px;
}

.content {
  max-width: 800px;
}

h1 {
  color: var(--tg-color-text-1);
  margin-bottom: 20px;
}

h2 {
  color: var(--tg-color-text-1);
  margin-top: 30px;
  margin-bottom: 15px;
}

p {
  color: var(--tg-color-text-2);
  line-height: 1.6;
  margin-bottom: 15px;
}

.features ul {
  color: var(--tg-color-text-2);
  line-height: 1.6;
}

.features li {
  margin-bottom: 8px;
}

.quick-start ol {
  color: var(--tg-color-text-2);
  line-height: 1.6;
}

.quick-start li {
  margin-bottom: 8px;
}
</style>
