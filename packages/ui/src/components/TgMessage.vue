<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue"

const props = defineProps<{
  type?: "success" | "error" | "warning" | "info"
  message: string
  duration?: number
  onClose?: () => void
}>()

const visible = ref(false)
let timer: number | null = null

const close = () => {
  visible.value = false
  if (props.onClose) {
    props.onClose()
  }
}

const startTimer = () => {
  if (props.duration && props.duration > 0) {
    timer = window.setTimeout(() => {
      close()
    }, props.duration)
  }
}

onMounted(() => {
  visible.value = true
  startTimer()
})

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

// 计算消息类型类名
const messageClass = computed(() => {
  return {
    "tg-message": true,
    [`tg-message-${props.type || "info"}`]: true,
  }
})
</script>

<template>
  <Transition name="tg-fade">
    <div v-if="visible" :class="messageClass">
      <div class="tg-message-content">
        <span class="tg-message-text">{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>
