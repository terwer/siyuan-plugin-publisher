<!--
  - Copyright (c) 2024, Terwer . All rights reserved.
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
import { DynamicConfig, DynamicJsonCfg, isDynamicKeyExists, setDynamicJsonCfg } from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { DateUtil, JsonUtil } from "zhi-common"
import { markRaw, onMounted, reactive, ref } from "vue"
import { SypConfig } from "~/syp.config.ts"
import _ from "lodash-es"
import { pre } from "~/src/platforms/pre.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ElMessageBox } from "element-plus"
import { Delete } from "@element-plus/icons-vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const logger = createAppLogger("publish-platform-import")

// uses
const { t } = useVueI18n()
const { getSetting, updateSetting, deleteKey } = usePublishSettingStore()

// 自定义导入
const showCustomImportDrawer = ref(false)
const customImportDrawerTitle = ref("")
// 挂件 v0.8.1 导入
const showWidgetImportDrawer = ref(false)
const widgetImportDrawerTitle = ref("")

// datas
const formData = reactive({
  setting: {} as typeof SypConfig,

  dynamicConfigArray: [] as DynamicConfig[],

  // import
  isImportLoading: false,
  showLogMessage: false,
  logMessage: "",
})

// methods
const logAction = (pkey: string, action: string) => {
  const timestamp = DateUtil.formatIsoToZh(new Date().toISOString(), true)
  formData.logMessage += `[${timestamp}] ${pkey} ${action}\n`
}

const basicImport = (importCfgs: DynamicConfig[]) => {
  let importCount = 0
  for (const importCfg of importCfgs) {
    const pkey = importCfg.platformKey
    if (isDynamicKeyExists(formData.dynamicConfigArray, pkey)) {
      // logAction(pkey, "已经存在，忽略导入")
      continue
    }

    const newCfg = _.cloneDeep(importCfg)
    formData.dynamicConfigArray.push(newCfg)
    logAction(pkey, "已加入导入列表")

    // 初始化一个空配置
    formData.setting[pkey] = {}
    logAction(pkey, "已导入并初始化成功")

    importCount++
  }

  return importCount
}

const handleImportAll = () => {
  ElMessageBox.confirm(`确认要导入全部内置平台吗？`, "温馨提示", {
    type: "warning",
    icon: markRaw(Delete),
    confirmButtonText: t("main.opt.ok"),
    cancelButtonText: t("main.opt.cancel"),
  })
    .then(async () => {
      await doImportAll()
    })
    .catch(() => {})
}

const doImportAll = async () => {
  formData.showLogMessage = true
  formData.isImportLoading = true
  // 清空日志
  formData.logMessage = ""

  let totalImportCount = 0
  // 大类导入
  totalImportCount += basicImport(pre.commonCfg)
  totalImportCount += basicImport(pre.githubCfg)
  totalImportCount += basicImport(pre.gitlabCfg)
  totalImportCount += basicImport(pre.metaweblogCfg)
  totalImportCount += basicImport(pre.wordpressCfg)
  totalImportCount += basicImport(pre.customCfg)

  formData.isImportLoading = false

  if (totalImportCount > 0) {
    // 转换格式并保存
    const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
    formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
    await updateSetting(formData.setting)
    // 刷新数据
    await initPage()

    formData.logMessage += `全部导入成功并保存`
    ElMessage.success("全部导入成功并保存")
  } else {
    formData.logMessage += `未发现新平台，忽略导入`
    ElMessage.warning("未发现新平台，忽略导入")
  }
}

const handleImportCustom = () => {
  showCustomImportDrawer.value = true
  customImportDrawerTitle.value = "自定义导入"
}

const handleImportLegencySypWidget = () => {
  showWidgetImportDrawer.value = true
  widgetImportDrawerTitle.value = "从「挂件版」 v0.8.1 导入"
}

// init
const initPage = async () => {
  formData.setting = await getSetting()
  logger.info("get setting from platform setting", formData.setting)

  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(formData.setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  // 默认展示通用平台
  formData.dynamicConfigArray = dynJsonCfg?.totalCfg || []
  logger.debug("import dynamic init page=>", formData.dynamicConfigArray)
}

// lifecycles
onMounted(async () => {
  await initPage()
})
</script>

<template>
  <div class="flex flex-wrap gap-4 import-select">
    <el-card shadow="always" class="select-item" @click="handleImportAll"> 一键全部导入</el-card>
    <el-card shadow="hover" class="select-item" @click="handleImportCustom">自定义导入</el-card>
    <el-card shadow="hover" class="select-item" @click="handleImportLegencySypWidget">
      从旧版 v0.8.1 版本「思源笔记挂件」导入
    </el-card>

    <!--
    -----------------------------------------------------------------------------
    -->

    <div class="log-message-box">
      <el-input
        v-if="formData.showLogMessage"
        v-model="formData.logMessage"
        type="textarea"
        :rows="10"
        placeholder="日志信息"
      ></el-input>
    </div>

    <!--
    -----------------------------------------------------------------------------
    -->

    <!-- 抽屉占位 -->
    <el-drawer
      v-model="showCustomImportDrawer"
      size="85%"
      :title="customImportDrawerTitle"
      direction="rtl"
      :destroy-on-close="true"
    >
      <div class="import-panel">
        <el-button>aaaaa</el-button>
      </div>
    </el-drawer>

    <el-drawer
      v-model="showWidgetImportDrawer"
      size="85%"
      :title="widgetImportDrawerTitle"
      direction="rtl"
      :destroy-on-close="true"
    >
      <div class="import-panel">
        <el-button>bbbb</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped lang="stylus">
.import-select
  .select-item
    padding 10px 0
    margin-bottom 16px
    cursor pointer

  .log-message-box
    margin 10px 20px

:deep(.el-drawer)
  --el-drawer-padding-primary var(--el-dialog-padding-primary, 0)

:deep(.el-drawer__header)
  padding: 20px
  margin-bottom 0

.import-panel
  padding 0 16px
</style>
