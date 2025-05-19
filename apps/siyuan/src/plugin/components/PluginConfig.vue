<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ref, watch } from "vue"
import { usePlugin } from "../composables/usePlugin"
import { usePluginStore } from "../stores/usePluginStore"
import FormGroup from "@components/FormGroup.vue"

const props = defineProps<{
  platform: string
  modelValue: any
  pluginInstance: any
}>()

const emit = defineEmits(["update:modelValue"])

const { getPlugin } = usePlugin()
const pluginStore = usePluginStore()

const plugin = getPlugin(props.platform)
const schema = ref(plugin?.configSchema)
const config = ref(props.modelValue)

// 将 schema 转换为 FormGroup 格式
const formGroups = ref([
  {
    title: "插件配置",
    items: Object.entries(schema.value?.properties || {}).map(([key, field]: [string, any]) => ({
      type:
        field.type === "boolean"
          ? "switch"
          : field.type === "number"
            ? "number"
            : field.type === "string" && field.format === "password"
              ? "password"
              : "input",
      label: field.title,
      value: config.value[key],
      placeholder: field.description,
      readonly: false,
      disabled: false,
    })),
  },
])

// 监听配置变化
watch(
  config,
  (newVal) => {
    emit("update:modelValue", newVal)
    pluginStore.updatePluginConfig(props.platform, newVal)
  },
  { deep: true },
)

const handleChange = (group: any, item: any, value: any) => {
  const key = Object.keys(schema.value?.properties || {}).find((k) => schema.value?.properties[k].title === item.label)
  if (key) {
    config.value[key] = value
  }
}
</script>

<template>
  <div class="plugin-config">
    <form-group
      v-for="(group, index) in formGroups"
      :key="index"
      :plugin-instance="pluginInstance"
      :form-group="group"
      @change="handleChange"
    />
  </div>
</template>

<style lang="stylus" scoped>
.plugin-config
  padding 16px
  background var(--b3-theme-background)
  border-radius 4px
</style>
