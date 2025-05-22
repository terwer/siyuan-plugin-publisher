<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { DYNAMIC_CONFIG_KEY } from "@/Constants.ts"
import { DynamicConfig } from "@/models/dynamicConfig.ts"
import { AuthMode } from "siyuan-plugin-publisher-types"
import { AbstractPlatform } from "@/types"
import PublishPlatformSelect from "@components/PublishPlatformSelect.vue"
import { useI18n } from "@composables/useI18n.ts"
import { usePublishSettingStore } from "@stores/usePublishSettingStore.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { cloneDeep } from "lodash-es"
import { Clock, Zap } from "lucide-vue-next"
import { DeepReadonly, onMounted, onUnmounted, ref } from "vue"
import { TabEnum } from "@enums/TabEnum.ts"
import { Post } from "zhi-blog-api"
import { usePublish } from "@composables/usePublish.ts"
import { SypConfig } from "@/models/sypConfig.ts"
import { alert } from "@components/Alert.ts"

const publishSettingStore = usePublishSettingStore()
const { quickPublish, normalPublish } = usePublish()

const props = defineProps<{
  pluginInstance: any
  requestSwitchTab?: (componentType: TabEnum) => void
}>()

const logger = createAppLogger("account-setting")
const { t } = useI18n(props.pluginInstance)

const platforms = ref<AbstractPlatform[]>([])

// 注册初始化完成回调
const unregisterPublishSettingStore = publishSettingStore.registerOnInit(async () => {
  const publishSetting = cloneDeep(publishSettingStore.readonlyState) as DeepReadonly<SypConfig>
  const totalCfg = publishSetting[DYNAMIC_CONFIG_KEY]?.totalCfg
  platforms.value =
    totalCfg
      ?.filter((item: DynamicConfig) => {
        return item.isEnabled
      })
      ?.map((item: DynamicConfig) => {
        return {
          name: item.platformName,
          icon: item.platformIcon,
          platformType: item.platformType,
          subPlatformType: item.subPlatformType,
          authMode: AuthMode.API,
          enabled: item.isEnabled,
          actions: [
            {
              type: "button",
              icon: Zap,
              label: t("publish.quick"),
              handler: async (event: MouseEvent, platform: AbstractPlatform) => {
                event.stopPropagation()
                try {
                  const post = {
                    title: "Test post",
                    description: "This a test post",
                  } as Post
                  const res = await quickPublish(post, item, publishSetting)
                  if (!res.success) {
                    void alert({
                      title: t("publish.quickFailed"),
                      message: res.error?.message || "unknown",
                      type: "error",
                      duration: 2000,
                    })
                    return
                  }
                  void alert({
                    title: t("publish.quick"),
                    message: t("publish.quickSuccess"),
                    type: "success",
                    duration: 1000,
                  })
                } catch (e: any) {
                  logger.error(`Quick publish failed: ${e}`)
                  void alert({
                    title: t("publish.quick"),
                    message: t("publish.quickFailed") + e,
                    type: "error",
                    duration: 0,
                  })
                }
              },
            },
            {
              type: "button",
              icon: Clock,
              label: t("publish.normal"),
              handler: async (event: MouseEvent, platform: AbstractPlatform) => {
                event.stopPropagation()
                try {
                  const post = {
                    title: "Test post",
                    description: "This a test post",
                  } as Post
                  await normalPublish(post, item, publishSetting)
                } catch (e: any) {
                  logger.error(`Normal publish failed: ${e}`)
                }
              },
            },
          ],
        } as AbstractPlatform
      }) ?? []
})

onMounted(async () => {
  await publishSettingStore.doInit()
  logger.debug("publish setting init")
})

// 组件卸载时注销回调
onUnmounted(() => {
  unregisterPublishSettingStore()
})
</script>

<template>
  <div class="publish-container">
    <publish-platform-select
      :plugin-instance="props.pluginInstance"
      :platforms="platforms"
      :request-switch-tab="props.requestSwitchTab"
    />
  </div>
</template>

<style lang="stylus" scoped>
.publish-container
  padding 16px 16px 6px 16px
  height 100%
  display flex
  flex-direction column
  overflow hidden
</style>
