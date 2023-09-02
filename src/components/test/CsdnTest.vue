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
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import Adaptors from "~/src/adaptors"
import { Utils } from "~/src/utils/utils.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const logger = createAppLogger("csdn-test")

// uses
const { t } = useVueI18n()

const params = ref("{}")
const showParamFile = ref(false)
const paramFile = ref(null)
const logMessage = ref("")
const isLoading = ref(false)

const methodOption = ref("getMetaData")
const METHOD_GET_META_DATA = "getMetaData"
const METHOD_GET_USERS_BLOGS = "getUsersBlogs"
const methodOptions = reactive({
  options: [
    {
      value: METHOD_GET_META_DATA,
      label: "获取元数据信息",
    },
    {
      value: METHOD_GET_USERS_BLOGS,
      label: "获取博客信息",
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
    case METHOD_GET_USERS_BLOGS: {
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

const csdnHandleApi = async () => {
  isLoading.value = true
  logMessage.value = ""
  logMessage.value = "csdn requesting..."
  try {
    // appInstance
    const appInstance = new PublisherAppInstance()
    logger.info("appInstance=>", appInstance)

    switch (methodOption.value) {
      case METHOD_GET_META_DATA: {
        const key = "custom_Csdn"
        const csdnApiAdaptor = await Adaptors.getAdaptor(key)
        const csdnApi = Utils.webApi(appInstance, csdnApiAdaptor)
        const result = await csdnApi.getMetaData()
        logMessage.value = JSON.stringify(result)
        logger.info("csdn meta data=>", result)
        break
      }
      case METHOD_GET_USERS_BLOGS: {
        const key = "custom_Csdn"
        const csdnApiAdaptor = await Adaptors.getAdaptor(key)
        const csdnApi = Utils.webApi(appInstance, csdnApiAdaptor)
        const result = await csdnApi.getUsersBlogs()
        logMessage.value = JSON.stringify(result)
        logger.info("csdn users blogs=>", result)
        break
      }
      default:
        break
    }

    isLoading.value = false
  } catch (e) {
    logMessage.value = e
    logger.error(t("main.opt.failure") + "=>", e)
    isLoading.value = false
  }
}
</script>

<template>
  <back-page title="CSDN测试">
    <div id="csdn-test">
      <div class="method-list">
        <el-select v-model="methodOption" class="m-2" placeholder="请选择方法名称" @change="onMethodChange">
          <el-option v-for="item in methodOptions.options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>

      <div class="item">
        <el-button type="primary" :loading="isLoading" @click="csdnHandleApi">开始测试csdn</el-button>
      </div>

      <div class="item"><el-button>入参</el-button></div>
      <div class="item"><el-input v-model="params" type="textarea" :rows="5"></el-input></div>
      <div v-if="showParamFile" class="item"><input type="file" @change="onImageSelect" /></div>

      <div class="item"><el-button>结果</el-button></div>
      <div class="item">
        <el-input v-model="logMessage" type="textarea" :rows="10" placeholder="日志信息"></el-input>
      </div>
    </div>
  </back-page>
</template>

<style lang="stylus" scoped>
#csdn-test
  margin 16px 20px
  .item
    margin-bottom 8px

.method-list
  margin-bottom 16px
</style>
