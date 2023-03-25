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
    <el-alert :title="$t('setting.picgo.index.tip')" type="warning" :closable="false" />

    <!-- 上传状态 -->
    <div class="upload-status">
      <el-button text :loading="picgoCommonData.isUploadLoading">{{ $t("picgo.upload.status") }} </el-button>
    </div>

    <!-- 操作按钮 -->
    <blockquote class="picgo-opt-btn">
      <!-- 原有的文件选择按钮 -->
      <input
        type="file"
        accept="image/png, image/gif, image/jpeg"
        @change="picgoUploadMethods.doUploadPicSelected"
        multiple
        ref="refSelectedFiles"
      />
      <el-tooltip
        v-if="isElectron"
        class="box-item"
        effect="dark"
        :content="$t('picgo.upload.select.pic')"
        placement="top-start"
      >
        <el-button type="warning" @click="picgoUploadMethods.bindFileControl">
          <font-awesome-icon icon="fa-solid fa-file-import" />
        </el-button>
      </el-tooltip>

      <!-- 剪贴板上传 -->
      <el-tooltip class="box-item" effect="dark" :content="$t('picgo.upload.clipboard')" placement="top-start">
        <el-button type="primary" @click="picgoUploadMethods.doUploadPicFromClipboard">
          <font-awesome-icon icon="fa-solid fa-paste" />
        </el-button>
      </el-tooltip>

      <!-- 上传所有图到图床 -->
      <el-tooltip class="box-item" effect="dark" :content="$t('picgo.upload.onclick')" placement="top-start">
        <el-button type="success" @click="picgoManageMethods.handleUploadAllImagesToBed">
          <font-awesome-icon icon="fa-solid fa-upload" />
        </el-button>
      </el-tooltip>

      <!-- 下载所有远程图片 -->
      <el-tooltip
        v-if="false && isElectron"
        class="box-item"
        effect="dark"
        :content="$t('picgo.download.onclick')"
        placement="top-start"
      >
        <el-button type="primary">
          <font-awesome-icon icon="fa-solid fa-download" />
        </el-button>
      </el-tooltip>

      <!-- 图床设置 -->
      <el-tooltip class="box-item" effect="dark" :content="$t('picgo.pic.setting')" placement="top-start">
        <el-button type="info" @click="picgoUploadMethods.handlePicgoSetting">
          <font-awesome-icon icon="fa-solid fa-gear" />
        </el-button>
      </el-tooltip>
    </blockquote>

    <!-- 图片列表 -->
    <ul class="file-list">
      <li class="file-list-item" v-for="f in picgoCommonData.fileList.files" v-bind:key="f.name">
        <div><img :src="f.url" :alt="f.name" /></div>
        <div>
          <!-- 上传本地图片到图床 -->
          <el-tooltip
            :content="f.isLocal ? $t('picgo.download.local.to.bed') : '重新上传'"
            class="box-item"
            effect="dark"
            placement="bottom"
            popper-class="publish-menu-tooltip"
          >
            <el-button @click="picgoManageMethods.handleUploadCurrentImageToBed(f)">
              <font-awesome-icon :icon="f.isLocal ? 'fa-solid fa-upload' : 'fa-solid fa-arrow-rotate-right'" />
            </el-button>
          </el-tooltip>

          <!-- 下载远程图片到本地 -->
          <el-tooltip
            v-if="false && isElectron && !f.isLocal"
            :content="$t('picgo.download.bed.to.local')"
            class="box-item"
            effect="dark"
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
            :title="f.alt ? f.alt : $t('setting.picgo.index.copy.link')"
            :width="picgoCommonData.popWidth"
            trigger="hover"
            :content="f.url"
          >
            <template #reference>
              <el-button @click="picgoManageMethods.onImageUrlCopy(f.url)">
                <font-awesome-icon icon="fa-solid fa-file-lines" />
              </el-button>
            </template>
          </el-popover>

          <!-- 图片预览 -->
          <el-tooltip
            :content="$t('picgo.pic.preview')"
            class="box-item"
            effect="dark"
            placement="bottom"
            popper-class="publish-menu-tooltip"
          >
            <el-button @click="picgoManageMethods.handlePictureCardPreview(f.url)">
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </el-button>
          </el-tooltip>
        </div>
      </li>
    </ul>

    <!-- 图片放大 -->
    <el-dialog
      v-model="picgoManageData.dialogPreviewVisible"
      :title="$t('picgo.pic.preview') + ' - ' + picgoManageData.dialogImageUrl"
    >
      <img w-full :src="picgoManageData.dialogImageUrl" alt="Preview Image" class="img-big-preview" />
    </el-dialog>

    <!-- Picgo设置 -->
    <el-dialog v-model="picgoUploadData.dialogPicgoSettingFormVisible" :title="$t('picgo.pic.setting')">
      <picgo-setting />
    </el-dialog>

    <!-- 日志显示 -->
    <div class="log-msg" v-if="picgoCommonData.showDebugMsg">
      <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10 }" v-model="picgoCommonData.loggerMsg" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePicgoCommon } from "~/composables/picgo/picgoCommonCom"
import { usePicgoUpload } from "~/composables/picgo/picgoUploadCom"
import { usePicgoInitPage } from "~/composables/picgo/picgoInitPageCom"
import { isElectron } from "~/utils/browserUtil"
import { usePicgoManage } from "~/composables/picgo/picgoManageCom"
import { ref } from "vue"
import PicgoSetting from "~/components/picgo/PicgoSetting.vue"

// props
const props = defineProps({
  pageId: {
    type: String,
    default: undefined,
  },
})

// refs
const refSelectedFiles = ref()

// uses
const { picgoCommonData, picgoCommonMethods } = usePicgoCommon()
const { picgoInitMethods } = usePicgoInitPage(props, { picgoCommonMethods })
const { picgoUploadData, picgoUploadMethods } = usePicgoUpload(props, { picgoCommonMethods }, { refSelectedFiles })
const { picgoManageData, picgoManageMethods } = usePicgoManage(props, {
  picgoCommonMethods,
  picgoInitMethods,
})
</script>

<style>
.picgo-body {
  padding: 16px;
}

.picgo-body .picgo-opt-btn {
  display: block;
  border: solid 1px green;
  border-radius: 4px;
  padding: 10px;
  background: var(--custom-app-bg-color);
  margin: 16px 0 16px;
}

.upload-status {
  margin-top: 10px;
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
  margin-right: 10px;
  margin-bottom: 16px;
  padding: 8px;
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
