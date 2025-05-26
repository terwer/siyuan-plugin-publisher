<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
  title?: string
  bordered?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: "save"): void
  (e: "cancel"): void
}>()

const handleSave = () => {
  emit("save")
}

const handleCancel = () => {
  emit("cancel")
}
</script>

<template>
  <div class="pt-setting-panel" :class="{ 'pt-panel-bordered': bordered }">
    <!-- 头部 -->
    <div v-if="title" class="pt-panel-header">
      <h3 class="pt-panel-title">{{ title }}</h3>
    </div>

    <!-- 内容区 -->
    <div class="pt-panel-body" :class="{ 'pt-panel-loading': loading }">
      <slot></slot>
    </div>

    <!-- 底部 -->
    <div class="pt-panel-footer">
      <slot name="footer">
        <div class="pt-footer-actions">
          <button class="pt-btn pt-btn-default" @click="handleCancel">取消</button>
          <button class="pt-btn pt-btn-primary" @click="handleSave">保存</button>
        </div>
      </slot>
    </div>
  </div>
</template> 