/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { isDev } from "~/src/utils/constants.ts"
import { simpleLogger } from "zhi-lib-base"

// const win = window as any

/**
 * 使用 eruda 更好的控制日志
 */
// window.console = isDev ? win?.eruda?.get("console") : window.console

/**
 * 简单的日志接口
 */
export interface ILogger {
  debug: (msg: string, obj?: any) => void
  info: (msg: string, obj?: any) => void
  warn: (msg: string, obj?: any) => void
  error: (msg: string | Error, obj?: any) => void
}

/**
 * 一个简单轻量级的日志记录器
 *
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
export const createAppLogger = (name: string): ILogger => {
  return simpleLogger(name, "picgo-plugin-app", isDev)
}

/**
 * 销毁日志
 */
// export const destroyLogger = (): void => {
//   win.eruda.destroy()
// }
