<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import SinglePublishSelectPlatform from "~/src/components/publish/SinglePublishSelectPlatform.vue"
import { getWidgetId } from "~/src/utils/widgetUtils.ts"
import { useRoute, useRouter } from "vue-router"

const { query } = useRoute()
const router = useRouter()
const id = (query.id ?? getWidgetId()) as string

const openSingleDoPublish = (key: string, pageId: string, method: string) => {
  const path = `/publish/singlePublish/doPublish/${key}/${pageId}`
  router.push({
    path: path,
    query: {
      showBack: "true",
      method: method,
    },
  })
}
</script>

<template>
  <single-publish-select-platform :id="id" @open="openSingleDoPublish" />
</template>
