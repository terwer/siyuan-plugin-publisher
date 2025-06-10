<template>
  <div class="platform-list">
    <TgSpace direction="vertical" size="large">
      <TgCard v-for="platform in platforms" :key="platform.id" :title="platform.name">
        <template #extra>
          <TgSwitch v-model="platform.enabled" @change="handlePlatformToggle(platform)" />
        </template>
        <component
          :is="getPlatformConfigComponent(platform.type)"
          v-if="platform.enabled"
          :config="platform.config"
          @update:config="(config) => handleConfigUpdate(platform, config)"
          @test="() => handleTestConnection(platform)"
        />
      </TgCard>
    </TgSpace>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { TgSpace, TgCard, TgSwitch } from "@terwer/ui"
import type { PlatformAdapter, PlatformConfig } from "@siyuan-publisher/common"
import WordPressConfig from "./platform-configs/wordpress.vue"
import GitHubConfig from "./platform-configs/github.vue"

const props = defineProps<{
  platforms: PlatformAdapter[]
}>()

const emit = defineEmits<{
  (e: "platformToggle", platform: PlatformAdapter): void
  (e: "configUpdate", platform: PlatformAdapter, config: PlatformConfig): void
  (e: "testConnection", platform: PlatformAdapter): void
}>()

// 获取平台配置组件
const getPlatformConfigComponent = (type: string) => {
  switch (type) {
    case "wordpress":
      return WordPressConfig
    case "github":
      return GitHubConfig
    default:
      return null
  }
}

// 处理平台开关
const handlePlatformToggle = (platform: PlatformAdapter) => {
  emit("platformToggle", platform)
}

// 处理配置更新
const handleConfigUpdate = (platform: PlatformAdapter, config: PlatformConfig) => {
  emit("configUpdate", platform, config)
}

// 处理连接测试
const handleTestConnection = (platform: PlatformAdapter) => {
  emit("testConnection", platform)
}
</script>

<style lang="stylus">
.platform-list
  .tg-card
    margin-bottom $tg-spacing-md
</style> 