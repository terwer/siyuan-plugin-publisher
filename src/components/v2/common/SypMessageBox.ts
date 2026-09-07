/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ElMessageBox, type ElMessageBoxOptions } from "element-plus"

export type SypMessageBoxType = "info" | "success" | "warning" | "error"

export interface SypConfirmOptions
  extends Omit<ElMessageBoxOptions, "message" | "title" | "type" | "customClass" | "modalClass"> {
  title?: string
  message: string
  type?: SypMessageBoxType
  customClass?: string
  modalClass?: string
}

const V2_MESSAGE_BOX_CLASS = "syp-v2-message-box"
const V2_MESSAGE_BOX_MODAL_CLASS = "syp-v2-message-box-modal"

const mergeClass = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ")

export const sypConfirm = async (options: SypConfirmOptions) => {
  try {
    const result = await ElMessageBox.confirm(options.message, options.title ?? "", {
      autofocus: false,
      closeOnClickModal: false,
      closeOnPressEscape: true,
      distinguishCancelAndClose: true,
      showClose: true,
      buttonSize: "small",
      ...options,
      type: options.type ?? "warning",
      customClass: mergeClass(V2_MESSAGE_BOX_CLASS, options.customClass),
      modalClass: mergeClass(V2_MESSAGE_BOX_MODAL_CLASS, options.modalClass),
    } as ElMessageBoxOptions)

    return result === "confirm"
  } catch {
    return false
  }
}
