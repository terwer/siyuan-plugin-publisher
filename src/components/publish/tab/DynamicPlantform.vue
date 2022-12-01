<template>
  <el-container>
    <el-header height="300px" class="publish-dyn-header">
      <el-form label-width="165px" ref="formRef" :model="formData.dynCfg" :rules="rules">
        <el-alert class="top-version-tip" :title="$t('dynamic.platform.tip')" type="info" :closable="false"/>

        <!-- 平台类型 -->
        <el-form-item :label="$t('dynamic.platform.type')">
          <el-button-group>
            <el-button :type="formData.ptype===PlantformType.Github?'primary':''" @click="onPlantformTypeChange(PlantformType.Github)">
              {{ $t('dynamic.platform.type.github') }}
            </el-button>
            <el-button :type="formData.ptype===PlantformType.Metaweblog?'primary':''" @click="onPlantformTypeChange(PlantformType.Metaweblog)">
              {{ $t('dynamic.platform.type.metaweblog') }}
            </el-button>
            <el-button :type="formData.ptype===PlantformType.Wordpress?'primary':''" @click="onPlantformTypeChange(PlantformType.Wordpress)">
              {{ $t('dynamic.platform.type.wordpress') }}
            </el-button>
            <el-button :type="formData.ptype===PlantformType.Custom?'primary':''" @click="onPlantformTypeChange(PlantformType.Custom)">
              {{ $t('dynamic.platform.type.custom') }}
            </el-button>
          </el-button-group>
        </el-form-item>

        <!-- 临时页面 -->
        <el-form-item v-if="!showForm">
          <el-alert title="敬请期待" type="info" :closable="false"/>
        </el-form-item>

        <!-- 平台名称 -->
        <el-form-item v-if="formData.subtypeOptions.length>0 && showForm">
          <el-select v-model="formData.subtype" class="m-2" placeholder="Select" @change="onSubPlantformTypeChange">
            <el-option
                v-for="item in formData.subtypeOptions"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="formData.ptype+$t('dynamic.platform.name')" prop="plantformName" v-if="showForm">
          <el-input v-model="formData.dynCfg.plantformName" :placeholder="$t('dynamic.platform.name.tip')"/>
        </el-form-item>

        <el-form-item :label="formData.ptype+$t('dynamic.platform.key')" prop="plantformKey" v-if="false">
          {{ formData.dynCfg.plantformKey }}
        </el-form-item>

        <el-form-item v-if="showForm">
          <el-button type="primary" @click="submitForm(formRef)">{{ $t('dynamic.platform.opt.add') }}</el-button>
        </el-form-item>
      </el-form>
    </el-header>

    <!-- 动态列表 -->
    <el-main class="dyn-table-list">
      <el-form-item>
        <el-table :data="tableData" :key="num" border stripe highlight-current-row
                  empty-text="暂无数据"
                  @current-change="handleCurrentChange">
          <el-table-column prop="plantformType" :label="$t('dynamic.platform.type')"/>
          <el-table-column prop="subPlantformType" :label="$t('dynamic.platform.subtype')"/>
          <el-table-column prop="plantformKey" :label="$t('dynamic.platform.key')"/>
          <el-table-column prop="plantformName" :label="$t('dynamic.platform.name')"/>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-alert class="top-version-tip" :title="currentTip" type="info" :closable="false" v-if="currentRow"/>
        <el-button type="danger" @click="delRow">{{ $t('dynamic.platform.opt.del.select') }}</el-button>
      </el-form-item>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {
  DynamicConfig,
  getDefaultPlatfoemName,
  getDynamicJsonCfg,
  getNewPlatformKey,
  getSubtypeList,
  isDynamicKeyExists,
  PlantformType,
  setDynamicJsonCfg,
  SubPlantformType
} from "~/utils/dynamicConfig";
import {onMounted, reactive, ref} from "vue";
import logUtil from "~/utils/logUtil";
import {ElMessage, ElMessageBox, FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";
import {checkKeyExists} from "~/utils/config";

const {t} = useI18n()

const showForm = ref(true)

const formRef = ref<FormInstance>()
const formData = reactive({
  subtype: SubPlantformType.Github_pages,
  ptype: PlantformType.Github,
  dynCfg: new DynamicConfig(PlantformType.Github, getNewPlatformKey(PlantformType.Github, SubPlantformType.Github_pages), ""),
  subtypeOptions: <Array<SubPlantformType>>[],
  dynamicConfigArray:<Array<DynamicConfig>>[]
})
const rules = reactive<FormRules>({
  plantformName: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
})

const onSubPlantformTypeChange = (val: SubPlantformType) => {
  formData.subtype = val
  logUtil.logInfo(formData.subtype)

  onPlantformTypeChange(formData.ptype)
}

const onPlantformTypeChange = (val: PlantformType) => {
  formData.ptype = val
  formData.subtypeOptions = getSubtypeList(val)
  const pname = getDefaultPlatfoemName(val, formData.subtype,
      formData.subtypeOptions.length > 0 && formData.subtype != SubPlantformType.NONE)
  formData.dynCfg = new DynamicConfig(val, getNewPlatformKey(val,
          formData.subtypeOptions.length > 0 ? formData.subtype : SubPlantformType.NONE),
      pname)
  showForm.value = formData.ptype != PlantformType.Custom
  logUtil.logInfo(formData.ptype)
}

const validateForm = (formEl: FormInstance | undefined) => {
  // 类型校验
  if (formData.ptype == PlantformType.Custom) {
    ElMessage.error(t('dynamic.platform.opt.noselect'))
    return false
  }

  // 平台key必须唯一
  const pkey = formData.dynCfg.plantformKey
  logUtil.logInfo("将要保存的平台key", pkey)
  if (isDynamicKeyExists(formData.dynamicConfigArray, pkey)) {
    ElMessage.error(t('dynamic.platform.opt.key.exist'))
    return false
  }

  // 保证开关变量key不重复
  const switchKey = "switch-" + pkey
  const postidKey = "custom-" + pkey + "-post-id"
  // 保证文章绑定id的key不重复
  if (checkKeyExists(pkey)
      || checkKeyExists(switchKey)
      || checkKeyExists(postidKey)
  ) {
    ElMessage.error(t('dynamic.platform.opt.key.exist'))
    return false
  }

  return true
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if(!validateForm(formEl)){
    return
  }

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
  const newCfg = new DynamicConfig(formData.ptype, formData.dynCfg.plantformKey, formData.dynCfg.plantformName)
  newCfg.subPlantformType = formData.subtype
  formData.dynamicConfigArray.push(newCfg)
  setDynamicJsonCfg(formData.dynamicConfigArray)

  // 重新加载列表
  reloadTable()

  ElMessage.success(t('main.opt.success'))
}

const tableData: DynamicConfig[] = []
const num = ref(0)
const currentRow = ref()
const currentTip = ref(t('dynamic.platform.opt.item.select'))

const handleCurrentChange = (val: DynamicConfig | undefined) => {
  currentRow.value = val
  currentTip.value = t('dynamic.platform.opt.item.select.tip') + currentRow.value.plantformName
  logUtil.logInfo(currentRow.value)
}

const delRow = async () => {
  ElMessageBox.confirm(
      t('dynamic.platform.opt.del.confirm'),
      t('main.opt.warning'),
      {
        confirmButtonText: t('main.opt.ok'),
        cancelButtonText: t('main.opt.cancel'),
        type: 'warning',
      }
  ).then(async () => {
    if (!currentRow.value || !currentRow.value.plantformKey) {
      ElMessage.error(t('dynamic.platform.opt.item.no.select.tip'))
      return
    }

    for (let i = 0; i < formData.dynamicConfigArray.length; i++) {
      // logUtil.logInfo(currentRow.value.plantformKey)
      // logUtil.logInfo(formData.dynamicConfigArray[i].plantformKey)
      // logUtil.logInfo("------------------------")
      if (currentRow.value.plantformKey == formData.dynamicConfigArray[i].plantformKey) {
        formData.dynamicConfigArray.splice(i, 1);
      }
    }

    setDynamicJsonCfg(formData.dynamicConfigArray)

    // 重新加载列表
    reloadTable()

    ElMessage.success(t('main.opt.success'))
  }).catch(() => {
    // ElMessage({
    //   type: 'error',
    //   message: t("main.opt.failure"),
    // })
    logUtil.logInfo("操作已取消")
  });
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
  formData.subtypeOptions = getSubtypeList(PlantformType.Github)
  formData.dynamicConfigArray = getDynamicJsonCfg().totalCfg || []

  // 重新加载列表
  reloadTable()

  logUtil.logInfo("dynamic init page=>", formData.dynamicConfigArray)
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
.dyn-table-list{
}
</style>