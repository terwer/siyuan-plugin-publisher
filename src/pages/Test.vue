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
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const router = useRouter()
const { t } = useVueI18n()

const components = [
  {
    titleKey: "test.siyuan",
    path: "/test/siyuan",
  },
  {
    titleKey: "test.cnblogs",
    path: "/test/cnblogs",
  },
  {
    titleKey: "test.wordpress",
    path: "/test/wordpress",
  },
  {
    titleKey: "test.typecho",
    path: "/test/typecho",
  },
  {
    titleKey: "test.yuque",
    path: "/test/yuque",
  },
  {
    titleKey: "test.zhihu",
    path: "/test/zhihu",
  },
  {
    titleKey: "test.csdn",
    path: "/test/csdn",
  },
  {
    titleKey: "test.picgo",
    path: "/test/picgo",
  },
  {
    titleKey: "test.other",
    path: "/test/other",
  },
  {
    titleKey: "test.chatgpt",
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
  <back-page :title="t('page.test.title')">
    <div id="test-list" class="test-list-container">
      <el-button v-for="item in components" @click="handleGoTest(item)" type="primary" size="large" class="test-button">
        {{ t(item.titleKey) }}
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
