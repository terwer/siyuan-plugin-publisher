<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面未找到</p>
    <router-link to="/" class="back-home">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
// NotFound page component
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #666;
}

p {
  font-size: 1.5rem;
  color: #666;
  margin: 1rem 0 2rem;
}

.back-home {
  padding: 0.5rem 1rem;
  background-color: #007aff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-home:hover {
  background-color: #0056b3;
}
</style> 