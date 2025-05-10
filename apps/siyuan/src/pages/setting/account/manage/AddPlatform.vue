<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2022-2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { AuthMode } from "@/models/dynamicConfig.ts"
import { AbstractPlatform } from "@/types"
import { alert } from "@components/Alert.ts"
import BackPage from "@components/BackPage.vue"
import Button from "@components/Button.vue"
import { useI18n } from "@composables/useI18n.ts"
import { Check } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { TabEnum } from "@enums/TabEnum.ts"

const props = defineProps<{
  pluginInstance: any
}>()

const { t } = useI18n(props.pluginInstance)
const router = useRouter()
const route = useRoute()

const platform = ref<Partial<AbstractPlatform>>({
  name: "",
  type: "blog",
  authMode: AuthMode.API,
  enabled: true,
  actions: [],
})

const errorMsg = ref("")
const extra = ref([])

onMounted(() => {
  const templateKey = route.params.templateKey as string
  if (templateKey) {
    // TODO: 根据模板信息初始化表单
    console.log("Template key:", templateKey)
  }
})

const handleBack = () => {
  router.push({
    path: `/setting/account/templates`,
    query: {
      showBack: "true",
    },
  })
}

const handleSave = () => {
  if (!platform.value.name) {
    alert({
      title: t("common.error"),
      message: t("platform.nameRequired"),
      type: "error",
      position: "center",
    })
    return
  }

  // TODO: 处理保存平台的逻辑
  router.push({
    path: "/setting/account",
    query: {
      showBack: "true",
    },
  })
}
</script>

<template>
  <BackPage
    :plugin-instance="pluginInstance"
    :title="t('platform.add')"
    :has-back-emit="true"
    help-key="platform.add"
    :extra="extra"
    :error="errorMsg"
    @back-emit="handleBack"
  >
    <div class="form-container">
      <div class="form-group">
        <label>{{ t("platform.name") }}</label>
        <input
          v-model="platform.name"
          type="text"
          :placeholder="t('platform.namePlaceholder')"
        />
      </div>

      <div class="form-group">
        <label>{{ t("platform.type") }}</label>
        <select v-model="platform.type">
          <option value="blog">{{ t("platform.type.blog") }}</option>
          <option value="doc">{{ t("platform.type.doc") }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>{{ t("platform.authMode") }}</label>
        <select v-model="platform.authMode">
          <option :value="AuthMode.API">
            {{ t("platformSelect.authMode.api") }}
          </option>
          <option :value="AuthMode.WEB">
            {{ t("platformSelect.authMode.web") }}
          </option>
        </select>
      </div>

      <div class="form-actions">
        <Button size="md" @click="handleSave">
          <template #icon>
            <Check :size="16" />
          </template>
          {{ t("common.save") }}
        </Button>
      </div>
    </div>
  </BackPage>
</template>

<style lang="stylus" scoped>
.form-container
  max-width: 600px
  margin: 0 auto

  .form-group
    margin-bottom: 1.5rem

    label
      display: block
      margin-bottom: 0.5rem
      color: var(--pt-platform-text)
      font-weight: 500

    input, select
      width: 100%
      padding: 0.75rem
      border: 1px solid var(--pt-platform-border)
      border-radius: 4px
      background: var(--pt-platform-surface)
      color: var(--pt-platform-text)
      font-size: 1rem
      transition: all 0.2s

      &:focus
        outline: none
        border-color: var(--pt-platform-accent)
        box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2)

.form-actions
  display: flex
  justify-content: flex-end
  margin-top: 2rem
</style>
