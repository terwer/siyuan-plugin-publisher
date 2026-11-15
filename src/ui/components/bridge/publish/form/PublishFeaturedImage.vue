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
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { extractFirstImageOfPost, getFeaturedImage } from "~/src/utils/featuredImage.ts"

const { t } = useAppI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    default: {} as Post,
  },
})

const emit = defineEmits(["emitSyncFeaturedImage"])

const post = computed(() => props.modelValue as Post)

const formData = reactive({
  url: getFeaturedImage(post.value),
})

const previewBroken = ref(false)

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
          :placeholder="t('publisher.post.featuredImage.tip')"
          @input="syncValue"
        />
        <el-button v-if="!StrUtil.isEmptyString(bodyImage)" class="featured-image__pick" @click="useBodyImage">
          {{ t("publisher.post.featuredImage.useBodyImage") }}
        </el-button>
      </div>
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

  &__pick
    flex-shrink 0

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
