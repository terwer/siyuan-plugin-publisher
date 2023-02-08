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
  <el-container>
    <el-header height="300px" class="publish-dyn-header">
      <el-form
        label-width="165px"
        ref="formRef"
        :model="formData.dynCfg"
        :rules="rules"
      >
        <el-alert
          class="top-version-tip"
          :title="$t('dynamic.platform.tip')"
          type="info"
          :closable="false"
        />

        <!-- 平台类型 -->
        <el-form-item :label="$t('dynamic.platform.type')">
          <el-button-group>
            <el-button
              :type="formData.ptype === PlatformType.Github ? 'primary' : ''"
              @click="onPlatformTypeChange(PlatformType.Github)"
            >
              {{ $t("dynamic.platform.type.github") }}
            </el-button>
            <el-button
              :type="
                formData.ptype === PlatformType.Metaweblog ? 'primary' : ''
              "
              @click="onPlatformTypeChange(PlatformType.Metaweblog)"
            >
              {{ $t("dynamic.platform.type.metaweblog") }}
            </el-button>
            <el-button
              :type="formData.ptype === PlatformType.Wordpress ? 'primary' : ''"
              @click="onPlatformTypeChange(PlatformType.Wordpress)"
            >
              {{ $t("dynamic.platform.type.wordpress") }}
            </el-button>
            <el-button
              :type="formData.ptype === PlatformType.Custom ? 'primary' : ''"
              @click="onPlatformTypeChange(PlatformType.Custom)"
            >
              {{ $t("dynamic.platform.type.custom") }}
            </el-button>
          </el-button-group>
        </el-form-item>

        <!-- 临时页面 -->
        <el-form-item v-if="!showForm">
          <el-alert title="敬请期待" type="info" :closable="false" />
        </el-form-item>

        <!-- 平台名称 -->
        <el-form-item v-if="formData.subtypeOptions.length > 0 && showForm">
          <el-select
            v-model="formData.subtype"
            class="m-2"
            placeholder="Select"
            @change="onSubPlatformTypeChange"
          >
            <el-option
              v-for="item in formData.subtypeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="formData.ptype + $t('dynamic.platform.name')"
          prop="platformName"
          v-if="showForm"
        >
          <el-input
            v-model="formData.dynCfg.platformName"
            :placeholder="$t('dynamic.platform.name.tip')"
          />
        </el-form-item>

        <el-form-item
          :label="formData.ptype + $t('dynamic.platform.key')"
          prop="platformKey"
          v-if="false"
        >
          {{ formData.dynCfg.platformKey }}
        </el-form-item>

        <el-form-item v-if="showForm">
          <el-button type="primary" @click="submitForm(formRef)"
            >{{ $t("dynamic.platform.opt.add") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>

    <!-- 动态列表 -->
    <el-main class="dyn-table-list">
      <el-form-item>
        <el-table
          :data="tableData"
          :key="num"
          border
          stripe
          highlight-current-row
          empty-text="暂无数据"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="platformType"
            :label="$t('dynamic.platform.type')"
          />
          <el-table-column
            prop="subPlatformType"
            :label="$t('dynamic.platform.subtype')"
          />
          <el-table-column
            prop="platformKey"
            :label="$t('dynamic.platform.key')"
          />
          <el-table-column
            prop="platformName"
            :label="$t('dynamic.platform.name')"
          />
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-alert
          class="top-version-tip"
          :title="currentTip"
          type="info"
          :closable="false"
          v-if="currentRow"
        />
        <el-button type="danger" @click="delRow"
          >{{ $t("dynamic.platform.opt.del.select") }}
        </el-button>
      </el-form-item>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { ElMessage, ElMessageBox, FormRules } from "element-plus"
import { useI18n } from "vue-i18n"
import {
  DynamicConfig,
  getDefaultPlatformName,
  getDynamicJsonCfg,
  getNewPlatformKey,
  getSubtypeList,
  isDynamicKeyExists,
  PlatformType,
  setDynamicJsonCfg,
  SubPlatformType,
} from "~/utils/platform/dynamicConfig"
import { LogFactory } from "~/utils/logUtil"
import { checkKeyExists } from "~/utils/configUtil"
import { importPreDefinedPlatform } from "~/utils/platform/import/platformImportUtil"

const logger = LogFactory.getLogger(
  "components/publish/tab/DynamicPlatform.vue"
)

const { t } = useI18n()

const showForm = ref(true)
// 默认支持jekyll
const defaultGithubSubtype = SubPlatformType.Github_Jekyll

const formRef = ref()
const formData = reactive({
  subtype: defaultGithubSubtype,
  ptype: PlatformType.Github,
  dynCfg: new DynamicConfig(
    PlatformType.Github,
    getNewPlatformKey(PlatformType.Github, defaultGithubSubtype),
    "Jekyll-1"
  ),
  subtypeOptions: [],
  dynamicConfigArray: [],
})
const rules = reactive<FormRules>({
  platformName: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
})

const onSubPlatformTypeChange = (val) => {
  formData.subtype = val
  logger.debug(formData.subtype)

  onPlatformTypeChange(formData.ptype)
}

const onPlatformTypeChange = (val) => {
  formData.ptype = val
  formData.subtypeOptions = getSubtypeList(val)
  const pname = getDefaultPlatformName(
    val,
    formData.subtype,
    formData.subtypeOptions.length > 0 &&
      formData.subtype !== SubPlatformType.NONE
  )
  formData.dynCfg = new DynamicConfig(
    val,
    getNewPlatformKey(
      val,
      formData.subtypeOptions.length > 0
        ? formData.subtype
        : SubPlatformType.NONE
    ),
    pname
  )
  showForm.value = formData.ptype !== PlatformType.Custom
  logger.debug(formData.ptype)
}

const validateForm = (formEl) => {
  // 类型校验
  if (formData.ptype === PlatformType.Custom) {
    ElMessage.error(t("dynamic.platform.opt.noselect"))
    return false
  }

  // 平台key必须唯一
  const pkey = formData.dynCfg.platformKey
  logger.debug("将要保存的平台key", pkey)
  if (isDynamicKeyExists(formData.dynamicConfigArray, pkey)) {
    ElMessage.error(t("dynamic.platform.opt.key.exist"))
    return false
  }

  // 保证开关变量key不重复
  const switchKey = "switch-" + pkey
  const postidKey = "custom-" + pkey + "-post-id"
  // 保证文章绑定id的key不重复
  if (
    checkKeyExists(pkey) ||
    checkKeyExists(switchKey) ||
    checkKeyExists(postidKey)
  ) {
    ElMessage.error(t("dynamic.platform.opt.key.exist"))
    return false
  }

  return true
}

const submitForm = async (formEl) => {
  if (!formEl) return
  if (!validateForm(formEl)) {
    return
  }

  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      logger.debug("校验成功")
    } else {
      logger.error(t("main.opt.failure"), fields)
      // ElMessage.error(t('main.opt.failure'))
    }
  })
  if (!result) {
    return
  }

  // 保存配置
  const newCfg = new DynamicConfig(
    formData.ptype,
    formData.dynCfg.platformKey,
    formData.dynCfg.platformName
  )
  if (formData.ptype === PlatformType.Github) {
    newCfg.subPlatformType = formData.subtype
  } else {
    newCfg.subPlatformType = SubPlatformType.NONE
  }
  formData.dynamicConfigArray.push(newCfg)
  setDynamicJsonCfg(formData.dynamicConfigArray)

  // 重新加载列表
  reloadTable()

  ElMessage.success(t("main.opt.success"))
}

const tableData = []
const num = ref(0)
const currentRow = ref()
const currentTip = ref(t("dynamic.platform.opt.item.select"))

const handleCurrentChange = (val: any) => {
  currentRow.value = val
  currentTip.value =
    t("dynamic.platform.opt.item.select.tip") + currentRow.value.platformName
  logger.debug(currentRow.value)
}

const delRow = async () => {
  ElMessageBox.confirm(
    t("dynamic.platform.opt.del.confirm"),
    t("main.opt.warning"),
    {
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
      type: "warning",
    }
  )
    .then(async () => {
      if (!currentRow.value || !currentRow.value.platformKey) {
        ElMessage.error(t("dynamic.platform.opt.item.no.select.tip"))
        return
      }

      for (let i = 0; i < formData.dynamicConfigArray.length; i++) {
        // logUtil.logInfo(currentRow.value.platformKey)
        // logUtil.logInfo(formData.dynamicConfigArray[i].platformKey)
        // logUtil.logInfo("------------------------")
        if (
          currentRow.value.platformKey ===
          formData.dynamicConfigArray[i].platformKey
        ) {
          formData.dynamicConfigArray.splice(i, 1)
        }
      }

      setDynamicJsonCfg(formData.dynamicConfigArray)

      // 重新加载列表
      reloadTable()

      ElMessage.success(t("main.opt.success"))
    })
    .catch(() => {
      // ElMessage({
      //   type: 'error',
      //   message: t("main.opt.failure"),
      // })
    })
}

const reloadTable = () => {
  // 渲染table
  tableData.length = 0
  for (let i = 0; i < formData.dynamicConfigArray.length; i++) {
    tableData.push(formData.dynamicConfigArray[i])
  }
  num.value = formData.dynamicConfigArray.length
}

const initPage = async () => {
  formData.subtypeOptions = getSubtypeList(PlatformType.Github)
  formData.dynamicConfigArray = getDynamicJsonCfg().totalCfg || []

  // 重新加载列表
  reloadTable()

  logger.debug("dynamic init page=>", formData.dynamicConfigArray)
}

onMounted(async () => {
  // 导入配置
  logger.info("开始导入预定义平台...")
  importPreDefinedPlatform()
  logger.info("导入预定义平台成功.")

  // 初始化
  await initPage()
})
</script>

<style scoped>
.publish-dyn-header {
  height: 300px !important;
}

.dyn-table-list {
}
</style>
