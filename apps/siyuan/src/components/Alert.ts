import { h, render, type PropType } from "vue"

// 类型定义
type AlertType = "success" | "warning" | "error" | "info"

interface AlertOptions {
  title?: string
  message?: string
  description?: string
  type?: AlertType
  duration?: number
  closable?: boolean
}

// 组件定义
const AlertComponent = {
  props: {
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String as PropType<AlertType>,
      default: "info",
    },
    closable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["close"],
  setup(props: any, { emit }: any) {
    const handleBubble = (e: MouseEvent, callback?: Function) => {
      e.stopPropagation()
      e.preventDefault()
      callback?.()
    }

    const handleClose = (e: MouseEvent) => {
      handleBubble(e, () => emit("close"))
    }

    return () =>
      h(
        "div",
        {
          class: ["pt-alert", `pt-alert--${props.type}`],
          onClick: (e: MouseEvent) => handleBubble(e),
        },
        [
          h(
            "div",
            {
              class: ["pt-alert__icon", `pt-alert__icon--${props.type}`],
              onClick: (e: MouseEvent) => handleBubble(e),
            },
            h("span", getIcon(props.type)),
          ),

          h("div", { class: "pt-alert__content" }, [
            props.title && h("div", { class: "pt-alert__title" }, props.title),
            h("div", { class: "pt-alert__body" }, [
              props.message &&
                h("div", { class: "-alert__message" }, props.message),
              props.description &&
                h("div", { class: "pt-alert__description" }, props.description),
            ]),
          ]),

          props.closable &&
            h(
              "button",
              {
                class: ["pt-alert__close", `pt-alert__close--${props.type}`],
                onClick: (e: MouseEvent) => handleClose(e),
              },
              "×",
            ),
        ],
      )
  },
}

// 图标映射
const getIcon = (type: AlertType): string => {
  const icons = { success: "✓", warning: "⚠", error: "×", info: "i" }
  return icons[type] || ""
}

// 容器管理（完全按照您提供的 createContainer 结构）
let alertContainer: HTMLElement | null = null

const createContainer = () => {
  if (!alertContainer) {
    alertContainer = document.createElement("div")
    alertContainer.id = "__pt-alert-container__"
    alertContainer.className = "pt-alert-container"

    // 严格按您要求的定位方式
    alertContainer.style.position = "absolute"
    alertContainer.style.top = "20px"
    alertContainer.style.right = "20px"
    alertContainer.style.zIndex = "1000"

    // 强制挂载到指定元素
    const parent = document.getElementById("publisher") || document.body
    parent.appendChild(alertContainer)
  }
}

// 核心逻辑
const alert = (options: AlertOptions = {}): Promise<void> => {
  return new Promise((resolve) => {
    createContainer()
    const container = document.createElement("div")
    alertContainer?.appendChild(container)

    const destroy = () => {
      render(null, container)
      container.remove()
      if (alertContainer?.children.length === 0) {
        alertContainer.remove()
        alertContainer = null
      }
      resolve()
    }

    render(
      h(AlertComponent, {
        ...options,
        onClose: destroy,
      }),
      container,
    )

    if (options.duration) setTimeout(destroy, options.duration)
  })
}

export { alert }
