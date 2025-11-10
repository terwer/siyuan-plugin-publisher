<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { reactive, ref } from "vue"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import Adaptors from "~/src/adaptors"
import { Utils } from "~/src/utils/utils.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const logger = createAppLogger("zhihu-test")

// uses
const { t } = useVueI18n()

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
    const appInstance = new PublisherAppInstance()
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
    logger.error(t("main.opt.failure") + "=>", e)
    isLoading.value = false
  }
}
</script>

<template>
  <back-page title="知乎测试">
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
  </back-page>
</template>

<style lang="stylus" scoped>
#zhihu-test
  margin 16px 20px
  .item
    margin-bottom 8px

.method-list
  margin-bottom 16px
</style>
