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
      <!-- 打开PicGO配置文件 -->
      <el-form-item :label="$t('setting.picgo.picgo.open.config.file')">
        <el-button @click="handleOpenFile('picgo.cfg.json')">{{ $t("setting.picgo.picgo.click.to.open") }} </el-button>
      </el-form-item>

      <!-- 打开PicGO日志文件 -->
      <el-form-item :label="$t('setting.picgo.setting.log.file')">
        <el-button @click="handleOpenFile('picgo.log')">{{ $t("setting.picgo.picgo.click.to.open") }} </el-button>
      </el-form-item>

      <!-- 图床开关 -->
      <el-form-item :label="$t('setting.picgo.picgo.choose.showed.picbed')">
        <el-checkbox-group v-model="form.showPicBedList" @change="handleShowPicBedListChange">
          <el-checkbox v-for="item in picBed" :key="item.name" :label="item.name" />
        </el-checkbox-group>
      </el-form-item>

      <!-- 时间戳重命名 -->
      <el-form-item :label="$t('setting.picgo.setting.timestamp.rename')">
        <el-switch
          v-model="form.autoRename"
          :active-text="$t('setting.picgo.setting.open')"
          :inactive-text="$t('setting.picgo.setting.close')"
          @change="handleAutoRename"
        />
      </el-form-item>

      <div v-if="isInSiyuanNewWinBrowser()">
        <el-divider />

        <p>
          {{ $t("setting.picgo.setting.config.tip") }}
        </p>

        <!-- NODE安装路径 -->
        <el-form-item :label="$t('setting.picgo.setting.node.path')">
          <el-input v-model="form.nodePath" :placeholder="$t('setting.picgo.setting.node.path.tip')" />
        </el-form-item>
        <el-form-item :label="$t('setting.picgo.setting.node.registry')">
          <el-input v-model="form.nodeRegistry" :placeholder="$t('setting.picgo.setting.node.registry.tip')" />
        </el-form-item>
        <el-form-item :label="$t('setting.picgo.setting.node.proxy')">
          <el-input v-model="form.nodeProxy" :placeholder="$t('setting.picgo.setting.node.proxy.tip')" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSaveNodeConfig">{{ $t("main.opt.ok") }} </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, reactive, ref } from "vue"
import picgoUtil from "~/utils/otherlib/picgoUtil"
import { LogFactory } from "~/utils/logUtil"
import siyuanBrowserUtil, { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil"
import { ElDivider, ElMessage } from "element-plus"
import { useI18n } from "vue-i18n"

const logger = LogFactory.getLogger("components/picgo/setting/PicgoConfigSetting.vue")

const { t } = useI18n()

const DEFAULT_NPM_REGISTRY = "https://registry.npmmirror.com"
const picBed = ref<IPicBedType[]>([])
const form = reactive({
  showPicBedList: [],
  autoRename: false,
  nodePath: "",
  nodeRegistry: DEFAULT_NPM_REGISTRY,
  nodeProxy: "",
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

const handleOpenFile = (filename) => {
  const picgoCfgfile = picgoUtil.getPicgoCfgFile(filename)
  logger.warn("即将打开文件=>", picgoCfgfile)
  siyuanBrowserUtil.openPath(picgoCfgfile)
}

const handleAutoRename = (val: ICheckBoxValueType) => {
  picgoUtil.savePicgoConfig({
    "settings.autoRename": val,
  })
}

const handleSaveNodeConfig = () => {
  form.nodePath = form.nodePath.trim()
  form.nodeRegistry = form.nodeRegistry.trim()
  form.nodeProxy = form.nodeProxy.trim()

  form.nodeRegistry = form.nodeRegistry === "" ? DEFAULT_NPM_REGISTRY : form.nodeRegistry

  picgoUtil.savePicgoConfig({
    "settings.nodePath": form.nodePath,
    "settings.registry": form.nodeRegistry,
    "settings.proxy": form.nodeProxy === "" ? undefined : form.nodeProxy,
  })

  ElMessage.success(t("main.opt.success"))
}

function initData() {
  const config = picgoUtil.getPicgoConfig()
  logger.debug("PicGO setting initData=>", config)
  if (config !== undefined) {
    const settings = config.settings || {}
    // 重命名默认开启，防止图片路径问题
    form.autoRename = settings.autoRename ?? true
    form.nodePath = settings.nodePath ?? ""
    form.nodeRegistry = settings.registry ?? DEFAULT_NPM_REGISTRY
    form.nodeProxy = settings.nodeProxy ?? ""

    // 初始化默认配置
    picgoUtil.savePicgoConfig({
      "settings.autoRename": form.autoRename,
      "settings.registry": form.nodeRegistry,
    })
  }
}

// register events
onBeforeMount(() => {
  picgoUtil.ipcRegisterEvent("getPicBeds", (evt, data) => {
    getPicBeds()
  })

  // 获取图床列表
  getPicBeds()

  initData()
})

// remove events
onBeforeUnmount(() => {
  picgoUtil.ipcRemoveEvent("getPicBeds")
})
</script>
