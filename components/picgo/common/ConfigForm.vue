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
  <div class="config-form-box">
    <div class="config-form-header">
      <el-page-header :icon="ArrowLeft" title="返回" @click="onBack">
        <template #content>
          <div class="flex items-center">
            <span
              class="text-large font-600 mr-3"
              :title="configRuleForm._configName"
            >
              {{ configRuleForm._configName }}
            </span>
          </div>
        </template>
      </el-page-header>
    </div>

    <div class="config-form">
      <el-form ref="$configForm" label-width="250px" :model="configRuleForm">
        <el-form-item
          :label="$t('setting.picgo.config.name')"
          required
          prop="_configName"
        >
          <el-input
            v-model="configRuleForm._configName"
            :placeholder="$t('setting.picgo.config.name.placeholder')"
          />
        </el-form-item>

        <!-- dynamic config -->
        <el-form-item
          v-for="(item, index) in configList"
          :key="item.name + index"
          :label="item.alias || item.name"
          :required="item.required"
          :prop="item.name"
        >
          <el-input
            v-if="item.type === 'input' || item.type === 'password'"
            v-model="configRuleForm[item.name]"
            :type="item.type === 'password' ? 'password' : 'input'"
            :placeholder="item.message || item.name"
          />
          <el-select
            v-else-if="item.type === 'list' && item.choices"
            v-model="configRuleForm[item.name]"
            :placeholder="item.message || item.name"
          >
            <el-option
              v-for="choice in item.choices"
              :key="choice.name || choice.value || choice"
              :label="choice.name || choice.value || choice"
              :value="choice.value || choice"
            />
          </el-select>
          <el-select
            v-else-if="item.type === 'checkbox' && item.choices"
            v-model="configRuleForm[item.name]"
            :placeholder="item.message || item.name"
            multiple
            collapse-tags
          >
            <el-option
              v-for="choice in item.choices"
              :key="choice.value || choice"
              :label="choice.name || choice.value || choice"
              :value="choice.value || choice"
            />
          </el-select>
          <el-switch
            v-else-if="item.type === 'confirm'"
            v-model="configRuleForm[item.name]"
            active-text="yes"
            inactive-text="no"
          />
        </el-form-item>

        <el-form-item>
          <el-button @click="onSubmit">{{ $t("main.opt.ok") }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft } from "@element-plus/icons-vue"
import { reactive, ref, toRaw, watch } from "vue"
import { FormInstance } from "element-plus"
import { LogFactory } from "~/utils/logUtil"
import picgoUtil from "~/utils/otherlib/picgoUtil"
import { cloneDeep, union } from "lodash-es"

const logger = LogFactory.getLogger(
  "components/picgo/setting/PicbedConfigForm.vue"
)

const props = defineProps({
  // 配置类型：plugin、transfer还是uploader
  configType: String,
  config: Object,

  // 对于uploader来说是图床类型
  id: String,
  // 当前配置项的uuid
  configId: String,
  isNewForm: Boolean,
})

const $configForm = ref<FormInstance>()
const emits = defineEmits(["on-change"])

const configList = ref<IPicGoPluginConfig[]>([])
const configRuleForm = reactive<IStringKeyMap>({})

watch(
  props.config,
  (val: IPicGoPluginConfig[]) => {
    logger.info("检测到配置文件变化，val=>", val)
    handleConfigChange(val)
  },
  {
    deep: true,
    immediate: true,
  }
)

// function getConfigType () {
//   switch (props.configType) {
//     case 'plugin': {
//       return props.id
//     }
//     case 'uploader': {
//       return `picBed.${props.id}`
//     }
//     case 'transformer': {
//       return `transformer.${props.id}`
//     }
//     default:
//       return 'unknown'
//   }
// }

function handleConfigChange(val: any) {
  handleConfig(val)
}

function getCurConfigFormData() {
  const configId = props.configId
  let curConfig
  switch (props.configType) {
    case "plugin": {
      curConfig = picgoUtil.getPicgoConfig(`${props.configId}`) || {
        _configName: props.configId,
      }
      break
    }
    case "uploader": {
      const curTypeConfigList =
        picgoUtil.getPicgoConfig(`uploader.${props.id}.configList`) || []
      curConfig = curTypeConfigList.find((i) => i._id === configId) || {}
      break
    }
    case "transformer": {
      curConfig =
        picgoUtil.getPicgoConfig(`transformer.${props.configId}`) || {}
      break
    }
    default:
      curConfig = {}
      break
  }

  console.log("curConfig=>", curConfig)
  return curConfig
}

function handleConfig(val: IPicGoPluginConfig[]) {
  const config = props.isNewForm ? {} : getCurConfigFormData()
  const configId = props.isNewForm ? undefined : props.configId
  Object.assign(configRuleForm, config)
  logger.debug("form属性=>", configRuleForm)
  logger.debug("configId=>", configId)

  // 追加form属性
  const rawVal = toRaw(val)
  logger.debug("追加form属性rawVal=>", rawVal)

  if (rawVal.length > 0) {
    configList.value = cloneDeep(rawVal).map((item) => {
      if (!configId) return item
      let defaultValue =
        item.default !== undefined
          ? item.default
          : item.type === "checkbox"
          ? []
          : null
      if (item.type === "checkbox") {
        const defaults =
          item.choices
            ?.filter((i: any) => {
              return i.checked
            })
            .map((i: any) => i.value) || []
        defaultValue = union(defaultValue, defaults)
      }
      if (config && config[item.name] !== undefined) {
        defaultValue = config[item.name]
      }
      configRuleForm[item.name] = defaultValue
      return item
    })
  }

  logger.debug("完整form属性=>", configRuleForm)
  logger.debug("动态配置configList=>", configList.value)
  logger.debug("追加form完成.")
}

async function validate(): Promise<IStringKeyMap | false> {
  return new Promise((resolve) => {
    $configForm.value?.validate((valid: boolean) => {
      if (valid) {
        resolve(configRuleForm)
      } else {
        resolve(false)
        return false
      }
    })
  })
}

const onBack = () => {
  emits("on-change")
}

const onSubmit = async () => {
  const result = (await validate()) || false

  console.log("准备保存配置result", result)
  if (result !== false) {
    switch (props.configType) {
      case "plugin":
        picgoUtil.savePicgoConfig(`${props.configId}`, result)
        break
      case "uploader":
        picgoUtil.updateUploaderConfig(props.id, result?._id, result)
        break
      case "transformer":
        picgoUtil.savePicgoConfig(`transformer.${props.configId}`, result)
        break
    }
  }

  onBack()
}
</script>

<style scoped>
.config-form-header {
  margin: 10px 0;
}
</style>
