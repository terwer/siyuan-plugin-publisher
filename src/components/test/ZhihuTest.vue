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
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { reactive, ref } from "vue"
import { AppInstance } from "~/src/appInstance.ts"
import Adaptors from "~/src/adaptors"
import { Utils } from "~/src/utils/utils.ts"

const logger = createAppLogger("zhihu-test")

const params = ref("{}")
const showParamFile = ref(false)
const paramFile = ref(null)
const logMessage = ref("")
const isLoading = ref(false)

const methodOption = ref("getMetaData")
const METHOD_GET_META_DATA = "getMetaData"
const methodOptions = reactive({
  options: [
    {
      value: METHOD_GET_META_DATA,
      label: "获取元数据信息",
    },
  ],
})

const onMethodChange = (val: string) => {
  showParamFile.value = false

  switch (val) {
    case METHOD_GET_META_DATA: {
      params.value = "{}"
      break
    }
    default: {
      params.value = "{}"
      break
    }
  }
}

const onImageSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    paramFile.value = input.files[0]
  }
}

const zhihuHandleApi = async () => {
  isLoading.value = true
  logMessage.value = ""
  logMessage.value = "zhihu requesting..."
  try {
    // appInstance
    const appInstance = new AppInstance()
    logger.info("appInstance=>", appInstance)

    switch (methodOption.value) {
      case METHOD_GET_META_DATA: {
        const key = "custom_Zhihu"
        const zhihuApiAdaptor = await Adaptors.getAdaptor(key)
        const zhihuApi = Utils.webApi(appInstance, zhihuApiAdaptor)
        const result = await zhihuApi.getMetaData()
        logMessage.value = JSON.stringify(result)
        logger.info("zhihu meta data=>", result)
        break
      }
      default:
        break
    }

    isLoading.value = false
  } catch (e) {
    logMessage.value = e
    logger.error(e)
    isLoading.value = false
  }
}
</script>

<template>
  <div id="zhihu-test">
    <div class="method-list">
      <el-select v-model="methodOption" class="m-2" placeholder="请选择方法名称" @change="onMethodChange">
        <el-option v-for="item in methodOptions.options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div class="item">
      <el-button type="primary" :loading="isLoading" @click="zhihuHandleApi">开始测试zhihu</el-button>
    </div>

    <div class="item"><el-button>入参</el-button></div>
    <div class="item"><el-input v-model="params" type="textarea" :rows="5"></el-input></div>
    <div v-if="showParamFile" class="item"><input type="file" @change="onImageSelect" /></div>

    <div class="item"><el-button>结果</el-button></div>
    <div class="item">
      <el-input v-model="logMessage" type="textarea" :rows="10" placeholder="日志信息"></el-input>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
#zhihu-test
  margin 16px 20px
  .item
    margin-bottom 8px

.method-list
  margin-bottom 16px
</style>
