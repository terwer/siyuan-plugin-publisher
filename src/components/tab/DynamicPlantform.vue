<template>
  <el-container>
    <el-header height="250px">
      <el-form label-width="180px" ref="formRef" :model="formData" :rules="rules">
        <el-alert class="top-version-tip" :title="$t('dynamic.platform.tip')" type="info" :closable="false"/>

        <el-form-item :label="$t('dynamic.platform.type')">
          <el-button-group>
            <el-button :type="pType===PlantformType.Metaweblog?'primary':''"
                       @click="onPlantformTypeChange(PlantformType.Metaweblog)">
              {{ $t('dynamic.platform.type.metaweblog') }}
            </el-button>
            <el-button :type="pType===PlantformType.Wordpress?'primary':''"
                       @click="onPlantformTypeChange(PlantformType.Wordpress)">
              {{ $t('dynamic.platform.type.wordpress') }}
            </el-button>
            <el-button :type="pType===PlantformType.Custom?'primary':''"
                       @click="onPlantformTypeChange(PlantformType.Custom)">{{
                $t('dynamic.platform.type.custom')
              }}
            </el-button>
          </el-button-group>
        </el-form-item>

        <el-form-item v-if="!showForm">
          敬请期待
        </el-form-item>

        <el-form-item :label="pType+$t('dynamic.platform.key')" prop="plantformKey" v-if="showForm">
          <el-input v-model="formData.plantformKey" :placeholder="$t('dynamic.platform.key.tip')"/>
        </el-form-item>

        <el-form-item :label="pType+$t('dynamic.platform.name')" prop="plantformName" v-if="showForm">
          <el-input v-model="formData.plantformName" :placeholder="$t('dynamic.platform.name.tip')"/>
        </el-form-item>

        <el-form-item v-if="showForm">
          <el-button type="primary" @click="submitForm(formRef)">{{ $t('dynamic.platform.opt.add') }}</el-button>
        </el-form-item>
      </el-form>
    </el-header>

    <el-main>
      <el-form-item>
        <el-alert class="top-version-tip" :title="currentTip" type="info" :closable="false" v-if="currentRow"/>
        <el-button type="danger" @click="delRow">{{ $t('dynamic.platform.opt.del.select') }}</el-button>
      </el-form-item>

      <el-table :data="tableData" :key="num" border stripe highlight-current-row
                @current-change="handleCurrentChange">
        <el-table-column prop="plantformKey" :label="$t('dynamic.platform.key')"/>
        <el-table-column prop="plantformName" :label="$t('dynamic.platform.name')"/>
      </el-table>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {DynamicConfig} from "../../lib/dynamicConfig";
import {onMounted, reactive, ref} from "vue";
import log from "../../lib/logUtil";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";
import {checkKeyExists, getArrayJSONConf, getJSONConf, setJSONConf} from "../../lib/config";
import {CONSTANTS} from "../../lib/constants/constants";
import {inBrowser, isEmptyObject, setUrlParameter} from "../../lib/util";

const {t} = useI18n()

enum PlantformType {
  Metaweblog = "Metaweblog",
  Wordpress = "Wordpress",
  Custom = "Custom"
}

const pType = ref("Metaweblog")
const showForm = ref(true)

let dynamicConfigArray = reactive(<Array<DynamicConfig>>[])

const formRef = ref<FormInstance>()
const formData = reactive(new DynamicConfig("", ""))
const rules = reactive<FormRules>({
  plantformKey: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
  plantformName: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
})

const onPlantformTypeChange = (val: PlantformType) => {
  pType.value = val
  showForm.value = pType.value == PlantformType.Metaweblog || pType.value == PlantformType.Wordpress
  log.logInfo(pType.value)
}

const reloadTabPage = () => {
  setTimeout(function () {
    if (inBrowser()) {
      const url = window.location.href
      window.location.href = setUrlParameter(url, "tab", "dynamicp-platform")
    }
  }, 1000)
}

const submitForm = async (formEl: FormInstance | undefined) => {
  // 类型校验
  if (pType.value == "") {
    ElMessage.error(t('dynamic.platform.opt.noselect'))
    return
  }
  // 平台key必须唯一
  const pkey = formData.plantformKey
  // 最终存储的key
  const ptypeKey = pType.value.toLowerCase() + "-" + formData.plantformKey
  log.logWarn("将要保存的平台key", ptypeKey)
  if (isDynamicKeyExists(ptypeKey)) {
    ElMessage.error(t('dynamic.platform.opt.key.exist'))
    return
  }

  // 保证开关变量key不重复
  const switchKey = "switch-" + ptypeKey
  const postidKey = "custom-postid-" + ptypeKey
  // 保证文章绑定id的key不重复
  if (checkKeyExists(pkey)
      || checkKeyExists(ptypeKey)
      || checkKeyExists(switchKey)
      || checkKeyExists(postidKey)
  ) {
    ElMessage.error(t('dynamic.platform.opt.key.exist'))
    return
  }

  if (!formEl) return
  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      log.logInfo("校验成功")
    } else {
      log.logError(t('main.opt.failure'), fields)
      // ElMessage.error(t('main.opt.failure'))
      return
    }
  })
  if (!result) {
    return
  }

  // 保存配置
  const newCfg = new DynamicConfig(ptypeKey, formData.plantformName)
  dynamicConfigArray.push(newCfg)

  setJSONConf<Array<DynamicConfig>>(CONSTANTS.DYNAMIC_CONFIG_KEY, dynamicConfigArray)
  // 刷新页面
  reloadTabPage()
  ElMessage.success(t('main.opt.success'))
}

const tableData: DynamicConfig[] = []
const num = ref(0)
const currentRow = ref()
const currentTip = ref(t('ynamic.platform.opt.item.select'))

const handleCurrentChange = (val: DynamicConfig | undefined) => {
  currentRow.value = val
  currentTip.value = t('dynamic.platform.opt.item.select.tip') + currentRow.value.plantformName
  log.logInfo(currentRow.value)
}

const isDynamicKeyExists = (key: string) => {
  let flag = false
  for (let i = 0; i < dynamicConfigArray.length; i++) {
    if (dynamicConfigArray[i].plantformKey == key) {
      flag = true;
      break;
    }
  }
  return flag
}

const delRow = async () => {
  if (!currentRow.value || !currentRow.value.plantformKey) {
    ElMessage.error(t('ynamic.platform.opt.item.no.select.tip'))
  }

  for (let i = 0; i < dynamicConfigArray.length; i++) {
    log.logInfo(currentRow.value.plantformKey)
    log.logInfo(dynamicConfigArray[i].plantformKey)
    log.logInfo("------------------------")
    if (currentRow.value.plantformKey == dynamicConfigArray[i].plantformKey) {
      dynamicConfigArray.splice(i, 1);
    }
  }

  setJSONConf<Array<DynamicConfig>>(CONSTANTS.DYNAMIC_CONFIG_KEY, dynamicConfigArray)
  // 刷新页面
  reloadTabPage()
  ElMessage.success(t('main.opt.success'))
}

const initPage = async () => {
  dynamicConfigArray = getArrayJSONConf<Array<DynamicConfig>>(CONSTANTS.DYNAMIC_CONFIG_KEY)

  // 渲染table
  for (let i = 0; i < dynamicConfigArray.length; i++) {
    tableData.push(dynamicConfigArray[i])
  }
  num.value = dynamicConfigArray.length

  log.logInfo("dynamic init page=>", dynamicConfigArray)
}

onMounted(async () => {
  await initPage()
})
</script>

<script lang="ts">
export default {
  name: "DynamicPlantform"
}
</script>

<style scoped>

</style>