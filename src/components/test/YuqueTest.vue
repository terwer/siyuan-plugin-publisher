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
import { AppInstance } from "~/src/appInstance.ts"
import { Utils } from "~/src/utils/utils.ts"
import { reactive, ref } from "vue"
import { fileToBuffer } from "~/src/utils/polyfillUtils.ts"
import { SimpleXmlRpcClient } from "simple-xmlrpc"
import { MediaObject } from "zhi-blog-api"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { Base64 } from "js-base64"
import { CommonFetchClient } from "zhi-fetch-middleware"
import { YuqueConfig } from "~/src/adaptors/api/yuque/yuqueConfig.ts"
import { YuqueApiAdaptor } from "~/src/adaptors/api/yuque/yuqueApiAdaptor.ts"
import Adaptors from "~/src/adaptors"

const logger = createAppLogger("yuque-test")

const params = ref("{}")
const showParamFile = ref(false)
const paramFile = ref(null)
const logMessage = ref("")
const isLoading = ref(false)

const methodOption = ref("getUsersBlogs")
const METHOD_GET_USERS_BLOGS = "getUsersBlogs"
const METHOD_GET_RECENT_POSTS_COUNT = "getRecentPostsCount"
const METHOD_GET_RECENT_POSTS = "getRecentPosts"
const METHOD_NEW_POST = "newPost"
const METHOD_GET_POST = "getPost"
const METHOD_EDIT_POST = "editPost"
const METHOD_DELETE_POST = "deletePost"
const METHOD_GET_CATEGORIES = "getCategories"
const METHOD_GET_PREVIEW_URL = "getPreviewUrl"
const METHOD_NEW_MEDIA_OBJECT = "newMediaObject"
const methodOptions = reactive({
  options: [
    {
      value: METHOD_GET_USERS_BLOGS,
      label: "获取博客信息",
    },
    {
      value: METHOD_GET_RECENT_POSTS_COUNT,
      label: "获取最新文章数目",
    },
    {
      value: METHOD_GET_RECENT_POSTS,
      label: "获取最新文章列表",
    },
    {
      value: METHOD_NEW_POST,
      label: "发布文章",
    },
    {
      value: METHOD_GET_POST,
      label: "获取文章详情",
    },
    {
      value: METHOD_EDIT_POST,
      label: "编辑文章",
    },
    {
      value: METHOD_DELETE_POST,
      label: "删除文章",
    },
    {
      value: METHOD_GET_CATEGORIES,
      label: "获取分类列表",
    },
    {
      value: METHOD_GET_PREVIEW_URL,
      label: "获取文章预览地址",
    },
    {
      value: METHOD_NEW_MEDIA_OBJECT,
      label: "上传资源文件",
    },
  ],
})

const onMethodChange = (val: string) => {
  showParamFile.value = false

  switch (val) {
    case METHOD_GET_USERS_BLOGS: {
      params.value = "{}"
      break
    }
    case METHOD_GET_RECENT_POSTS_COUNT: {
      params.value = "{}"
      break
    }
    case METHOD_GET_RECENT_POSTS: {
      params.value = JSON.stringify({
        numOfPosts: 10,
      })
      break
    }
    case METHOD_NEW_POST: {
      params.value = JSON.stringify({
        title: "自动发布的测试标题",
        description: "自动发布的测试内容",
        mt_keywords: "标签1,标签2",
        categories: ["分类1", "分类2"],
        // dateCreated: new Date(),
      })
      break
    }
    case METHOD_GET_POST: {
      params.value = JSON.stringify({
        postid: "20230526221603-3mgotyw",
      })
      break
    }
    case METHOD_EDIT_POST: {
      params.value = JSON.stringify({
        postid: "20230527202519-k09a4gx",
        post: {
          title: "自动发布的测试标题2",
          description: "自动发布的测试内容2",
          mt_keywords: "标签1,标签2",
          categories: ["分类1", "分类2"],
          // dateCreated: new Date(),
        },
      })
      break
    }
    case METHOD_DELETE_POST: {
      params.value = JSON.stringify({
        postid: "20230528192554-mlcxbe8",
      })
      break
    }
    case METHOD_GET_CATEGORIES: {
      params.value = "{}"
      break
    }
    case METHOD_GET_PREVIEW_URL: {
      params.value = JSON.stringify({
        postid: "20230528192554-mlcxbe8",
      })
      break
    }
    case METHOD_NEW_MEDIA_OBJECT: {
      params.value = "{}"
      showParamFile.value = true
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

const yuqueHandleApi = async () => {
  isLoading.value = true
  logMessage.value = ""
  logMessage.value = "yuque requesting..."
  try {
    // appInstance
    const appInstance = new AppInstance()
    logger.info("appInstance=>", appInstance)

    switch (methodOption.value) {
      case METHOD_GET_USERS_BLOGS: {
        const key = "common_Yuque"
        const yuqueApiAdaptor = await Adaptors.getAdaptor(key)
        const yuqueApi = Utils.blogApi(appInstance, yuqueApiAdaptor)
        const result = await yuqueApi.getUsersBlogs()
        logMessage.value = JSON.stringify(result)
        logger.info("yuque users blogs=>", result)
        break
      }
      case METHOD_GET_RECENT_POSTS_COUNT: {
        break
      }
      case METHOD_GET_RECENT_POSTS: {
        break
      }
      case METHOD_NEW_POST: {
        break
      }
      case METHOD_GET_POST: {
        break
      }
      case METHOD_EDIT_POST: {
        break
      }
      case METHOD_DELETE_POST: {
        break
      }
      case METHOD_GET_CATEGORIES: {
        break
      }
      case METHOD_GET_PREVIEW_URL: {
        break
      }
      case METHOD_NEW_MEDIA_OBJECT: {
        const file = paramFile.value
        const bits = await fileToBuffer(file)
        const mediaObject = new MediaObject(file.name, file.type, bits)
        logger.info("mediaObject=>", mediaObject)

        // 设置文件的元数据
        const metadata = {
          name: mediaObject.name,
          type: mediaObject.type,
          bits: mediaObject.bits,
          overwrite: true,
        }
        const xmlrpcApiUrl = "http://127.0.0.1:3000/xmlrpc.php"
        const client = new SimpleXmlRpcClient(xmlrpcApiUrl, "", {})
        const result = await client.methodCall("metaWeblog.newMediaObject", ["", "terwer", "123456", metadata])
        logMessage.value = JSON.stringify(result)
        logger.info("yuque new mediaObject result=>", result)
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
  <div id="yuque-test">
    <div class="method-list">
      <el-select v-model="methodOption" class="m-2" placeholder="请选择方法名称" @change="onMethodChange">
        <el-option v-for="item in methodOptions.options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div class="item">
      <el-button type="primary" :loading="isLoading" @click="yuqueHandleApi">开始测试yuque</el-button>
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
#yuque-test
  margin 16px 20px
  .item
    margin-bottom 8px

.method-list
  margin-bottom 16px
</style>
