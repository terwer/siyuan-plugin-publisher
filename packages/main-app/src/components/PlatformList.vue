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
          @update:config="(config: any) => handleConfigUpdate(platform, config)"
          @test="() => handleTestConnection(platform)"
        />
      </TgCard>
    </TgSpace>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { TgSpace, TgCard, TgSwitch } from "@terwer/ui"
import type { PlatformAdaptor, PlatformConfig } from "@siyuan-publisher/common"
import WordPressConfig from "./platform-configs/wordpress.vue"
import GitHubConfig from "./platform-configs/github.vue"

// interface Props {
//   platforms: PlatformAdaptor[]
// }
interface Props {
  platforms: any[]
}

interface Emits {
  (e: "platformToggle", platform: PlatformAdaptor): void
  (e: "configUpdate", platform: PlatformAdaptor, config: PlatformConfig): void
  (e: "testConnection", platform: PlatformAdaptor): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

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
const handlePlatformToggle = (platform: PlatformAdaptor) => {
  emit("platformToggle", platform)
}

// 处理配置更新
const handleConfigUpdate = (platform: PlatformAdaptor, config: PlatformConfig) => {
  emit("configUpdate", platform, config)
}

// 处理连接测试
const handleTestConnection = (platform: PlatformAdaptor) => {
  emit("testConnection", platform)
}
</script>

<style lang="stylus">
.platform-list
  .tg-card
    margin-bottom $tg-spacing-md
</style>
