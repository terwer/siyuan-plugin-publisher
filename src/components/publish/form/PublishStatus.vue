<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { Post, PostStatusEnum } from "zhi-blog-api"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { reactive } from "vue"
import { DateUtil } from "zhi-common"

const { t } = useVueI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    default: {} as Post,
  },
})

const formData = reactive({
  status: props.modelValue?.post_status,
  password: props.modelValue?.wp_password,
})

const emit = defineEmits(["emitSyncPublishStatus"])

const handleStatusChange = () => {
  const status = formData.status
  const password = formData.password
  emit("emitSyncPublishStatus", status, password)
}
</script>

<template>
  <div>
    <!-- 发布状态 -->
    <el-form-item :label="t('publisher.post.status')">
      <el-radio-group v-model="formData.status" class="ml-4" @change="handleStatusChange">
        <el-radio :value="PostStatusEnum.PostStatusEnum_Publish" size="large">
          {{ t("publisher.post.status.pubish") }}
        </el-radio>
        <el-radio :value="PostStatusEnum.PostStatusEnum_Draft" size="large">
          {{ t("publisher.post.status.draft") }}
        </el-radio>
        <el-radio :value="PostStatusEnum.PostStatusEnum_Private" size="large">
          {{ t("publisher.post.status.private") }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="t('publisher.post.password')">
      <el-input
        type="password"
        v-model="formData.password"
        :placeholder="t('publisher.post.password.tip')"
        @input="handleStatusChange"
      />
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
