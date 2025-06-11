export interface DialogProps {
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

export interface DialogEmits {
  (e: "update:modelValue", value: boolean): void
  (e: "close"): void
  (e: "open"): void
  (e: "opened"): void
  (e: "closed"): void
} 