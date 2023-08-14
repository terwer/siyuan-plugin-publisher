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
import { MediaObject, Post } from "zhi-blog-api"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import Adaptors from "~/src/adaptors"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { base64ToBuffer, remoteImageToBase64Info } from "~/src/utils/polyfillUtils.ts"

const logger = createAppLogger("cnblogs-test")

const { t } = useVueI18n()

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
        postid: "17593464",
      })
      break
    }
    case METHOD_EDIT_POST: {
      params.value = JSON.stringify({
        postid: "17593464",
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
        postid: "17593463",
      })
      break
    }
    case METHOD_GET_CATEGORIES: {
      params.value = "{}"
      break
    }
    case METHOD_GET_PREVIEW_URL: {
      params.value = JSON.stringify({
        postid: "17243968",
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

const cnblogsHandleApi = async () => {
  isLoading.value = true
  logMessage.value = ""
  logMessage.value = "cnblogs requesting..."
  try {
    // appInstance
    const appInstance = new AppInstance()
    logger.info("appInstance=>", appInstance)

    switch (methodOption.value) {
      case METHOD_GET_USERS_BLOGS: {
        const key = "metaweblog_Cnblogs"
        const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        logger.info("cnblogsApi=>", cnblogsApi)
        const result = await cnblogsApi.getUsersBlogs()
        logMessage.value = JSON.stringify(result)
        logger.info("cnblogs users blogs=>", result)

        // const key = "metaweblog_Cnblogs"
        // const cfg = await Adaptors.getCfg(key)
        // const { proxyXmlrpc } = useProxy(cfg.middlewareUrl)
        //
        // const result = await proxyXmlrpc(cfg.apiUrl, "blogger.getUsersBlogs", ["", cfg.username, cfg.password])
        // logMessage.value = JSON.stringify(result)
        // logger.info("cnblogs users blogs=>", result)
        break
      }
      case METHOD_GET_RECENT_POSTS_COUNT: {
        const key = "metaweblog_Cnblogs"
        const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        logger.info("cnblogsApi=>", cnblogsApi)
        const result = await cnblogsApi.getRecentPostsCount()
        logMessage.value = JSON.stringify(result)
        logger.info("cnblogs getRecentPostsCount=>", result)
        break
      }
      case METHOD_GET_RECENT_POSTS: {
        const key = "metaweblog_Cnblogs"
        const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        logger.info("cnblogsApi=>", cnblogsApi)
        const result = await cnblogsApi.getRecentPosts(10)
        logMessage.value = JSON.stringify(result)
        logger.info("cnblogs getRecentPosts=>", result)
        break
      }
      case METHOD_NEW_POST: {
        const paramsValue = JSON.parse(params.value)
        let post = new Post()
        post = {
          ...post,
          ...paramsValue,
        }
        const key = "metaweblog_Cnblogs"
        const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        const result = await cnblogsApi.newPost(post)
        logMessage.value = JSON.stringify(result)
        logger.info("cnblogs newPost=>", result)
        break
      }
      case METHOD_GET_POST: {
        const key = "metaweblog_Cnblogs"
        const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        logger.info("cnblogsApi=>", cnblogsApi)
        const paramsValue = JSON.parse(params.value)
        const postid = paramsValue.postid
        const result = await cnblogsApi.getPost(postid)
        logMessage.value = JSON.stringify(result)
        logger.info("cnblogs getPost=>", result)
        break
      }
      case METHOD_EDIT_POST: {
        const key = "metaweblog_Cnblogs"
        const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        logger.info("cnblogsApi=>", cnblogsApi)
        const paramsValue = JSON.parse(params.value)
        const postid = paramsValue.postid
        let post = new Post()
        post = {
          ...post,
          ...paramsValue.post,
        }
        const result = await cnblogsApi.editPost(postid, post)
        logMessage.value = JSON.stringify(result)
        break
      }
      case METHOD_DELETE_POST: {
        const key = "metaweblog_Cnblogs"
        const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        logger.info("cnblogsApi=>", cnblogsApi)
        const paramsValue = JSON.parse(params.value)
        const postid = paramsValue.postid
        const result = await cnblogsApi.deletePost(postid)
        logMessage.value = JSON.stringify(result)
        break
      }
      case METHOD_GET_CATEGORIES: {
        const key = "metaweblog_Cnblogs"
        const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        logger.info("cnblogsApi=>", cnblogsApi)
        const result = await cnblogsApi.getCategories()
        logMessage.value = JSON.stringify(result)
        logger.info("cnblogs getCategories=>", result)
        break
      }
      case METHOD_GET_PREVIEW_URL: {
        const key = "metaweblog_Cnblogs"
        const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        logger.info("cnblogsApi=>", cnblogsApi)
        const paramsValue = JSON.parse(params.value)
        const postid = paramsValue.postid
        const result = await cnblogsApi.getPreviewUrl(postid)
        logMessage.value = JSON.stringify(result)
        logger.info("cnblogs getPreviewUrl=>", result)
        break
      }
      case METHOD_NEW_MEDIA_OBJECT: {
        // const key = "metaweblog_Cnblogs"
        //
        // const file = paramFile.value
        // const bits = await fileToBuffer(file)
        // const mediaObject = new MediaObject(file.name, file.type, bits)
        // logger.info("mediaObject=>", mediaObject)
        //
        // // 设置文件的元数据
        // const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        // const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        // logger.info("cnblogsApi=>", cnblogsApi)
        // const result = await cnblogsApi.newMediaObject(mediaObject)
        // logMessage.value = JSON.stringify(result)
        // logger.info("cnblogs new mediaObject result=>", result)

        // upload url
        const key = "metaweblog_Cnblogs"

        // 设置文件的元数据
        const cnblogsApiAdaptor = await Adaptors.getAdaptor(key)
        const cnblogsApi = Utils.blogApi(appInstance, cnblogsApiAdaptor)
        logger.info("cnblogsApi=>", cnblogsApi)

        const imageUrl = "https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/test/image-20230812091531-hibwr1g.png"
        const base64Info = await remoteImageToBase64Info(imageUrl)
        const imageBase64 = base64Info.imageBase64
        logger.debug("imageBase64=>", { imageBase64 })

        const bits = base64ToBuffer(imageBase64)
        logger.debug("bits=>", bits)
        const mediaObject = new MediaObject(base64Info.imageName, base64Info.mimeType, bits)
        logger.info("mediaObject=>", mediaObject)

        const result = await cnblogsApi.newMediaObject(mediaObject)
        logMessage.value = JSON.stringify(result)
        logger.info("cnblogs new mediaObject result=>", result)

        // SimpleXmlRpcClient
        // const key = "metaweblog_Cnblogs"
        //
        // const file = paramFile.value
        // const bits = await fileToBuffer(file)
        // const mediaObject = new MediaObject(file.name, file.type, bits)
        // logger.info("mediaObject=>", mediaObject)
        //
        // // 设置文件的元数据
        // const metadata = {
        //   name: mediaObject.name,
        //   type: mediaObject.type,
        //   bits: mediaObject.bits,
        //   overwrite: true,
        // }
        // const cfg = await Adaptors.getCfg(key)
        // const client = new SimpleXmlRpcClient(appInstance, cfg.apiUrl, {})
        // const result = await client.methodCall("metaWeblog.newMediaObject", ["", cfg.username, cfg.password, metadata])
        // logMessage.value = JSON.stringify(result)
        // logger.info("cnblogs new mediaObject result=>", result)

        // proxyXmlrpc
        // const key = "metaweblog_Cnblogs"
        // const cfg = await Adaptors.getCfg(key)
        // const { proxyXmlrpc } = useProxy(cfg.middlewareUrl)
        //
        // const file = paramFile.value
        // const bits = await fileToBuffer(file)
        // const mediaObject = new MediaObject(file.name, file.type, bits)
        // logger.info("mediaObject=>", mediaObject)
        //
        // // 设置文件的元数据
        // const metadata = {
        //   name: mediaObject.name,
        //   type: mediaObject.type,
        //   bits: mediaObject.bits,
        //   overwrite: true,
        // }
        // const result = await proxyXmlrpc(cfg.apiUrl, "metaWeblog.newMediaObject", [
        //   "",
        //   cfg.username,
        //   cfg.password,
        //   metadata,
        // ])
        // logMessage.value = JSON.stringify(result)
        // logger.info("cnblogs new mediaObject result=>", result)
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
  <div id="cnblogs-test">
    <div class="method-list">
      <el-select v-model="methodOption" class="m-2" placeholder="请选择方法名称" @change="onMethodChange">
        <el-option v-for="item in methodOptions.options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div class="item">
      <el-button type="primary" :loading="isLoading" @click="cnblogsHandleApi">开始测试cnblogs</el-button>
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
#cnblogs-test
  margin 16px 20px
  .item
    margin-bottom 8px

.method-list
  margin-bottom 16px
</style>
