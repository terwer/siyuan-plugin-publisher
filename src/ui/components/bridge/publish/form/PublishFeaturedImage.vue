<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"
import { Post } from "zhi-blog-api"
import { StrUtil } from "zhi-common"
import { ElMessage } from "element-plus"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { extractFirstImageOfPost, getFeaturedImage, uploadFeaturedImageAsset } from "~/src/utils/featuredImage.ts"

const logger = createAppLogger("publish-featured-image")
const { t } = useAppI18n()
const { kernelApi } = useSiyuanApi()
const { isInSiyuanOrSiyuanNewWin } = useSiyuanDevice()

const props = defineProps({
  modelValue: {
    type: Object,
    default: {} as Post,
  },
  /**
   * 平台是否会在没有自定义封面时自动使用题头图/正文首图。
   * 原生封面平台为 true；静态站 Front Matter 封面为 false，留空即不设置封面。
   */
  autoResolve: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["emitSyncFeaturedImage"])

const post = computed(() => props.modelValue as Post)
const hint = computed(() =>
  t(props.autoResolve ? "publisher.post.featuredImage.tip" : "publisher.post.featuredImage.tipYaml")
)

const formData = reactive({
  url: getFeaturedImage(post.value),
})

// 切换发布平台或重新打开表单时，父级会替换 modelValue；把已保存的封面同步到输入框。
// 用户输入时父级回写的值与当前值一致，不会打断编辑。
watch(
  () => getFeaturedImage(post.value),
  (value) => {
    const next = value ?? ""
    if (next !== formData.url) {
      formData.url = next
    }
  },
  { immediate: true }
)

const previewBroken = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement>()

// 上传依赖思源内核的资源接口，只在思源宿主内提供
const uploadEnabled = computed(() => isInSiyuanOrSiyuanNewWin())

// 正文里有图片时，允许一键引用正文首图，省去手填地址
const bodyImage = computed(() => extractFirstImageOfPost(post.value))

const previewUrl = computed(() => {
  const url = formData.url?.trim() ?? ""
  if (StrUtil.isEmptyString(url)) {
    return ""
  }
  if (/^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(url) || url.startsWith("data:")) {
    return url
  }
  // 思源资源相对路径（如 assets/xxx.png）按宿主源补全，便于直接预览
  return `${window.location.origin}/${url.replace(/^\.?\//, "")}`
})

watch(previewUrl, () => {
  previewBroken.value = false
})

const syncValue = () => {
  const url = formData.url?.trim() ?? ""
  emit("emitSyncFeaturedImage", url)
}

const useBodyImage = () => {
  if (StrUtil.isEmptyString(bodyImage.value)) {
    return
  }
  formData.url = bodyImage.value
  syncValue()
}

const pickImageFile = () => {
  fileInput.value?.click()
}

const onImageFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  // 清空选择，便于再次选择同一个文件
  input.value = ""
  if (!file) {
    return
  }

  uploading.value = true
  try {
    const assetPath = await uploadFeaturedImageAsset(kernelApi, file)
    formData.url = assetPath
    syncValue()
    ElMessage.success(t("publisher.post.featuredImage.uploadSuccess"))
  } catch (e: any) {
    logger.error("上传特色图片失败", e)
    ElMessage.error(e?.message || t("publisher.post.featuredImage.uploadFailed"))
  } finally {
    uploading.value = false
  }
}

const onPreviewError = () => {
  previewBroken.value = true
}
</script>

<template>
  <el-form-item :label="t('publisher.post.featuredImage')">
    <div class="featured-image">
      <div class="featured-image__row">
        <el-input
          v-model="formData.url"
          clearable
          :placeholder="hint"
          @input="syncValue"
        />
        <el-button
          v-if="uploadEnabled"
          class="featured-image__action"
          :loading="uploading"
          :disabled="uploading"
          @click="pickImageFile"
        >
          {{ t("publisher.post.featuredImage.upload") }}
        </el-button>
        <el-button v-if="!StrUtil.isEmptyString(bodyImage)" class="featured-image__action" @click="useBodyImage">
          {{ t("publisher.post.featuredImage.useBodyImage") }}
        </el-button>
      </div>
      <input
        ref="fileInput"
        class="featured-image__file"
        type="file"
        accept="image/*"
        @change="onImageFileChange"
      />
      <div v-if="!StrUtil.isEmptyString(previewUrl) && !previewBroken" class="featured-image__preview">
        <img :src="previewUrl" alt="" @error="onPreviewError" />
      </div>
    </div>
  </el-form-item>
</template>

<style scoped lang="stylus">
.featured-image
  width 100%

  &__row
    display flex
    gap 8px
    align-items center

  &__action
    flex-shrink 0

  &__file
    display none

  &__preview
    margin-top 8px
    max-width 240px
    max-height 160px
    overflow hidden
    border-radius 4px
    border 1px solid var(--b3-border-color)

    img
      display block
      width 100%
      height auto
      object-fit cover
</style>
