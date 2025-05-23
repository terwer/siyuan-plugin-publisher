<template>
  <div class="siyuan-publisher">
    <header class="siyuan-publisher__header">
      <h1>思源笔记发布工具</h1>
    </header>
    <main class="siyuan-publisher__main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style>
.siyuan-publisher {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--b3-theme-background);
  color: var(--b3-theme-on-surface);
}

.siyuan-publisher__header {
  padding: 16px;
  background-color: var(--b3-theme-surface);
  border-bottom: 1px solid var(--b3-theme-outline);
}

.siyuan-publisher__header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
}

.siyuan-publisher__main {
  flex: 1;
  padding: 24px;
}
</style>
