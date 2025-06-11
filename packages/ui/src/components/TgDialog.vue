<template>
  <Teleport to="body">
    <Transition name="tg-dialog-fade">
      <div
        v-if="modelValue"
        class="tg-dialog-wrapper"
        :class="{ 'tg-dialog-wrapper--center': center }"
        @click.self="handleWrapperClick"
      >
        <div class="tg-dialog" :class="[`tg-dialog--${size}`, { 'tg-dialog--center': center }]">
          <!-- 头部 -->
          <div v-if="showHeader" class="tg-dialog__header">
            <slot name="header">
              <span class="tg-dialog__title">{{ title }}</span>
            </slot>
            <button v-if="showClose" class="tg-dialog__headerbtn" @click="handleClose">
              <span class="tg-dialog__close">×</span>
            </button>
          </div>

          <!-- 内容 -->
          <div class="tg-dialog__body">
            <slot></slot>
          </div>

          <!-- 底部 -->
          <div v-if="$slots.footer" class="tg-dialog__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeUnmount } from "vue"

interface Props {
  modelValue: boolean
  title?: string
  width?: string | number
  fullscreen?: boolean
  top?: string
  modal?: boolean
  appendToBody?: boolean
  lockScroll?: boolean
  customClass?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  showHeader?: boolean
  center?: boolean
  size?: "small" | "default" | "large"
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  width: "50%",
  fullscreen: false,
  top: "15vh",
  modal: true,
  appendToBody: true,
  lockScroll: true,
  customClass: "",
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  showHeader: true,
  center: false,
  size: "default",
})

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "close"): void
  (e: "open"): void
  (e: "opened"): void
  (e: "closed"): void
}>()

const dialogStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width) {
    style.width = typeof props.width === "number" ? `${props.width}px` : props.width
  }
  if (props.top) {
    style.marginTop = props.top
  }
  return style
})

const handleClose = () => {
  emit("update:modelValue", false)
  emit("close")
}

const handleWrapperClick = () => {
  if (props.closeOnClickModal) {
    handleClose()
  }
}

// 监听 ESC 键
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.closeOnPressEscape) {
    handleClose()
  }
}

// 监听滚动锁定
const lockScroll = () => {
  if (props.lockScroll) {
    document.body.style.overflow = "hidden"
  }
}

const unlockScroll = () => {
  if (props.lockScroll) {
    document.body.style.overflow = ""
  }
}

// 监听对话框显示状态
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      emit("open")
      lockScroll()
      document.addEventListener("keydown", handleKeydown)
    } else {
      emit("closed")
      unlockScroll()
      document.removeEventListener("keydown", handleKeydown)
    }
  },
)

// 组件卸载时清理
onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown)
  unlockScroll()
})
</script>
