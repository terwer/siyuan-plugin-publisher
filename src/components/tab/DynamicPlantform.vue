<template>
  <el-container>
    <el-header height="250px" class="publish-dyn-header">
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
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button :type="pType===PlantformType.Custom?'primary':''"
                     @click="onPlantformTypeChange(PlantformType.Custom)">{{
              $t('dynamic.platform.type.custom')
            }}
          </el-button>
        </el-form-item>

        <el-form-item v-if="!showForm">
          <el-alert title="敬请期待" type="info" :closable="false"/>
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
                empty-text="暂无数据"
                @current-change="handleCurrentChange">
        <el-table-column prop="plantformType" :label="$t('dynamic.platform.type')"/>
        <el-table-column prop="plantformKey" :label="$t('dynamic.platform.key')"/>
        <el-table-column prop="plantformName" :label="$t('dynamic.platform.name')"/>
      </el-table>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {DynamicConfig, getDynamicJsonCfg, PlantformType, setDynamicJsonCfg} from "../../lib/dynamicConfig";
import {onMounted, reactive, ref} from "vue";
import logUtil from "../../lib/logUtil";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";
import {checkKeyExists} from "../../lib/config";
import {inBrowser, reloadTabPage, setUrlParameter} from "../../lib/util";

const {t} = useI18n()

const pType = ref()
pType.value = PlantformType.Metaweblog
const showForm = ref(true)

let dynamicConfigArray = reactive(<Array<DynamicConfig>>[])

const formRef = ref<FormInstance>()
const formData = reactive(new DynamicConfig(PlantformType.Metaweblog, "", ""))
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
  logUtil.logInfo(pType.value)
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
  logUtil.logWarn("将要保存的平台key", ptypeKey)
  if (isDynamicKeyExists(ptypeKey)) {
    ElMessage.error(t('dynamic.platform.opt.key.exist'))
    return
  }

  // 保证开关变量key不重复
  const switchKey = "switch-" + ptypeKey
  const postidKey = "custom-" + ptypeKey + "-post-id"
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
      logUtil.logInfo("校验成功")
    } else {
      logUtil.logError(t('main.opt.failure'), fields)
      // ElMessage.error(t('main.opt.failure'))
      return
    }
  })
  if (!result) {
    return
  }

  // 保存配置
  const newCfg = new DynamicConfig(pType.value, ptypeKey, formData.plantformName)
  dynamicConfigArray.push(newCfg)
  setDynamicJsonCfg(dynamicConfigArray)

  // 刷新页面
  reloadTabPage("dynamicp-platform")
  ElMessage.success(t('main.opt.success'))
}

const tableData: DynamicConfig[] = []
const num = ref(0)
const currentRow = ref()
const currentTip = ref(t('ynamic.platform.opt.item.select'))

const handleCurrentChange = (val: DynamicConfig | undefined) => {
  currentRow.value = val
  currentTip.value = t('dynamic.platform.opt.item.select.tip') + currentRow.value.plantformName
  logUtil.logInfo(currentRow.value)
}

const isDynamicKeyExists = (key: string) => {
  let flag = false
  logUtil.logInfo("isDynamicKeyExists,dynamicConfigArray=>")
  logUtil.logInfo(dynamicConfigArray)
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
    ElMessage.error(t('dynamic.platform.opt.item.no.select.tip'))
  }

  for (let i = 0; i < dynamicConfigArray.length; i++) {
    logUtil.logInfo(currentRow.value.plantformKey)
    logUtil.logInfo(dynamicConfigArray[i].plantformKey)
    logUtil.logInfo("------------------------")
    if (currentRow.value.plantformKey == dynamicConfigArray[i].plantformKey) {
      dynamicConfigArray.splice(i, 1);
    }
  }

  setDynamicJsonCfg(dynamicConfigArray)
  // 刷新页面
  reloadTabPage("dynamicp-platform")
  ElMessage.success(t('main.opt.success'))
}

const initPage = async () => {
  dynamicConfigArray = getDynamicJsonCfg().totalCfg || []

  // 渲染table
  for (let i = 0; i < dynamicConfigArray.length; i++) {
    tableData.push(dynamicConfigArray[i])
  }
  num.value = dynamicConfigArray.length

  logUtil.logInfo("dynamic init page=>", dynamicConfigArray)
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