<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

const components = [
  {
    title: "思源笔记测试",
    path: "/test/siyuan",
  },
  {
    title: "博客园测试",
    path: "/test/cnblogs",
  },
  {
    title: "WordPress测试",
    path: "/test/wordpress",
  },
  {
    title: "Typecho测试",
    path: "/test/typecho",
  },
  {
    title: "语雀测试",
    path: "/test/yuque",
  },
  {
    title: "知乎测试",
    path: "/test/zhihu",
  },
  {
    title: "CSDN测试",
    path: "/test/csdn",
  },
  {
    title: "Picgo测试",
    path: "/test/picgo",
  },
  {
    title: "其他测试",
    path: "/test/other",
  },
  {
    title: "ChatGPT测试",
    path: "/test/chat",
  },
]

const handleGoTest = async (item: any) => {
  await router.push({
    path: item.path,
    query: { showBack: "true" },
  })
}
</script>

<template>
  <back-page title="组件测试">
    <div id="test-list" class="test-list-container">
      <el-button v-for="item in components" @click="handleGoTest(item)" type="primary" size="large" class="test-button">
        {{ item.title }}
      </el-button>
    </div>
  </back-page>
</template>

<style scoped lang="stylus">
.test-list-container
  margin-top 16px
  display flex
  flex-wrap wrap
  justify-content flex-start
  :deep(.el-button+.el-button)
    margin-left 0

.test-button
  margin-right 8px
  margin-left 0
  margin-bottom 10px
</style>
