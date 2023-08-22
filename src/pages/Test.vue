<!--
  - Copyright (c) 2023, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
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
    <div id="test-list">
      <el-button v-for="item in components" @click="handleGoTest(item)" type="primary" size="large">
        {{ item.title }}
      </el-button>
    </div>
  </back-page>
</template>

<style scoped lang="stylus">
#test-list
  margin 16px 20px
</style>
