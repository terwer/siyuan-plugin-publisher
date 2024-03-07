<!--
  - Copyright (c) 2024, Terwer . All rights reserved.
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
import { DynamicConfig, DynamicJsonCfg } from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { JsonUtil } from "zhi-common"
import { onMounted, reactive, ref } from "vue"
import { SypConfig } from "~/syp.config.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { usePlatformDefine } from "~/src/composables/usePlatformDefine.ts"

const logger = createAppLogger("publish-platform-import")

// uses
const { getSetting } = usePublishSettingStore()
const { platformTypeList } = usePlatformDefine()

// datas
const selectPlatformGroup = ref("all")
const formData = reactive({
  setting: {} as typeof SypConfig,

  dynamicConfigArray: [] as DynamicConfig[],

  // store
  platformTypeList: platformTypeList as { type: string; title: string; img: string; description: string }[],
})

// methods
const handleSelectPlformGroup = (gType: string) => {
  selectPlatformGroup.value = gType
}

// init
const initPage = async () => {
  formData.setting = await getSetting()
  logger.info("get setting from platform setting", formData.setting)

  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(formData.setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  // 默认展示通用平台
  formData.dynamicConfigArray = dynJsonCfg?.totalCfg || []
  logger.debug("store dynamic init page=>", formData.dynamicConfigArray)
}

// lifecycles
onMounted(async () => {
  await initPage()
})
</script>

<template>
  <div>
    <el-radio-group v-model="selectPlatformGroup" style="margin-bottom: 30px" :key="selectPlatformGroup">
      <el-radio-button key="all" value="all" @click="handleSelectPlformGroup('all')">全部</el-radio-button>
      <!--
      <el-popover
        v-for="item in platformTypeList"
        :key="item.type"
        placement="top-start"
        :title="item.title"
        :width="200"
        trigger="hover"
        :content="item.description"
      >
        <template #reference>
          <el-radio-button :key="item.type" :value="item.type" @click="handleSelectPlformGroup(item.type)">
            {{ item.title }}
          </el-radio-button>
        </template>
      </el-popover>
      -->
      <el-radio-button
        v-for="item in platformTypeList"
        :key="item.type"
        :value="item.type"
        @click="handleSelectPlformGroup(item.type)"
      >
        {{ item.title }}
      </el-radio-button>
    </el-radio-group>

    <platform-quick-add :api-type="selectPlatformGroup" />
  </div>
</template>

<style scoped lang="stylus"></style>
