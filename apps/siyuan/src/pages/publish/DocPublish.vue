<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import PublishPlatformSelect from "@components/PublishPlatformSelect.vue"
import { onMounted, onUnmounted, ref } from "vue"
import { DYNAMIC_CONFIG_KEY } from "@/Constants.ts"
import { DynamicConfig } from "@/models/dynamicConfig.ts"
import { Clock, Rss, Zap } from "lucide-vue-next"
import { usePublishSettingStore } from "@stores/usePublishSettingStore.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { useI18n } from "@composables/useI18n.ts"
import { cloneDeep } from "lodash-es"

const publishSettingStore = usePublishSettingStore()

const props = defineProps<{
  pluginInstance: any
}>()

const logger = createAppLogger("account-setting")
const { t } = useI18n(props.pluginInstance)

// 测试模式标志
const isTest = ref(true)
// 测试平台数量
const testPlatformCount = ref(30)

// 生成测试平台数据
const generateTestPlatforms = (count: number): AbstractPlatform[] => {
  const platforms: AbstractPlatform[] = []
  const platformNames = [
    "知乎",
    "CSDN",
    "掘金",
    "简书",
    "博客园",
    "微信公众号",
    "B站",
    "小红书",
  ]

  for (let i = 0; i < count; i++) {
    const platformName = `${platformNames[i % platformNames.length]}${Math.floor(i / platformNames.length) + 1}`
    platforms.push({
      name: platformName,
      icon: Rss,
      type: "blog",
      enabled: true,
      actions: [
        {
          type: "button",
          icon: Zap,
          label: t("publish.quick"),
          handler: (event: MouseEvent, _platform: AbstractPlatform) => {
            event.stopPropagation()
            console.log(`${platformName}快速发布`)
          },
        },
        {
          type: "button",
          icon: Clock,
          label: t("publish.normal"),
          handler: (event: MouseEvent, _platform: AbstractPlatform) => {
            event.stopPropagation()
            console.log(`${platformName}普通发布`)
          },
        },
      ],
    })
  }
  return platforms
}

const platforms = ref<AbstractPlatform[]>([])

// 注册初始化完成回调
const unregisterPublishSettingStore = publishSettingStore.registerOnInit(
  async () => {
    if (isTest.value) {
      // 使用测试数据
      platforms.value = generateTestPlatforms(testPlatformCount.value)
      logger.debug("使用测试数据初始化平台列表")
    } else {
      // 使用实际数据
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
              icon: Rss,
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
      logger.debug("使用实际数据初始化平台列表")
    }
  },
)

// 切换测试模式
const toggleTestMode = () => {
  isTest.value = !isTest.value
  if (isTest.value) {
    platforms.value = generateTestPlatforms(testPlatformCount.value)
  } else {
    publishSettingStore.doInit()
  }
}

// 更新测试平台数量
const updateTestPlatformCount = (count: number) => {
  if (count >= 20 && count <= 50) {
    testPlatformCount.value = count
    if (isTest.value) {
      platforms.value = generateTestPlatforms(count)
    }
  }
}

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
    <!-- 测试控制面板 -->
    <div v-if="isTest" class="test-controls">
      <div class="test-control-item">
        <label>测试模式：</label>
        <button @click.stop="toggleTestMode">关闭测试模式</button>
      </div>
      <div class="test-control-item">
        <label>平台数量：</label>
        <input type="number" v-model.number="testPlatformCount" min="20" max="50"
          @change="updateTestPlatformCount(testPlatformCount)" />
      </div>
    </div>
    <publish-platform-select :plugin-instance="props.pluginInstance" :platforms="platforms" />
  </div>
</template>

<style lang="stylus" scoped>
.publish-container
  padding 16px
  height 100%
  display flex
  flex-direction column
  overflow hidden

.test-controls
  margin-bottom 16px
  padding 12px
  background-color #f5f5f5
  border-radius 4px
  flex-shrink 0

.test-control-item
  margin-bottom 8px
  display flex
  align-items center
  gap 8px

  label
    min-width 80px

  input
    width 80px
    padding 4px 8px
    border 1px solid #ddd
    border-radius 4px

  button
    padding 4px 12px
    background-color #4a90e2
    color white
    border none
    border-radius 4px
    cursor pointer

    &:hover
      background-color #357abd
</style>
