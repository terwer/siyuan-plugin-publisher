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
import { usePlugin } from "@/plugin/composables/usePlugin.ts"
import { BlogConfig, Post } from "zhi-blog-api"

const publishSettingStore = usePublishSettingStore()
const { loadPlugin, getPlugin } = usePlugin()

const props = defineProps<{
  pluginInstance: any
  requestSwitchTab?: (componentType: TabEnum) => void
}>()

const logger = createAppLogger("account-setting")
const { t } = useI18n(props.pluginInstance)

const platforms = ref<AbstractPlatform[]>([])

// const hookManager = HookManager.getInstance()

// 注册初始化完成回调
const unregisterPublishSettingStore = publishSettingStore.registerOnInit(async () => {
  const totalCfg = cloneDeep(publishSettingStore.readonlyState[DYNAMIC_CONFIG_KEY]?.totalCfg)
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
                  // 加载插件
                  const pluginPath = "wordpress/index.js"
                  const result = await loadPlugin(pluginPath)
                  if (result.error) {
                    throw new Error(`Failed to load plugin from ${pluginPath}: ${result.error}`)
                  }

                  // 读取插件元数据
                  const plugin = getPlugin(item.platformKey)
                  if (!plugin) {
                    throw new Error(`Plugin not found: ${item.platformKey}`)
                  }

                  // 执行发布
                  const post = {
                    title: "Test post",
                    description: "This a test post",
                  } as Post
                  const postRes = await plugin.publish(post, {
                    publishConfig: {
                      platformConfig: item,
                      blogConfig: {} as BlogConfig,
                    },
                  })
                  if (!postRes.success) {
                    const errorMsg = `Failed to publish post: ${postRes.error?.message}`
                    logger.error(errorMsg)
                    throw new Error(errorMsg)
                  }
                  const postId = postRes.data
                  logger.info(`Post published successfully with ID: ${postId}`)
                } catch (e: any) {
                  logger.error(`Quick publish failed: ${e}`)
                  throw new Error(`Quick publish failed: ${e}`)
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
                  // 加载插件
                  const pluginPath = "wordpress/index.js"
                  const result = await loadPlugin(pluginPath)
                  if (result.error) {
                    throw new Error(`Failed to load plugin from ${pluginPath}: ${result.error}`)
                  }

                  // 读取插件元数据
                  const plugin = getPlugin(item.platformKey)
                  if (!plugin) {
                    throw new Error(`Plugin not found: ${item.platformKey}`)
                  }

                  // TODO: 实现普通发布逻辑
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
