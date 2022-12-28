<!--
  - Copyright (c) 2022, Terwer . All rights reserved.
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
    <div class="upload-btn-list">
      <div class="upload-control">
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
      <div class="upload-control">
        <el-button text :loading="isUploadLoading">上传状态</el-button>
      </div>
    </div>

    <ul class="file-list">
      <li
        class="file-list-item"
        v-for="f in fileList.files"
        v-bind:key="f.name"
      >
        <img :src="f.url" :alt="f.name" />
        <el-input :model-value="f.url" />
      </li>
    </ul>

    <div class="log-msg">
      <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 10 }"
        v-model="loggerMsg"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LogFactory } from "~/utils/logUtil"
import { ElMessage } from "element-plus"
import { useI18n } from "vue-i18n"
import { uploadByPicGO } from "~/utils/otherlib/picgoUtil"
import { reactive, ref } from "vue"
import { inSiyuan } from "~/utils/platform/siyuan/siyuanUtil"
import { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil"

const logger = LogFactory.getLogger("components/picgo/PicgoIndex.vue")
const { t } = useI18n()
const isUploadLoading = ref(false)

const fileList = reactive({
  files: [],
})
const loggerMsg = ref("")

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
      }
      loggerMsg.value += "\nnewItem=>" + JSON.stringify(rtnItem)

      fileList.files.push(rtnItem)
    })
  }
  ElMessage.success(t("main.opt.success"))
}

const readBase64FromFile = async (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  const base64 = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
  return base64
}

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
  margin-right: 1em;
  padding-bottom: 4px;
}

.file-list li img {
  max-width: 100px;
  height: auto;
}
</style>
