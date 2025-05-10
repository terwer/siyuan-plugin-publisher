<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2022-2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import {
  AuthMode,
  DynamicConfig,
  PlatformType,
} from "@/models/dynamicConfig.ts"
import {
  findConfigByKey,
  platformTemplates,
} from "@/presets/platformTemplates.ts"
import { alert } from "@components/Alert.ts"
import BackPage from "@components/BackPage.vue"
import Button from "@components/Button.vue"
import FormGroup from "@components/FormGroup.vue"
import { useI18n } from "@composables/useI18n.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { Check } from "lucide-vue-next"
import { onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const props = defineProps<{
  pluginInstance: any
}>()

const logger = createAppLogger("add-platform")
const { t } = useI18n(props.pluginInstance)
const router = useRouter()
const route = useRoute()

const config = platformTemplates(t)
const platform = ref<Partial<DynamicConfig>>({
  platformName: "",
  platformType: PlatformType.System,
  authMode: AuthMode.API,
  isEnabled: true,
})

const errorMsg = ref("")
const extra = ref([])

const platformSettingFormGroup = reactive({
  title: t("platform.add"),
  items: [
    {
      type: "input",
      label: t("platform.name"),
      value: platform.value.platformName,
      placeholder: t("platform.namePlaceholder"),
    },
    {
      type: "select",
      label: t("platform.type"),
      value: platform.value.platformType,
      options: [
        { label: t("platform.type.blog"), value: "blog" },
        { label: t("platform.type.doc"), value: "doc" },
      ],
    },
    {
      type: "select",
      label: t("platform.authMode"),
      value: platform.value.authMode,
      options: [
        { label: t("platformSelect.authMode.api"), value: AuthMode.API },
        { label: t("platformSelect.authMode.web"), value: AuthMode.WEB },
      ],
    },
  ],
})

const formGroups = [platformSettingFormGroup]

onMounted(() => {
  const templateKey = route.params.templateKey as string
  if (templateKey) {
    const templateConfig = findConfigByKey(templateKey, config)
    if (templateConfig) {
      platform.value = {
        ...platform.value,
        ...templateConfig,
      }
      logger.debug("get new Template:", platform.value)
    }
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
  if (!platform.value.platformName) {
    alert({
      title: t("common.error"),
      message: t("platform.nameRequired"),
      type: "error",
      position: "center",
    })
    return
  }

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
    <form-group
      v-for="(group, index) in formGroups"
      :key="index"
      :plugin-instance="pluginInstance"
      :form-group="group"
    />
    <div class="form-actions">
      <Button size="md" @click="handleSave">
        <template #icon>
          <Check :size="16" />
        </template>
        {{ t("common.save") }}
      </Button>
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
