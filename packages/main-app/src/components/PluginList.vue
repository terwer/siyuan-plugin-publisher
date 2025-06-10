<template>
  <div class="plugin-list">
    <TgSpace direction="vertical" size="large">
      <TgCard v-for="plugin in plugins" :key="plugin.id" :title="plugin.name">
        <template #extra>
          <TgSwitch v-model="plugin.enabled" @change="handlePluginToggle(plugin)" />
        </template>
        <div class="plugin-info">
          <p class="description">{{ plugin.description }}</p>
          <p class="version">版本：{{ plugin.version }}</p>
          <p class="type">类型：{{ getPluginType(plugin) }}</p>
        </div>
        <div class="plugin-actions">
          <TgButton type="primary" size="small" @click="handleConfigure(plugin)" v-if="plugin.enabled">
            配置
          </TgButton>
          <TgButton type="danger" size="small" @click="handleUninstall(plugin)">
            卸载
          </TgButton>
        </div>
      </TgCard>
    </TgSpace>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { TgSpace, TgCard, TgSwitch, TgButton } from "@terwer/ui"
import type { Plugin } from "@siyuan-publisher/common"

const props = defineProps<{
  plugins: Plugin[]
}>()

const emit = defineEmits<{
  (e: "pluginToggle", plugin: Plugin): void
  (e: "configure", plugin: Plugin): void
  (e: "uninstall", plugin: Plugin): void
}>()

// 获取插件类型
const getPluginType = (plugin: Plugin): string => {
  if ("connect" in plugin) {
    return "平台适配器"
  }
  return "普通插件"
}

// 处理插件开关
const handlePluginToggle = (plugin: Plugin) => {
  emit("pluginToggle", plugin)
}

// 处理插件配置
const handleConfigure = (plugin: Plugin) => {
  emit("configure", plugin)
}

// 处理插件卸载
const handleUninstall = (plugin: Plugin) => {
  emit("uninstall", plugin)
}
</script>

<style lang="stylus">
.plugin-list
  .tg-card
    margin-bottom $tg-spacing-md

  .plugin-info
    margin $tg-spacing-md 0

    .description
      color var(--tg-color-text-2)
      margin-bottom $tg-spacing-xs

    .version, .type
      color var(--tg-color-text-3)
      font-size $tg-font-size-sm
      margin-bottom $tg-spacing-xs

  .plugin-actions
    display flex
    gap $tg-spacing-sm
    justify-content flex-end
</style> 