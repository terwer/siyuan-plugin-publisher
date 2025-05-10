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
import { AbstractPlatform } from "@/types"
import PublishPlatformSelect from "@components/PublishPlatformSelect.vue"
import { useI18n } from "@composables/useI18n.ts"
import { usePublishSettingStore } from "@stores/usePublishSettingStore.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { cloneDeep } from "lodash-es"
import { Clock, Zap } from "lucide-vue-next"
import { onMounted, onUnmounted, ref } from "vue"

const publishSettingStore = usePublishSettingStore()

const props = defineProps<{
  pluginInstance: any
}>()

const logger = createAppLogger("account-setting")
const { t } = useI18n(props.pluginInstance)

const platforms = ref<AbstractPlatform[]>([])

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
            type: "blog",
            enabled: item.isEnabled,
            actions: [
              {
                type: "button",
                icon: Zap,
                label: t("publish.quick"),
                handler: (event: MouseEvent, _platform: AbstractPlatform) => {
                  event.stopPropagation()
                  console.log("fast")
                },
              },
              {
                type: "button",
                icon: Clock,
                label: t("publish.normal"),
                handler: (event: MouseEvent, _platform: AbstractPlatform) => {
                  event.stopPropagation()
                  console.log("normal")
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
    />
  </div>
</template>

<style lang="stylus" scoped>
.publish-container
  padding 16px
  height 100%
  display flex
  flex-direction column
  overflow hidden
</style>
