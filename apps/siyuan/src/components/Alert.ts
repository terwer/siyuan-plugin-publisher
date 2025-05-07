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
        viewBox: "0 0 1024 1024",
        width: "1em",
        height: "1em",
        fill: "currentColor",
      }

      const icons = {
        success: h("svg", baseProps, [
          h("path", {
            d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 382.464L370.432 475.52a38.4 38.4 0 0 0 0 54.272 38.4 38.4 0 0 0 54.272 0l85.76-85.76 181.248-181.248a38.4 38.4 0 0 0 0-54.272 38.4 38.4 0 0 0-54.272 0L456.192 446.464z",
          }),
        ]),
        info: h("svg", baseProps, [
          h("path", {
            d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm32 672v-64h-64v64h64zm-32-448c-17.664 0-32 14.304-32 32v224c0 17.664 14.336 32 32 32s32-14.336 32-32V320c0-17.696-14.336-32-32-32z",
          }),
        ]),
        warning: h("svg", baseProps, [
          h("path", {
            d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-32 192v256h64V256h-64zm0 384v64h64v-64h-64z",
          }),
        ]),
        error: h("svg", baseProps, [
          h("path", {
            d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm252.16 571.904L571.904 764.16a38.4 38.4 0 0 1-54.272 0L512 734.528 454.4 792.128a38.4 38.4 0 0 1-54.272 0l-54.272-54.272a38.4 38.4 0 0 1 0-54.272L457.6 579.584 400 522.016a38.4 38.4 0 0 1 0-54.272l54.272-54.272a38.4 38.4 0 0 1 54.272 0L512 457.6l57.6-57.6a38.4 38.4 0 0 1 54.272 0l54.272 54.272a38.4 38.4 0 0 1 0 54.272L566.4 579.584l57.6 57.6a38.4 38.4 0 0 1 0 54.272l-54.272 54.272a38.4 38.4 0 0 1-54.272 0z",
          }),
        ]),
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
              h(
                "svg",
                {
                  class: "pt-alert__close-icon",
                  viewBox: "0 0 1024 1024",
                  width: "1em",
                  height: "1em",
                  fill: "currentColor",
                },
                [
                  h("path", {
                    d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm169.856 278.144a32 32 0 0 0-45.248-45.248L512 466.752 386.432 341.184a32 32 0 0 0-45.248 45.248L466.752 512 341.184 637.568a32 32 0 0 0 45.248 45.248L512 557.248l125.568 125.568a32 32 0 0 0 45.248-45.248L557.248 512l125.568-125.856z",
                  }),
                ],
              ),
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
    const parent = document.getElementById("publisher") || document.body
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
