import { ref, computed, nextTick, onMounted, onUnmounted } from "vue"

export type Placement = "top" | "bottom" | "left" | "right"

export interface TooltipProps {
  placement: Placement
  mouseEnterDelay: number
  mouseLeaveDelay: number
}

export function useTooltip(props: TooltipProps) {
  const visible = ref(false)
  const triggerRef = ref<HTMLElement | null>(null)
  const tooltipRef = ref<HTMLElement | null>(null)
  let enterTimer: number | null = null
  let leaveTimer: number | null = null

  const tooltipStyle = computed(() => {
    if (!visible.value || !triggerRef.value || !tooltipRef.value) return {}

    const triggerRect = triggerRef.value.getBoundingClientRect()
    const tooltipRect = tooltipRef.value.getBoundingClientRect()

    const baseStyle = {
      position: "fixed",
      zIndex: 1000,
    }

    const placementMap = {
      top: {
        left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
        top: triggerRect.top - tooltipRect.height - 8,
      },
      bottom: {
        left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
        top: triggerRect.bottom + 8,
      },
      left: {
        left: triggerRect.left - tooltipRect.width - 8,
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
      },
      right: {
        left: triggerRect.right + 8,
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
      },
    }

    return {
      ...baseStyle,
      ...placementMap[props.placement],
    }
  })

  const handleMouseEnter = () => {
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = null
    }
    enterTimer = window.setTimeout(() => {
      visible.value = true
    }, props.mouseEnterDelay * 1000)
  }

  const handleMouseLeave = () => {
    if (enterTimer) {
      clearTimeout(enterTimer)
      enterTimer = null
    }
    leaveTimer = window.setTimeout(() => {
      visible.value = false
    }, props.mouseLeaveDelay * 1000)
  }

  const handleScroll = () => {
    if (visible.value) {
      nextTick(() => {
        // 触发重新计算位置
        visible.value = false
        nextTick(() => {
          visible.value = true
        })
      })
    }
  }

  onMounted(() => {
    window.addEventListener("scroll", handleScroll, true)
  })

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll, true)
    if (enterTimer) clearTimeout(enterTimer)
    if (leaveTimer) clearTimeout(leaveTimer)
  })

  return {
    visible,
    triggerRef,
    tooltipRef,
    tooltipStyle,
    handleMouseEnter,
    handleMouseLeave
  }
} 