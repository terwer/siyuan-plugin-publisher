<script setup lang="ts">
import { computed } from "vue"
import type { TabItem } from "../types"

interface Props {
  items: TabItem[]
  modelValue?: string | number
  type?: "line" | "card" | "button-group"
  size?: "small" | "middle" | "large"
}

const props = withDefaults(defineProps<Props>(), {
  type: "line",
  size: "middle",
  modelValue: "",
})

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void
  (e: "change", value: string | number): void
}>()

const activeKey = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value)
    emit("change", value)
  },
})

// 初始化时设置默认值
if (!props.modelValue && props.items.length > 0) {
  emit("update:modelValue", props.items[0].key)
}

const handleTabClick = (key: string | number) => {
  activeKey.value = key
}
</script>

<template>
  <div class="tg-tabs" :class="[`tg-tabs-${type}`, `tg-tabs-${size}`]">
    <div class="tg-tabs-nav">
      <div
        v-for="item in items"
        :key="item.key"
        class="tg-tabs-tab"
        :class="{ 'tg-tabs-tab-active': activeKey === item.key }"
        @click="handleTabClick(item.key)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="tg-tabs-content">
      <div
        v-for="item in items"
        :key="item.key"
        class="tg-tabs-pane"
        :class="{ 'tg-tabs-pane-active': activeKey === item.key }"
      >
        <slot :name="item.key">{{ item.content }}</slot>
      </div>
    </div>
  </div>
</template>
