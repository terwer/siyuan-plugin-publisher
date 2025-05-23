<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/" class="nav-item">首页</router-link>
      <router-link to="/publish" class="nav-item">发布</router-link>
      <router-link to="/settings" class="nav-item">设置</router-link>
    </nav>
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
// App component
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.nav {
  background-color: #f5f5f5;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.nav-item {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.nav-item:hover {
  background-color: #e0e0e0;
}

.nav-item.router-link-active {
  background-color: #007AFF;
  color: white;
}

.main {
  flex: 1;
  overflow-y: auto;
}
</style>
