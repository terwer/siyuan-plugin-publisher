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
  <div>
    Picgo
    <el-button @click="doUploadPic">点击上传</el-button>
  </div>
</template>

<script lang="ts" setup>
import { LogFactory } from "~/utils/logUtil"
import { ElMessage } from "element-plus"
import { useI18n } from "vue-i18n"
import { uploadNewWinByPicGO } from "~/utils/otherlib/picgoUtil"

const logger = LogFactory.getLogger("components/picgo/PicgoIndex.vue")
const { t } = useI18n()

const doUploadPic = async () => {
  try {
    const imgInfos = await uploadNewWinByPicGO()
    logger.info("上传完成，图片信息=>", imgInfos)
    ElMessage.success(t("main.opt.success"))
  } catch (e) {
    if (e.toString().indexOf("cancel") <= -1) {
      ElMessage({
        type: "error",
        message: t("main.opt.failure") + "=>" + e,
      })
      logger.error(t("main.opt.failure") + "=>" + e)
    }
  }
}
</script>
