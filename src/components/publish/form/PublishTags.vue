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
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { nextTick, onMounted, reactive, ref, watch } from "vue"
import { ElMessage } from "element-plus"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { prompt, TagAIResult } from "~/src/ai/prompt.ts"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import Adaptors from "~/src/adaptors"
import { ITagConfig } from "~/src/types/ITagConfig.ts"
import { TagInfo } from "zhi-blog-api"

const logger = createAppLogger("publish-tags")
const { t } = useVueI18n()

const props = defineProps({
  useAi: {
    type: Boolean,
    default: false,
  },
  pageId: {
    type: String,
    default: "",
  },
  tags: {
    type: String,
    default: "",
  },
  tagConfig: {
    type: Object as () => ITagConfig,
    default: {} as ITagConfig,
  },
  md: {
    type: String,
    default: "",
  },
  html: {
    type: String,
    default: "",
  },
})

// datas
const tagRefInput = ref()
const formData = reactive({
  isTagLoading: false,
  useAi: props.useAi,
  pageId: props.pageId,
  tagConfig: props.tagConfig,
  tag: {
    inputValue: "",
    dynamicTags: <string[]>(StrUtil.isEmptyString(props.tags) ? [] : props.tags.split(",")),
    platformTags: [],
    inputVisible: false,
    selectVisible: true,
  },
  md: props.md,
  html: props.html,
})

watch(
  () => props.useAi,
  (newValue) => {
    formData.useAi = newValue
  }
)

watch(
  () => props.html,
  (newValue) => {
    formData.html = newValue
  }
)

const emit = defineEmits(["emitSyncTags"])

const tagMethods = {
  handleTagClose: (tag: any) => {
    formData.tag.dynamicTags.splice(formData.tag.dynamicTags.indexOf(tag), 1)
    // 这里不需要，平台列表是个全集
    // // 检查平台标签数组中是否包含输入值，如果不包含则删除对应的项
    // if (!formData.tag.platformTags.some((item) => item.value === formData.tag.inputValue)) {
    //   // 构造要删除的项
    //   const itemToRemove = {
    //     value: formData.tag.inputValue,
    //     label: formData.tag.inputValue,
    //   }
    //
    //   // 通过过滤不等于要删除项的方式，更新平台标签数组
    //   formData.tag.platformTags = formData.tag.platformTags.filter((item) => item.value !== itemToRemove.value)
    // }

    emit("emitSyncTags", formData.tag.dynamicTags)
  },
  tagShowInput: () => {
    formData.tag.inputVisible = true
    nextTick(() => {
      tagRefInput.value!.input!.focus()
    })
  },
  tagShowSelect: () => {
    formData.tag.selectVisible = !formData.tag.selectVisible
  },
  handleTagInputConfirm: () => {
    if (formData.tag.inputValue) {
      if (!formData.tag.dynamicTags.includes(formData.tag.inputValue)) {
        formData.tag.dynamicTags.push(formData.tag.inputValue)
      }
      if (!formData.tag.platformTags.includes(formData.tag.inputValue)) {
        formData.tag.platformTags.push({
          value: formData.tag.inputValue,
          label: formData.tag.inputValue,
        })
      }

      emit("emitSyncTags", formData.tag.dynamicTags)
    }
    formData.tag.inputVisible = false
    formData.tag.inputValue = ""
  },
  fetchTag: async () => {
    try {
      formData.isTagLoading = true

      const inputWord = prompt.tagPrompt.content
      const { chat, getChatInput } = useChatGPT()
      const chatText = await chat(inputWord, {
        name: "tags",
        systemMessage: getChatInput(formData?.md, formData.html),
      })
      if (StrUtil.isEmptyString(chatText)) {
        ElMessage.error("请求错误，请在偏好设置配置请求地址和ChatGPT key！")
        return
      }
      const resJson = JsonUtil.safeParse<TagAIResult>(chatText, {} as TagAIResult)
      if (!resJson?.tags || resJson?.tags.length == 0) {
        throw new Error("文档信息量太少，未能抽取有效信息")
      }
      for (let i = 0; i < resJson.tags.length; i++) {
        if (!formData.tag.dynamicTags.includes(resJson.tags[i])) {
          formData.tag.dynamicTags.push(resJson.tags[i])
        }
      }
      logger.info("使用AI智能生成的标签结果 =>", {
        inputWord: inputWord,
        chatText: chatText,
      })

      // const hotTags = await SmartUtil.autoTags(formData.html, 5)
      // for (let i = 0; i < hotTags.length; i++) {
      //   if (!formData.tag.dynamicTags.includes(hotTags[i])) {
      //     formData.tag.dynamicTags.push(hotTags[i])
      //   }
      // }
      emit("emitSyncTags", formData.tag.dynamicTags)
      ElMessage.success("使用人工智能智能提取标签成功")
    } catch (e: any) {
      logger.error(t("main.opt.failure") + "=>", e)
      ElMessage.error(t("main.opt.failure") + "=>" + e)
    } finally {
      formData.isTagLoading = false
    }
  },
  onPlatformTagChange: (val: string) => {
    const value = val
    logger.debug("选中项已改变 =>", value)

    emit("emitSyncTags", formData.tag.dynamicTags)
  },
}

const initPage = async () => {
  if (formData?.tagConfig?.cfg && formData?.tagConfig?.apiType) {
    const cfg = formData?.tagConfig?.cfg
    const api = await Adaptors.getAdaptor(formData?.tagConfig?.apiType, cfg)
    const tagInfoList = await api.getTags()
    // 映射数据
    formData.tag.platformTags = tagInfoList.map((item: TagInfo) => ({
      value: item.tagName,
      label: item.tagName,
    }))
    logger.debug("getTags for platforms", formData.tag.platformTags)
  } else {
    logger.warn("tagConfig not found, ignore tags")
  }
}

onMounted(async () => {
  await initPage()
})
</script>

<template>
  <div class="form-tags">
    <el-form-item :label="t('main.tag')">
      <el-tag
        v-for="tag in formData.tag.dynamicTags"
        :key="tag"
        :disable-transitions="false"
        class="mx-1 pub-tag"
        closable
        @close="tagMethods.handleTagClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if="formData.tag.inputVisible"
        ref="tagRefInput"
        v-model="formData.tag.inputValue"
        class="ml-1 w-20 pub-tag-input"
        size="small"
        @blur="tagMethods.handleTagInputConfirm"
        @keyup.enter="tagMethods.handleTagInputConfirm"
      />
      <el-button v-else class="button-new-tag ml-1 el-tag" size="small" @click="tagMethods.tagShowInput">
        {{ t("main.tag.new") }}
      </el-button>
      <el-button
        v-if="formData.tag.platformTags.length > 0"
        class="button-new-tag ml-1 el-tag"
        size="small"
        @click="tagMethods.tagShowSelect"
      >
        {{ formData.tag.selectVisible ? t("main.tag.close") : t("main.tag.select") }}
      </el-button>
    </el-form-item>
    <el-form-item v-if="formData.tag.platformTags.length > 0 && formData.tag.selectVisible">
      <el-tree-select
        v-model="formData.tag.dynamicTags"
        style="width: 100%"
        :data="formData.tag.platformTags"
        multiple
        :check-on-click-node="true"
        :render-after-expand="false"
        show-checkbox
        :placeholder="t('main.tag.select')"
        :empty-text="t('main.tag.empty')"
        :no-data-text="t('main.tag.empty')"
        @node-click="tagMethods.onPlatformTagChange"
        @check="tagMethods.onPlatformTagChange"
        @change="tagMethods.onPlatformTagChange"
      >
      </el-tree-select>
    </el-form-item>
    <el-form-item v-if="formData.useAi">
      <el-button size="small" :loading="formData.isTagLoading" type="primary" @click="tagMethods.fetchTag">
        {{ formData.isTagLoading ? t("main.opt.loading") : t("main.auto.fetch.tag") }}
      </el-button>
    </el-form-item>
  </div>
</template>

<style lang="stylus" scoped>
.form-tags
  :deep(.pub-tag)
    margin-right 10px

  :deep(.pub-tag-input)
    max-width 120px
</style>
