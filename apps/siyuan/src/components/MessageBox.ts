// MessageBox.ts
import { h, render, type VNode, type Component } from "vue"

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
        viewBox: "0 0 1024 1024",
        width: "1.2em",
        height: "1.2em",
        fill: "currentColor",
      }

      const icons = {
        info: h("svg", baseProps, [
          h("path", {
            d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm32 672v-64h-64v64h64zm-32-448c-17.664 0-32 14.304-32 32v224c0 17.664 14.336 32 32 32s32-14.336 32-32V320c0-17.696-14.336-32-32-32z",
          }),
        ]),
        success: h("svg", baseProps, [
          h("path", {
            d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 382.464L370.432 475.52a38.4 38.4 0 0 0 0 54.272 38.4 38.4 0 0 0 54.272 0l85.76-85.76 181.248-181.248a38.4 38.4 0 0 0 0-54.272 38.4 38.4 0 0 0-54.272 0L456.192 446.464z",
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
        confirm: h("svg", baseProps, [
          h("path", {
            d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 672a48 48 0 1 0 0-96 48 48 0 0 0 0 96zm38.4-326.4H480V320h64v89.6zm0 172.8H480V576h64v-6.4z",
          }),
        ]),
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
  const parent = document.getElementById("publisher") || document.body
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
