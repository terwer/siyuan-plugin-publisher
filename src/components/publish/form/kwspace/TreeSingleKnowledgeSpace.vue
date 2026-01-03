<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ITreeSingleCategoryConfig } from "~/src/types/ICategoryConfig.ts"
import { onMounted, reactive, toRaw } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { ElMessage } from "element-plus"
import Adaptors from "~/src/adaptors"
import { CATE_AUTO_NAME } from "~/src/utils/constants.ts"

const logger = createAppLogger("tree-single-cateslugs")
const { t } = useVueI18n()

const props = defineProps({
  knowledgeSpaceConfig: {
    type: Object as () => ITreeSingleCategoryConfig,
    default: {},
  },
  cateSlugs: {
    type: Array,
    default: <string[]>[],
  },
})

const formData = reactive({
  knowledgeSpaceConfig: props.knowledgeSpaceConfig,
  cateSlugs: props.cateSlugs,
  path: {
    // 当前选中
    customPath: "",
    // 默认
    cacheData: [],
    // 树形目录选择
    customProps: {
      label: "label",
      children: "children",
      isLeaf: "isLeaf",
    },
  },
})

// emits
const emit = defineEmits(["emitSyncTreeSingleCateSlugs"])

// methods
const customLoad = async (node: any, resolve: any) => {
  if (node.isLeaf) return resolve([])

  // 获取远程分类列表
  const cfg = formData.knowledgeSpaceConfig.cfg
  const api = await Adaptors.getAdaptor(formData.knowledgeSpaceConfig.apiType, cfg)

  let docPath: string
  let parentDocPath = node.data.value || ""
  // 第一次加载并且保存过目录
  if (parentDocPath === "" && formData.path.customPath !== "") {
    docPath = ""
  } else {
    // 非首次加载或者首次加载但是没保存过目录
    if (parentDocPath === "") {
      parentDocPath = ""
    }
    // 子目录加载
    docPath = parentDocPath
  }

  const treeNode = await api.getCategoryTreeNodes(docPath)
  resolve(treeNode)
}

const onSelectChange = (val: any) => {
  logger.debug("onSelectChange=>", val)

  if (val.isLeaf) {
    ElMessage.error(t("knowledge.space.page.selected.error"))
    return
  }

  const value = val.value
  const cateSlugs = []
  cateSlugs.push(value)
  emit("emitSyncTreeSingleCateSlugs", cateSlugs)
}

onMounted(() => {
  const defaultPath = (formData.cateSlugs?.[0] ?? formData.knowledgeSpaceConfig?.cfg?.blogid) as string
  formData.path.customPath = defaultPath
  // 自动映射分类模式只读
  if (formData.path.customPath.includes(CATE_AUTO_NAME)) {
    formData.knowledgeSpaceConfig.readonlyMode = true
    formData.knowledgeSpaceConfig.cfg.placeholder.knowledgeSpaceReadonlyModeTip = t("knowledge.space.auto.map.tip")
  }
  logger.debug("init tree data, cateSlugs =>", { cateSlugs: toRaw(formData.cateSlugs) })
})
</script>

<template>
  <div class="tree-single-cateslugs" v-if="formData.knowledgeSpaceConfig.cateEnabled">
    <el-form-item :label="t('main.publish.github.choose.path')">
      <el-tree-select
        v-model="formData.path.customPath"
        lazy
        :load="customLoad"
        :props="formData.path.customProps"
        :check-strictly="true"
        :empty-text="t('main.data.empty')"
        :no-data-text="t('main.data.empty')"
        :placeholder="t('main.opt.select')"
        :disabled="formData.knowledgeSpaceConfig.readonlyMode"
        @node-click="onSelectChange"
      />
    </el-form-item>
    <el-form-item v-if="formData.knowledgeSpaceConfig.readonlyMode">
      <el-alert
        :closable="false"
        :title="formData.knowledgeSpaceConfig.cfg?.placeholder?.knowledgeSpaceReadonlyModeTip"
        class="form-item-tip"
        type="warning"
      />
    </el-form-item>
    <div class="form-item-bottom"></div>
  </div>
</template>

<style scoped lang="stylus">
.form-item-tip
  padding 2px 4px
  margin 0 10px 0 0

.form-item-bottom
  margin-bottom 16px

.tree-single-cateslugs
  :deep(.el-form-item)
    margin-bottom 0
</style>
