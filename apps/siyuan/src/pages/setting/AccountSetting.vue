<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { Settings, Trash2, Rss } from "lucide-vue-next"
import { onMounted, onUnmounted, ref } from "vue"
import { usePublishSettingStore } from "@stores/usePublishSettingStore.ts"
import { DYNAMIC_CONFIG_KEY } from "@/Constants.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { DynamicConfig } from "@/models/dynamicConfig.ts"
import { useI18n } from "@composables/useI18n.ts"
import SettingPlatformSelect from "@components/SettingPlatformSelect.vue"
import { confirm } from "siyuan"
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
    const totalCfg =
      publishSettingStore.readonlyState[DYNAMIC_CONFIG_KEY]?.totalCfg
    platforms.value =
      totalCfg?.map((item: DynamicConfig) => {
        return {
          name: item.platformName,
          icon: Rss,
          type: "blog",
          enabled: item.isEnabled,
          actions: [
            {
              type: "button",
              icon: Settings,
              label: t("account.set"),
              handler: (platform: AbstractPlatform) =>
                console.log("set", platform.name),
            },
            {
              type: "button",
              icon: Trash2,
              label: t("account.delete"),
              handler: (platform: AbstractPlatform) => {
                confirm(
                  "aaa",
                  "bbb",
                  () => {
                    alert(1)
                    console.log("delete", platform.name)
                  },
                  (event: any) => {},
                )
              },
            },
            {
              type: "toggle",
              label: t("account.enable"),
              value: item.isEnabled,
              handler: (platform: AbstractPlatform) => {
                platform.enabled = !platform.enabled
                item.isEnabled = platform.enabled
              },
            },
          ],
        } as AbstractPlatform
      }) ?? []
    logger.debug("account setting init success")
  },
)

onMounted(async () => {
  await publishSettingStore.doInit(false)
  logger.debug("account setting init")
})

// 组件卸载时注销回调
onUnmounted(() => {
  unregisterPublishSettingStore()
})
</script>

<template>
  <setting-platform-select
    :plugin-instance="props.pluginInstance"
    :platforms="platforms"
  />
</template>

<style lang="stylus" scoped></style>
