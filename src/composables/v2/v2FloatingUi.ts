/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 */

import { ElMessage, type MessageParams } from "element-plus"

/** 浮层统一走 body + syp-floating.styl（html.dark / data-theme-mode），勿 appendTo Menu 以免卸载竞态 */
export const v2MessageSuccess = (options: MessageParams) => ElMessage.success(options)
export const v2MessageWarning = (options: MessageParams) => ElMessage.warning(options)
export const v2MessageError = (options: MessageParams) => ElMessage.error(options)
export const v2MessageInfo = (options: MessageParams) => ElMessage.info(options)
