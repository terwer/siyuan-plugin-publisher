import { computed, useSlots } from "vue"

export type ButtonType = "default" | "primary" | "dashed" | "text" | "link"
export type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps {
  type: ButtonType
  size: ButtonSize
  shape?: string
  disabled: boolean
  loading: boolean
  danger: boolean
  block: boolean
  ghost: boolean
  href?: string
}

export function useButton(props: ButtonProps) {
  const slots = useSlots()

  const tagName = computed(() => (props.href ? "a" : "button"))
  const shapeClass = computed(() => (props.shape ? `pt-btn--shape-${props.shape}` : ""))
  const hasTwoChineseChars = computed(() => {
    const text = slots.default?.()?.[0]?.children?.toString() || ""
    return text.length === 2 && /^[\u4e00-\u9fa5]{2}$/.test(text)
  })

  const buttonClasses = computed(() => [
    `pt-btn--${props.type}`,
    `pt-btn--${props.size}`,
    shapeClass.value,
    {
      'pt-btn--icon-only': slots.icon && !slots.default && !props.loading,
      'pt-btn--loading': props.loading,
      'pt-btn--block': props.block,
      'pt-btn--danger': props.danger,
      'pt-btn--ghost': props.ghost,
      'pt-btn--disabled': props.disabled || props.loading,
      'pt-btn--two-chars': hasTwoChineseChars.value,
    },
  ])

  const handleClick = (e: MouseEvent) => {
    if (props.disabled || props.loading) return
    return e
  }

  return {
    tagName,
    buttonClasses,
    handleClick
  }
} 