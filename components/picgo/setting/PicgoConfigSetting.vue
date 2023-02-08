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

<template>
  <div>
    <el-form label-width="125px">
      <el-form-item :label="$t('setting.picgo.picgo.open.config.file')">
        <el-button>{{ $t("setting.picgo.picgo.click.to.open") }}</el-button>
      </el-form-item>

      <el-form-item :label="$t('setting.picgo.picgo.choose.showed.picbed')">
        <el-checkbox-group
          v-model="form.showPicBedList"
          @change="handleShowPicBedListChange"
        >
          <el-checkbox
            v-for="item in picBed"
            :key="item.name"
            :label="item.name"
          />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from "vue"
import picgoUtil from "~/utils/otherlib/picgoUtil"
import { LogFactory } from "~/utils/logUtil"

const logger = LogFactory.getLogger(
  "components/picgo/setting/PicgoConfigSetting.vue"
)

const picBed = ref<IPicBedType[]>([])
const form = reactive({
  showPicBedList: [],
})

function getPicBeds() {
  const picBeds = picgoUtil.getPicBeds() as IPicBedType[]
  picBed.value = picBeds

  form.showPicBedList = picBed.value
    .map((item: IPicBedType) => {
      if (item.visible) {
        return item.name
      }
      return null
    })
    .filter((item) => item) as string[]
}

function handleShowPicBedListChange(val: ICheckBoxValueType[]) {
  const list = picBed.value.map((item) => {
    if (!val.includes(item.name)) {
      item.visible = false
    } else {
      item.visible = true
    }
    return item
  })
  picgoUtil.savePicgoConfig({
    "picBed.list": list,
  })
  logger.debug("保存启用的图床", list)
}

onBeforeMount(() => {
  // 获取图床列表
  getPicBeds()
})
</script>
