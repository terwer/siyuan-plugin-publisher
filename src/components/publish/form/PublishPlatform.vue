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
import { onMounted, reactive } from "vue"
import { JsonUtil, StrUtil } from "zhi-common"
import { DynamicConfig, DynamicJsonCfg, getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { svgIcons } from "../../../utils/svgIcons.ts"
import { pre } from "~/src/platforms/pre.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import CrossPageUtils from "~/cross/crossPageUtils.ts"

const logger = createAppLogger("publish-platform")

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
})

// uses
const { getSetting } = usePublishSettingStore()

// datas
const sysKeys = pre.systemCfg.map((item) => {
  return item.platformKey
})
const formData = reactive({
  dynamicConfigArray: [] as DynamicConfig[],

  selectedKeys: <string[]>[].concat(sysKeys),
})

const emit = defineEmits(["emitSyncDynList"])

if (emit) {
  logger.info("selectedKeys=>", formData.selectedKeys)
  emit("emitSyncDynList", formData.selectedKeys)
}
const handleCheck = (key: string) => {
  if (formData.selectedKeys.includes(key)) {
    // 如果 formData.selectedKeys 数组中包含 key，则从数组中删除 key
    formData.selectedKeys = formData.selectedKeys?.filter((item: string) => item !== key) ?? []
  } else {
    // 如果 formData.selectedKeys 数组中不包含 key，则将其添加到数组中
    formData.selectedKeys.push(key)
  }

  if (emit) {
    logger.info("selectedKeys=>", formData.selectedKeys)
    emit("emitSyncDynList", formData.selectedKeys)
  }
}

onMounted(async () => {
  const setting = await getSetting()
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  // 过滤出已启用并且配置可用的平台
  const enabledConfigs = dynJsonCfg.totalCfg?.filter(
    (config: DynamicConfig) => config.isEnabled === true && config.isAuth === true
  )
  // 默认展示通用平台
  formData.dynamicConfigArray = enabledConfigs || []
  // 检测是否已经发布
  const postMeta = setting[props.id] ?? {}
  formData.dynamicConfigArray.forEach((item) => {
    const key = item.platformKey
    const posidKey = getDynPostidKey(key)
    if (!StrUtil.isEmptyString(posidKey)) {
      const postid = postMeta[posidKey] ?? ""
      if (!StrUtil.isEmptyString(postid)) {
        handleCheck(key)
      }
    }
  })
})
</script>

<template>
  <div>
    <p>请选择要发布的平台：</p>
    <div class="syp-distri-platform-container">
      <a v-for="cfg in formData.dynamicConfigArray" class="distri-item" @click="handleCheck(cfg.platformKey)">
        <el-tooltip :content="CrossPageUtils.longPlatformName(cfg.platformName, 20)" placement="bottom">
          <el-icon class="platform-icon">
            <span v-html="cfg.platformIcon"></span>
          </el-icon>
        </el-tooltip>
        <span
          v-if="formData.selectedKeys.includes(cfg.platformKey)"
          class="icon-yes"
          v-html="svgIcons.iconOTYes"
        ></span>
        <span v-else class="icon-no" v-html="svgIcons.iconOTNo"></span>
      </a>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.syp-distri-platform-container
  .distri-item
    height 20px
    margin-right 10px
    width 80px
    .platform-icon
      color var(--el-color-primary)
      display inline-block
      width 24px
      height 30px
      cursor pointer
      :deep(svg)
        color var(--el-color-primary)
        width 32px
        height 30px
</style>
