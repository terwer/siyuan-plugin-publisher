<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="publish-tips">
    <el-alert :closable="false" :title="t('publish.batch.tips')" class="top-tip" type="info" />
  </div>
</template>

<script setup lang="ts">
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"

const { t } = useAppI18n()
</script>

<style scoped lang="stylus">
.top-tip
  margin 10px 0
</style>
