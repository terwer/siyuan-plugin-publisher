<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2022-2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { PlatformType, SubPlatformType } from "@/models/dynamicConfig.ts"
import { mainPre, pre } from "@/presets/pre.ts"
import BackPage from "@components/BackPage.vue"
import Svg from "@components/Svg.vue"
import { useI18n } from "@composables/useI18n.ts"
import { TabEnum } from "@enums/TabEnum.ts"
import { ref } from "vue"
import { useRouter } from "vue-router"

const props = defineProps<{
  pluginInstance: any
}>()

const { t } = useI18n(props.pluginInstance)
const router = useRouter()
const errorMsg = ref("")
const extra = ref([])

// 平台模板列表
const platformTemplatesList = ref(mainPre(t))
const preConfig = pre(t) as any

const handleBack = () => {
  router.push(`/?tab=${TabEnum.ACCOUNT}`)
}

const handleSelectTemplate = (templateKey: string) => {
  router.push({
    path: `/setting/account/add/${templateKey}`,
    query: {
      showBack: "true",
    },
  })
}
</script>

<template>
  <back-page
    :title="t('platform.selectTemplate')"
    :plugin-instance="props.pluginInstance"
    :has-back-emit="true"
    :help-key="SubPlatformType.NONE"
    @back-emit="handleBack"
    :extra="extra"
    :error="errorMsg"
  >
    <div class="template-groups">
      <div
        v-for="group in platformTemplatesList"
        :key="group.type"
        class="template-group"
      >
        <h3 class="group-title">{{ group.title }}</h3>
        <div class="template-list">
          <div
            v-for="template in preConfig[group.type.toLowerCase() + 'Cfg']"
            :key="template.platformKey"
            class="template-card"
            @click.stop="handleSelectTemplate(template.platformKey)"
          >
            <div class="template-icon">
              <Svg :svg="template.platformIcon" />
            </div>
            <div class="template-info">
              <div class="template-name">{{ t(template.platformName) }}</div>
              <div class="template-type">
                {{
                  t(
                    template.platformType === PlatformType.Common
                      ? "platform.type.doc"
                      : "platform.type.blog",
                  )
                }}
              </div>
            </div>
            <div class="template-arrow">&#8594;</div>
          </div>
        </div>
      </div>
    </div>
  </back-page>
</template>

<style lang="stylus" scoped>
.platform-template-list
  // 基础变量
  --pt-platform-bg: #fff
  --pt-platform-surface: #edf2f7
  --pt-platform-text: #4a5568
  --pt-platform-text-hover: #2d3748
  --pt-platform-text-light: #718096
  --pt-platform-border: #cbd5e0
  --pt-platform-accent: #4299e1
  --pt-platform-accent-hover: #3182ce

  // 暗黑模式变量
  html[data-theme-mode="dark"] &
    --pt-platform-bg: #2d2d2d
    --pt-platform-surface: #363636
    --pt-platform-text: #e2e8f0
    --pt-platform-text-hover: #f8fafc
    --pt-platform-text-light: #a0aec0
    --pt-platform-border: #4a5568
    --pt-platform-accent: #63b3ed
    --pt-platform-accent-hover: #4299e1

.template-groups
  display: flex
  flex-direction: column
  gap: 24px
  padding: 16px 0

.template-group
  .group-title
    margin: 0 0 16px
    color: var(--pt-platform-text)
    font-size: 20px
    font-weight: 500
    padding-bottom: 12px
    border-bottom: 1px solid var(--pt-platform-border)

.template-list
  display: flex
  flex-direction: column
  gap: 4px

.template-card
  display: flex
  align-items: center
  padding: 8px 16px
  border: 1px solid var(--pt-platform-border)
  border-radius: 4px
  cursor: pointer
  transition: all 0.2s
  background: var(--pt-platform-bg)
  &:hover
    background: var(--pt-platform-surface)
    transform: translateX(4px)

  .template-icon
    width: 24px
    height: 24px
    margin-right: 12px
    img
      width: 100%
      height: 100%
      object-fit: contain

  .template-info
    display: flex
    align-items: center
    gap: 8px
    flex: 1
    .template-name
      color: var(--pt-platform-text)
      font-size: 14px
      font-weight: 500
    .template-type
      padding: 2px 8px
      background: var(--pt-platform-accent)
      color: white
      border-radius: 4px
      font-size: 12px
      font-weight: 500

  .template-arrow
    color: var(--pt-platform-text-light)
    font-size: 14px
    margin-left: 12px
</style>
