<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { computed, onMounted, reactive, watch } from "vue"
import { ElMessage } from "element-plus"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import {
  IMAGE_UPLOAD_POLICY_ATTR,
  normalizeImageUploadPolicyValue,
  resolveImageUploadPolicyFromInputs,
  type ImageUploadPolicyDecision,
  type ImageUploadPolicyValue,
} from "~/src/utils/imageUploadPolicy.ts"

const props = defineProps({
  pageId: {
    type: String,
    default: "",
  },
})

const logger = createAppLogger("publish-image-upload-policy")
const { t } = useAppI18n()
const { kernelApi } = useSiyuanApi()
const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()

const formData = reactive({
  loading: true,
  saving: false,
  value: "follow" as ImageUploadPolicyValue,
  decision: undefined as ImageUploadPolicyDecision | undefined,
})

const dirMatched = computed(() => formData.decision?.source === "directory")
const effectiveSkip = computed(() => formData.decision?.skip === true)

const tip = computed(() => {
  if (formData.value === "skip") {
    return t("imagePolicy.tip.skip")
  }
  if (formData.value === "upload") {
    return t("imagePolicy.tip.upload")
  }
  return dirMatched.value ? t("imagePolicy.tip.dirMatched") : t("imagePolicy.tip.follow")
})

const load = async () => {
  if (!props.pageId) {
    formData.loading = false
    return
  }
  try {
    const attrs = await kernelApi.getBlockAttrs(props.pageId)
    formData.value = normalizeImageUploadPolicyValue(attrs?.[IMAGE_UPLOAD_POLICY_ATTR])
    await refreshDecision()
  } catch (e) {
    logger.error("read image upload policy failed", e)
    formData.value = "follow"
  } finally {
    formData.loading = false
  }
}

const refreshDecision = async () => {
  let block: any
  try {
    block = await kernelApi.getBlockByID(props.pageId)
  } catch (e) {
    // 目录信息读取失败时按「跟随设置」处理，不影响文档级开关
  }
  formData.decision = resolveImageUploadPolicyFromInputs({
    docAttrValue: formData.value,
    doc: {
      box: block?.box,
      path: block?.path,
    },
    rules: getReadOnlyPublishPreferenceSetting().value.imageUploadExcludeDirs,
  })
}

const save = async (next?: ImageUploadPolicyValue) => {
  if (!props.pageId) {
    return
  }
  const value = next ?? formData.value
  formData.value = value
  formData.saving = true
  try {
    // 跟随设置写空值，思源会移除该自定义属性
    await kernelApi.setSingleBlockAttr(props.pageId, IMAGE_UPLOAD_POLICY_ATTR, value === "follow" ? "" : value)
    await refreshDecision()
  } catch (e: any) {
    ElMessage.error(t("imagePolicy.saveFailed", { message: e?.message || String(e) }))
    logger.error("save image upload policy failed", e)
  } finally {
    formData.saving = false
  }
}

watch(
  () => props.pageId,
  async () => {
    formData.loading = true
    await load()
  }
)

onMounted(load)
</script>

<template>
  <el-form-item :label="t('imagePolicy.label')" class="image-upload-policy">
    <div class="image-upload-policy__body">
      <el-radio-group v-model="formData.value" :disabled="formData.loading || formData.saving" @change="save()">
        <el-radio value="follow">{{ t("imagePolicy.follow") }}</el-radio>
        <el-radio value="upload">{{ t("imagePolicy.upload") }}</el-radio>
        <el-radio value="skip">{{ t("imagePolicy.skip") }}</el-radio>
      </el-radio-group>
      <div class="image-upload-policy__tip" :class="{ 'is-warning': effectiveSkip }">
        {{ tip }}
      </div>
    </div>
  </el-form-item>
</template>

<style scoped lang="stylus">
.image-upload-policy
  margin-bottom 8px

.image-upload-policy__body
  display flex
  flex-direction column
  gap 4px

.image-upload-policy__tip
  color var(--b3-theme-on-surface-light, #666)
  font-size 12px
  line-height 1.5

  &.is-warning
    color var(--b3-theme-error, #d93025)
</style>
