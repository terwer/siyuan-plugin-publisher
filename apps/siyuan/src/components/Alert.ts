/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

// alert.ts
import { h, render, type VNode } from "vue"
import {
  CheckCircle2,
  AlertTriangle,
  X,
  Info,
  X as CloseIcon,
} from "lucide-vue-next"
import { PUBLISHER_ROOT_ID } from "@/Constants.ts"

type AlertType = "success" | "warning" | "error" | "info"

interface AlertOptions {
  title?: string
  message?: string
  description?: string
  type?: AlertType
  duration?: number
  closable?: boolean
}

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
      type: String,
      default: "info",
    },
    closable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["close"],
  setup(props: any, { emit }: any) {
    const handleClose = (e: MouseEvent) => {
      e.stopPropagation()
      emit("close")
    }

    const getIcon = (): VNode => {
      const baseProps = {
        class: "pt-alert__icon-svg",
        size: 18,
        strokeWidth: 2,
      }

      const icons = {
        success: h(CheckCircle2, baseProps),
        info: h(Info, baseProps),
        warning: h(AlertTriangle, baseProps),
        error: h(X, baseProps),
      } as any

      return icons[props.type] || icons.info
    }

    return () =>
      h(
        "div",
        {
          class: ["pt-alert", `pt-alert--${props.type}`],
        },
        [
          h("div", { class: "pt-alert__icon" }, getIcon()),

          h("div", { class: "pt-alert__content" }, [
            props.title && h("div", { class: "pt-alert__title" }, props.title),
            h("div", { class: "pt-alert__body" }, [
              props.message &&
                h("div", { class: "pt-alert__message" }, props.message),
              props.description &&
                h("div", { class: "pt-alert__description" }, props.description),
            ]),
          ]),

          props.closable &&
            h(
              "button",
              {
                class: "pt-alert__close",
                onClick: handleClose,
              },
              h(CloseIcon, {
                class: "pt-alert__close-icon",
                size: 12,
                strokeWidth: 2,
              }),
            ),
        ],
      )
  },
}

let alertContainer: HTMLElement | null = null

const createContainer = () => {
  if (!alertContainer) {
    alertContainer = document.createElement("div")
    alertContainer.className = "pt-alert-container"
    const parent = document.getElementById(PUBLISHER_ROOT_ID) || document.body
    parent.appendChild(alertContainer)
  }
}

/**
 * 消息提示
 *
 * @param options - 提示配置选项
 * @returns Promise 在提示关闭时 resolve
 *
 * @example 基础使用
 * alert({
 *   title: "操作成功",
 *   message: "数据已保存"
 * })
 *
 * @example 自动关闭
 * alert({
 *   type: "success",
 *   message: "上传完成",
 *   duration: 2000
 * })
 *
 * @example 错误提示
 * alert({
 *   type: "error",
 *   title: "发生错误",
 *   message: "无法连接服务器",
 *   description: "请检查网络连接后重试"
 * })
 *
 * @example 禁用关闭按钮
 * alert({
 *   message: "重要提示",
 *   closable: false
 * })
 */
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
