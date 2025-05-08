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
import { alert } from "@components/Alert.ts"
import { messageBox } from "@components/MessageBox.ts"
import SettingPlatformSelect from "@components/SettingPlatformSelect.vue"
import { useI18n } from "@composables/useI18n.ts"
import { usePublishSettingStore } from "@stores/usePublishSettingStore.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { Rss, Settings, Trash2 } from "lucide-vue-next"
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
              handler: (event: MouseEvent, platform: AbstractPlatform) => {
                console.log("set", platform.name)
                event.stopPropagation()
              },
            },
            {
              type: "button",
              icon: Trash2,
              label: t("account.delete"),
              handler: (event: MouseEvent, platform: AbstractPlatform) => {
                event.stopPropagation()
                messageBox.confirm({
                  title: t("account.confirm.delete.title"),
                  content: t("account.confirm.delete.content"),
                  showConfirm: false,
                  showCancel: false,
                  buttons: [
                    {
                      text: t("account.confirm.delete.confirm"),
                      type: "danger",
                      handler: () => {
                        alert({
                          title: t("account.afterDelete.success.title"),
                          message: t(
                            "account.afterDelete.success.message",
                          ).replace("{platformName}", platform.name),
                          type: "success",
                          duration: 1000,
                        })
                        return true
                      },
                    },
                    {
                      text: t("account.confirm.delete.cancel"),
                      type: "default",
                      handler: () => {
                        return true
                      },
                    },
                  ],
                })
              },
            },
            {
              type: "toggle",
              label: t("account.enable"),
              value: item.isEnabled,
              handler: (event: MouseEvent, platform: AbstractPlatform) => {
                platform.enabled = !platform.enabled
                item.isEnabled = platform.enabled
                event.stopPropagation()
              },
            },
          ],
        } as AbstractPlatform
      }) ?? []
    logger.debug("account setting init success")
  },
)

onMounted(async () => {
  await publishSettingStore.doInit()
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
