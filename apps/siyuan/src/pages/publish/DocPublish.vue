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
import { AuthMode, DynamicConfig } from "@/models/dynamicConfig.ts"
import { AbstractPlatform } from "@/types"
import PublishPlatformSelect from "@components/PublishPlatformSelect.vue"
import { useI18n } from "@composables/useI18n.ts"
import { usePublishSettingStore } from "@stores/usePublishSettingStore.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { cloneDeep } from "lodash-es"
import { Clock, Zap } from "lucide-vue-next"
import { onMounted, onUnmounted, ref } from "vue"
import { TabEnum } from "@enums/TabEnum.ts"
// import { HookManager } from "@/plugin/hooks/manager"
// import { HookStage } from "@/plugin/hooks/types"
// import { Post } from "zhi-blog-api"

const publishSettingStore = usePublishSettingStore()
// const { loadPlugin, getPlugin } = usePlugin()
// const pluginStore = usePluginStore()

const props = defineProps<{
  pluginInstance: any
  requestSwitchTab?: (componentType: TabEnum) => void
}>()

const logger = createAppLogger("account-setting")
const { t } = useI18n(props.pluginInstance)

const platforms = ref<AbstractPlatform[]>([])

// const hookManager = HookManager.getInstance()

// 注册初始化完成回调
const unregisterPublishSettingStore = publishSettingStore.registerOnInit(
  async () => {
    const totalCfg = cloneDeep(
      publishSettingStore.readonlyState[DYNAMIC_CONFIG_KEY]?.totalCfg,
    )
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
                handler: async (
                  event: MouseEvent,
                  platform: AbstractPlatform,
                ) => {
                  event.stopPropagation()
                  //   try {
                  //     const plugin = getPlugin(platform.platformType)
                  //     if (!plugin) {
                  //       throw new Error(
                  //         `Plugin not found: ${platform.platformType}`,
                  //       )
                  //     }
                  //
                  //     // 1. 调用内容预处理 Hook
                  //     const processResult = await hookManager.executeHooks(
                  //       HookStage.BEFORE_PROCESS,
                  //       {
                  //         post: { title: "Test post", description: "" } as Post,
                  //         config: plugin.defaultConfig,
                  //         platform: platform.platformType,
                  //         metadata: {},
                  //       },
                  //     )
                  //     if (!processResult.success) {
                  //       const errorMsg = `Content processing failed: ${processResult.error?.message}`
                  //       logger.error(errorMsg)
                  //       throw new Error(errorMsg)
                  //     }
                  //
                  //     // 2. 调用发布前 Hook
                  //     const publishResult = await hookManager.executeHooks(
                  //       HookStage.BEFORE_PUBLISH,
                  //       {
                  //         post: processResult.data.post,
                  //         config: plugin.defaultConfig,
                  //         platform: platform.platformType,
                  //         metadata: {},
                  //       },
                  //     )
                  //     if (!publishResult.success) {
                  //       const errorMsg = `Pre-publish processing failed: ${publishResult.error?.message}`
                  //       logger.error(errorMsg)
                  //       throw new Error(errorMsg)
                  //     }
                  //
                  //     // 3. 执行发布
                  //     try {
                  //       const postId = await plugin.publish(
                  //         publishResult.data.post,
                  //       )
                  //       logger.info(
                  //         `Post published successfully with ID: ${postId}`,
                  //       )
                  //     } catch (publishError: any) {
                  //       const errorMsg = `Failed to publish post: ${publishError}`
                  //       logger.error(errorMsg)
                  //       throw new Error(errorMsg)
                  //     }
                  //   } catch (e: any) {
                  //     logger.error(`Quick publish failed: ${e}`)
                  //   }
                },
              },
              {
                type: "button",
                icon: Clock,
                label: t("publish.normal"),
                handler: async (
                  event: MouseEvent,
                  platform: AbstractPlatform,
                ) => {
                  event.stopPropagation()
                  // try {
                  //   const plugin = getPlugin(platform.platformType)
                  //   if (!plugin) {
                  //     throw new Error(
                  //       `Plugin not found: ${platform.platformType}`,
                  //     )
                  //   }
                  //   // TODO: 实现普通发布逻辑
                  // } catch (e: any) {
                  //   logger.error(`Normal publish failed: ${e}`)
                  // }
                },
              },
            ],
          } as AbstractPlatform
        }) ?? []
  },
)

onMounted(async () => {
  await publishSettingStore.doInit()
  logger.debug("publish setting init")

  // 加载插件
  // try {
  //   await loadPlugin("/plugins/wordpress/index.js")
  //   logger.info("WordPress plugin loaded")
  // } catch (e: any) {
  //   logger.error(`Failed to load WordPress plugin: ${e}`)
  // }
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
