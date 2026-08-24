<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import SinglePublishDoPublish from "~/src/components/publish/SinglePublishDoPublish.vue"
import { useRoute, useRouter } from "vue-router"
import { getWidgetId } from "~/src/utils/widgetUtils.ts"

const route = useRoute()
const router = useRouter()

const key = route.params.key as string
const id = (route.params.id ?? getWidgetId()) as string
const method = (route.query.method as string) ?? ""
const showBack = route.query.showBack === "true"
</script>

<template>
  <single-publish-do-publish
    :key="key"
    :id="id"
    :method="method"
    :show-back="showBack"
    @back="router.push({ path: '/publish/singlePublish', query: { id } })"
  />
</template>
