<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const { t } = useVueI18n()
</script>

<template>
  <div class="publish-tips">
    <el-alert
      :closable="false"
      :title="t('publish.tips.multi.platform')"
      class="top-tip"
      type="info"
    />
  </div>
</template>

<style scoped lang="stylus">
.top-tip
  margin 10px 0
</style>
