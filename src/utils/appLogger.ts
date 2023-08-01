/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { isDev } from "~/src/utils/constants.ts"
import { simpleLogger } from "zhi-lib-base"

/**
 * 使用 eruda 更好的控制日志
 */
window.console = isDev ? (window as any).eruda.get("console") : window.console

/**
 * 简单的日志接口
 */
interface ILogger {
  debug: (msg: string, obj?: any) => void
  info: (msg: string, obj?: any) => void
  warn: (msg: string, obj?: any) => void
  error: (msg: string | Error, obj?: any) => void
}

/**
 * 一个简单轻量级的日志记录器
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export const createAppLogger = (name: string): ILogger => {
  return simpleLogger(name, "publisher-widget", isDev)
}

/**
 * 销毁日志
 */
export const destroyLogger = (): void => {
  const win = window as any
  win.eruda.destroy()
}
