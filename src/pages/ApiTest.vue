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
import { ref } from "vue"
import { ElTabPane, ElTabs, TabsPaneContext } from "element-plus"
import { useRouter } from "vue-router"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const logger = createAppLogger("api-test")
const router = useRouter()
const activeTab = ref<string>("siyuan")

const changeTab = (tab: TabsPaneContext, event: Event) => {
  const toRoute = `/test/${tab.paneName}`
  logger.info(`toRoute=>${toRoute}`)
  router.push({ path: toRoute })
}
</script>

<template>
  <div class="tab-container">
    <h1>ApiTest</h1>
    <el-tabs v-model="activeTab" type="border-card" @tab-click="changeTab">
      <el-tab-pane label="Siyuan" name="siyuan">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="Cnblogs" name="cnblogs">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="Wordpress" name="wordpress">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="Typecho" name="typecho">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="Yuque" name="yuque">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="Zhihu" name="zhihu">
        <router-view></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="stylus" scoped>
:deep(.el-tabs--border-card > .el-tabs__content)
  padding 0

.tab-container {
  margin: 0 20px;
}

.el-tabs__nav {
  border-bottom: none;
}

.el-tabs__item {
  margin: 0;
  padding: 16px;
  font-weight: normal;
  color: #333;
  border-radius: 4px 4px 0 0;
  border-bottom: 2px solid transparent;
}

.el-tabs__item.is-active {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}

.el-tabs__pane {
  padding: 16px;
}
</style>
