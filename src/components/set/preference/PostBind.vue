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
import { onMounted, reactive, ref, toRaw } from "vue"
import { ElMessage, FormRules } from "element-plus"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { ObjectUtil, StrUtil } from "zhi-common"
import { useRoute } from "vue-router"
import { getWidgetId } from "~/src/utils/widgetUtils.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const logger = createAppLogger("post-bind")

// uses
const { t } = useVueI18n()
const { query } = useRoute()
const { getPublishCfg } = usePublishConfig()
const { updateSetting } = useSettingStore()

// datas
const id = (query.id ?? getWidgetId()) as string
const ruleFormRef = ref()
const ruleForm = reactive({})
const rules = reactive<FormRules>({})
const formData = reactive({
  dynamicConfigArray: [] as DynamicConfig[],
  postIdMap: {} as any,
})

// methods
const submitForm = async (formEl: any) => {
  if (StrUtil.isEmptyString(id)) {
    ElMessage.error("")
    return
  }

  try {
    const publishCfg = await getPublishCfg()
    const setting = publishCfg.setting
    const postMeta = ObjectUtil.getProperty(setting, id, {})

    formData.dynamicConfigArray = formData.dynamicConfigArray.map((item: DynamicConfig) => {
      const postid = formData.postIdMap[item.platformKey]
      const cfg = ObjectUtil.getProperty(setting, item.platformKey, {})
      const posidKey = cfg?.posidKey
      if (!StrUtil.isEmptyString(posidKey) && !StrUtil.isEmptyString(id)) {
        postMeta[posidKey] = postid
      }
      return item
    })
    setting[id] = postMeta
    logger.debug("prepare to save setting =>", { setting: toRaw(setting) })
    await updateSetting(setting)
    ElMessage.success(t("main.opt.success"))
  } catch (e) {
    logger.error(t("main.opt.failure") + "=>", e)
    ElMessage.error(t("main.opt.failure") + "=>" + e)
  }
}

// lifecycles
onMounted(async () => {
  const publishCfg = await getPublishCfg()
  const setting = publishCfg.setting
  formData.dynamicConfigArray = publishCfg.dynamicConfigArray
  const postMeta = ObjectUtil.getProperty(setting, id, {})

  formData.dynamicConfigArray.forEach((item: DynamicConfig) => {
    let postid = ""
    const cfg = ObjectUtil.getProperty(setting, item.platformKey, {})
    const posidKey = cfg?.posidKey
    if (!StrUtil.isEmptyString(posidKey) && !StrUtil.isEmptyString(id)) {
      postid = ObjectUtil.getProperty(postMeta, posidKey)
    }
    formData.postIdMap[item.platformKey] = postid
  })
})
</script>

<template>
  <el-form label-width="85px" class="post-bind-form" ref="ruleFormRef" :model="ruleForm" :rules="rules" status-icon>
    <el-alert class="top-tip" :title="t('post.bind.auto.tips')" type="error" :closable="false" />
    <!-- 动态配置 -->
    <el-form-item
      v-for="(cfg, index) in formData.dynamicConfigArray"
      :key="index"
      :label="cfg.platformName"
      v-show="cfg.isEnabled && cfg.isEnabled"
    >
      <el-input v-model="formData.postIdMap[cfg.platformKey]" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">{{ t("post.bind.conf.save") }} </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="stylus">
.post-bind-form
  padding 0 10px
  padding-left 0

.top-tip
  margin 10px 0
  padding-left 0
</style>
