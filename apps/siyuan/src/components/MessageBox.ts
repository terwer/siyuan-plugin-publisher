// MessageBox.ts
import { h, render, type VNode, type Component } from "vue"
import {
  CheckCircle2,
  AlertTriangle,
  X,
  Info,
  HelpCircle,
} from "lucide-vue-next"
import { PUBLISHER_ROOT_ID } from "@/Constants.ts"

type MessageBoxType = "info" | "success" | "warning" | "error" | "confirm"
type ButtonType = "primary" | "default" | "danger"

interface MessageBoxButton {
  text: string
  type?: ButtonType
  handler?: (e: MouseEvent) => any
}

interface MessageBoxOptions {
  title?: string
  content?: string | VNode
  type?: MessageBoxType
  customContent?: Component | VNode
  buttons?: MessageBoxButton[]
  showCancel?: boolean
  showConfirm?: boolean
  cancelText?: string
  confirmText?: string
  parentContainer?: HTMLElement
}

const MessageBoxComponent = {
  props: {
    options: {
      type: Object as () => MessageBoxOptions,
      required: true,
    },
  },
  emits: ["close"],
  setup(props: any, { emit }: any) {
    const stopPropagation = (e: MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
    }

    const handleMaskClick = (e: MouseEvent) => {
      e.stopPropagation()
      // 可在此添加点击遮罩关闭逻辑
    }

    const getIcon = (): VNode => {
      const baseProps = {
        class: "pt-messagebox__icon-svg",
        size: 24,
        strokeWidth: 2,
      }

      const icons = {
        info: h(Info, baseProps),
        success: h(CheckCircle2, baseProps),
        warning: h(AlertTriangle, baseProps),
        error: h(X, baseProps),
        confirm: h(HelpCircle, baseProps),
      } as any

      return icons[props.options.type || "confirm"]
    }

    const handleAction = (handler?: (e: MouseEvent) => any, e?: MouseEvent) => {
      e?.stopPropagation()
      if (handler?.(e!) !== false) {
        emit("close")
      }
    }

    return () =>
      h(
        "div",
        {
          class: "pt-messagebox-mask",
          onClick: handleMaskClick,
        },
        [
          h(
            "div",
            {
              class: "pt-messagebox",
              onClick: stopPropagation,
            },
            [
              h("div", { class: "pt-messagebox__header" }, [
                h("div", { class: "pt-messagebox__icon" }, getIcon()),
                h(
                  "div",
                  { class: "pt-messagebox__title" },
                  props.options.title,
                ),
              ]),

              props.options.content &&
                h(
                  "div",
                  { class: "pt-messagebox__content" },
                  props.options.content,
                ),

              props.options.customContent && h(props.options.customContent),

              h("div", { class: "pt-messagebox__footer" }, [
                ...(props.options.buttons || []).map((btn: any) =>
                  h(
                    "button",
                    {
                      class: [
                        "pt-messagebox__btn",
                        `pt-messagebox__btn--${btn.type || "default"}`,
                      ],
                      onClick: (e) => {
                        e.stopPropagation()
                        handleAction(btn.handler, e)
                      },
                    },
                    btn.text,
                  ),
                ),

                ...(props.options.showCancel !== false
                  ? [
                      h(
                        "button",
                        {
                          class:
                            "pt-messagebox__btn pt-messagebox__btn--default",
                          onClick: (e) => {
                            e.stopPropagation()
                            handleAction(undefined, e)
                          },
                        },
                        props.options.cancelText || "取消",
                      ),
                    ]
                  : []),

                ...(props.options.showConfirm !== false
                  ? [
                      h(
                        "button",
                        {
                          class:
                            "pt-messagebox__btn pt-messagebox__btn--primary",
                          onClick: (e) => {
                            e.stopPropagation()
                            handleAction(undefined, e)
                          },
                        },
                        props.options.confirmText || "确定",
                      ),
                    ]
                  : []),
              ]),
            ],
          ),
        ],
      )
  },
}

const createContainer = () => {
  const container = document.createElement("div")
  const parent = document.getElementById(PUBLISHER_ROOT_ID) || document.body
  parent.appendChild(container)
  return container
}

const showMessageBox = (options: MessageBoxOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    const container = createContainer()

    const destroy = (result: boolean) => {
      render(null, container)
      container.remove()
      resolve(result)
    }

    render(
      h(MessageBoxComponent, {
        options: {
          ...options,
          buttons: options.buttons?.map((btn) => ({
            ...btn,
            handler: (e: MouseEvent) => {
              const result = btn.handler?.(e)
              destroy(result !== false)
              return result
            },
          })),
          showCancel: options.showCancel ?? true,
          showConfirm: options.showConfirm ?? true,
        },
        onClose: () => destroy(false),
      }),
      container,
    )
  })
}

/**
 * 显示消息框
 *
 *  ```
 *  // 基础用法
 *  messageBox.confirm({
 *      title: "确认删除",
 *      content: "确定要删除这个项目吗？"
 *  })
 *
 *  // 自定义按钮
 *  messageBox.custom({
 *      title: "操作确认",
 *      content: "请选择操作类型",
 *      buttons: [
 *          { text: "导出PDF", type: "default" },
 *          { text: "导出Excel", type: "primary" },
 *          { text: "取消", type: "danger" }
 *      ]
 *  })
 *
 *  // 自定义内容
 *  messageBox.confirm({
 *      title: "输入验证",
 *      customContent: h(InputComponent)
 *  })
 * ```
 *
 * @param options
 * @author terwer
 * @version 2.0.0
 * @since 2.0.0
 */
export const messageBox = {
  confirm: (options: MessageBoxOptions) =>
    showMessageBox({ type: "confirm", ...options }),
  info: (options: MessageBoxOptions) =>
    showMessageBox({ type: "info", ...options }),
  success: (options: MessageBoxOptions) =>
    showMessageBox({ type: "success", ...options }),
  warning: (options: MessageBoxOptions) =>
    showMessageBox({ type: "warning", ...options }),
  error: (options: MessageBoxOptions) =>
    showMessageBox({ type: "error", ...options }),
  custom: (options: MessageBoxOptions) => showMessageBox(options),
}
