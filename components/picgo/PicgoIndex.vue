<!--
  - Copyright (c) 2022-2023, Terwer . All rights reserved.
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

<template>
  <div class="picgo-body">
    <el-alert
      class="top-version-tip"
      :title="isElectron ? $t('picgo.siyuan.tip') : $t('picgo.chrome.tip')"
      type="info"
      :closable="false"
    />
    <!--
    <el-upload
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      v-model:file-list="fileList"
      class="upload-demo"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      list-type="picture"
    >
      <el-button type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">仅支持jpg/png，文件大小不能超过500kb</div>
      </template>
    </el-upload>
    -->
    <div class="upload-status">
      <el-button text :loading="isUploadLoading">上传状态</el-button>
    </div>
    <div class="upload-btn-list">
      <div
        class="upload-control"
        v-if="inSiyuan() || isInSiyuanNewWinBrowser()"
      >
        <label>
          <!-- 自定义的文件选择按钮 -->
          <label for="fileInput" class="custom-file-input">选择图片</label>

          <!-- 原有的文件选择按钮 -->
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg"
            @change="onRequest"
            multiple
            id="fileInput"
          />
        </label>
      </div>
      <div class="upload-control">
        <el-button type="primary" @click="doUploadPicFromClipboard"
          >剪贴板图片
        </el-button>
      </div>
    </div>
    <div class="one-local-to-bed">
      <el-button type="success">一键上传本地图片到图床</el-button>
    </div>
    <div class="one-bed-to-local">
      <el-button type="primary">一键下载远程图片到本地</el-button>
    </div>

    <ul class="file-list">
      <li
        class="file-list-item"
        v-for="f in fileList.files"
        v-bind:key="f.name"
      >
        <div><img :src="f.url" :alt="f.name" /></div>
        <div>
          <!-- 上传本地图片到图床 -->
          <el-tooltip
            v-if="f.isLocal"
            content="上传本地图片到图床"
            class="box-item"
            effect="light"
            placement="bottom"
            popper-class="publish-menu-tooltip"
          >
            <el-button>
              <font-awesome-icon icon="fa-solid fa-upload" />
            </el-button>
          </el-tooltip>

          <!-- 下载远程图片到本地 -->
          <el-tooltip
            v-if="!f.isLocal"
            content="下载远程图片到本地"
            class="box-item"
            effect="light"
            placement="bottom"
            popper-class="publish-menu-tooltip"
          >
            <el-button>
              <font-awesome-icon icon="fa-solid fa-download" />
            </el-button>
          </el-tooltip>

          <!-- 复制图片链接 -->
          <el-popover
            placement="bottom"
            :title="f.name"
            :width="popWidth"
            trigger="hover"
            :content="f.url"
          >
            <template #reference>
              <el-button @click="onImageUrlCopy(f.url)">
                <font-awesome-icon icon="fa-solid fa-file-lines" />
              </el-button>
            </template>
          </el-popover>

          <!-- 图片预览 -->
          <el-tooltip
            content="图片预览"
            class="box-item"
            effect="light"
            placement="bottom"
            popper-class="publish-menu-tooltip"
          >
            <el-button @click="handlePictureCardPreview(f.url)">
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </el-button>
          </el-tooltip>
        </div>
      </li>
    </ul>

    <div class="log-msg" v-if="showDebugMsg">
      <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 10 }"
        v-model="loggerMsg"
      />
    </div>

    <!-- 图片放大 -->
    <el-dialog v-model="dialogVisible">
      <img
        w-full
        :src="dialogImageUrl"
        alt="Preview Image"
        class="img-big-preview"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { LogFactory } from "~/utils/logUtil"
import { ElMessage } from "element-plus"
import { useI18n } from "vue-i18n"
import { uploadByPicGO } from "~/utils/otherlib/picgoUtil"
import { onMounted, reactive, ref, watch } from "vue"
import { getPageId, inSiyuan } from "~/utils/platform/siyuan/siyuanUtil"
import { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import {
  copyToClipboardInBrowser,
  isBrowser,
  isElectron,
} from "~/utils/browserUtil"
import { ImageParser } from "~/utils/parser/imageParser"
import { getSiyuanCfg } from "~/utils/platform/siyuan/siYuanConfig"
import { pathJoin } from "~/utils/util"

const logger = LogFactory.getLogger("components/picgo/PicgoIndex.vue")
const { t } = useI18n()
const siyuanApi = new SiYuanApi()
const imageParser = new ImageParser()
const isUploadLoading = ref(false)
const popWidth = ref(400)
const isDev = process.env.NODE_ENV === "development"
const showDebugMsg = ref(isDev)

const fileList = reactive({
  files: [],
})
const dialogImageUrl = ref("")
const dialogVisible = ref(false)
const loggerMsg = ref("")

// props
const props = defineProps({
  pageId: {
    type: String,
    default: undefined,
  },
})

/**
 * 处理图片后续
 * @param imgInfos
 */
const doAfterUpload = (imgInfos) => {
  loggerMsg.value = imgInfos

  const imageJson = JSON.parse(imgInfos)

  if (imageJson && imageJson.length > 0) {
    imageJson.forEach((img) => {
      const rtnItem = {
        name: img.fileName,
        url: img.imgUrl,
        isLocal: false,
      }
      loggerMsg.value += "\nnewItem=>" + JSON.stringify(rtnItem)

      fileList.files.push(rtnItem)
    })
  }
  ElMessage.success(t("main.opt.success"))
}

// const readBase64FromFile = async (file) => {
//   const reader = new FileReader()
//   reader.readAsDataURL(file)
//   const base64 = await new Promise((resolve, reject) => {
//     reader.onload = () => resolve(reader.result)
//     reader.onerror = (error) => reject(error)
//   })
//   return base64
// }

const onRequest = async (event) => {
  isUploadLoading.value = true

  try {
    const fileList = event.target.files

    console.log("onRequest fileList=>", fileList)
    if (!fileList || fileList.length === 0) {
      ElMessage.error("请选择图片")
      isUploadLoading.value = false
      return
    }

    if (!inSiyuan() && !isInSiyuanNewWinBrowser()) {
      ElMessage.error("非electron环境只能通过剪贴板上传")
      isUploadLoading.value = false
      return
    }

    // 获取选择的文件的路径数组
    const filePaths = []
    for (let i = 0; i < fileList.length; i++) {
      // const tmppath = URL.createObjectURL(fileList[i])
      // logger.debug("tmppath=>", tmppath)
      //
      // const base64 = await readBase64FromFile(fileList[i])
      // logger.debug("base64=>", base64)

      if (fileList.item(i).path) {
        filePaths.push(fileList.item(i).path)
        logger.debug("路径不为空")
      } else {
        // const base64Obj = {
        //   base64Image: base64,
        //   fileName: fileList.item(i).name, // 图片的文件名
        //   width: "200", // 图片宽度
        //   height: "200", // 图片高度
        //   extname: ".png", // 图片格式的扩展名 比如.jpg | .png
        // }
        logger.debug("路径为空，忽略")
        // filePaths.push(base64Obj)
      }
    }

    const imgInfos = await uploadByPicGO(filePaths)
    // 处理后续
    doAfterUpload(imgInfos)

    isUploadLoading.value = false
  } catch (e) {
    if (e.toString().indexOf("cancel") <= -1) {
      ElMessage({
        type: "error",
        message: t("main.opt.failure") + "=>" + e,
      })
      logger.error(t("main.opt.failure") + "=>" + e)
    }
    isUploadLoading.value = false
  }
}

const doUploadPicFromClipboard = async () => {
  isUploadLoading.value = true

  try {
    const imgInfos = await uploadByPicGO()
    // 处理后续
    doAfterUpload(imgInfos)

    isUploadLoading.value = false
  } catch (e) {
    if (e.toString().indexOf("cancel") <= -1) {
      ElMessage({
        type: "error",
        message: t("main.opt.failure") + "=>" + e,
      })
      logger.error(t("main.opt.failure") + "=>", e)
    }
    isUploadLoading.value = false
  }
}

const onImageUrlCopy = (url: string) => {
  if (isBrowser()) {
    const mdUrl = `![](${url})`
    copyToClipboardInBrowser(mdUrl)
  }
}

const handlePictureCardPreview = (url) => {
  dialogImageUrl.value = url!
  dialogVisible.value = true
}

const initPage = async () => {
  const pageId = await getPageId(true, props.pageId)
  const imageBlocks = await siyuanApi.getImageBlocksByID(pageId)
  logger.debug("查询文章中的图片块=>", imageBlocks)

  if (!imageBlocks || imageBlocks.length === 0) {
    return
  }

  // 解析图片地址
  let retImgs = []
  imageBlocks.forEach((page) => {
    const parsedImages = imageParser.parseImagesToArray(page.markdown)

    // 会有很多重复值
    // retImgs = retImgs.concat(retImgs, parsedImages)
    // 下面的写法可以去重
    retImgs = [...new Set([...retImgs, ...parsedImages])]
  })
  logger.debug("解析出来的所有的图片地址=>", retImgs)

  retImgs.forEach((retImg) => {
    let isLocal = false
    let imgUrl = retImg
    if (imgUrl.indexOf("assets") > -1) {
      const baseUrl = getSiyuanCfg().baseUrl
      imgUrl = pathJoin(baseUrl, "/" + imgUrl)
      isLocal = true
    }

    const imageItem = {
      name: imgUrl.substring(imgUrl.lastIndexOf("/") + 1),
      url: imgUrl,
      isLocal,
    }

    logger.debug("imageItem=>", imageItem)
    fileList.files.push(imageItem)
  })
}

/* 监听props */
watch(
  () => props.pageId,
  () => {
    // Here you can add your functionality
    // as described in the name you will get old and new value of watched property
    // 默认选中vuepress
    // setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
    initPage()
    logger.debug("Picgo初始化")
  }
)

onMounted(async () => {
  await initPage()
})
</script>

<style>
.picgo-body {
  padding: 16px;
}

.upload-btn-list {
}

.upload-control {
  display: inline-block;
  margin: 10px 16px 10px 0;
}

.log-msg {
  margin: 10px 0;
}

input[type="file"] {
  /* 隐藏原有的文件选择按钮 */
  display: none;
}

/* 创建自定义的文件选择按钮 */
.custom-file-input {
  display: inline-block;
  padding: 0.35em 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
}

/* 文件选择按钮的悬停样式 */
.custom-file-input:hover {
  background-color: #eee;
}

.file-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.file-list li {
  display: inline-block;
  margin-right: 16px;
  padding: 10px;
  border: solid 1px var(--el-color-primary);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
}

.file-list li img {
  width: 160px;
  height: 140px;
}

.one-local-to-bed {
  margin-bottom: 12px;
}

.one-bed-to-local {
  margin-bottom: 16px;
}

.img-big-preview {
  max-width: 100%;
}
</style>
