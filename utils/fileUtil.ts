/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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

import fs from "fs-extra"
import { LogFactory } from "~/utils/logUtil"

const logger = LogFactory.getLogger()

// 此类中的方法不适合浏览器，请勿在浏览器环境使用

/**
 * 拷贝文件-同步
 * @param fromPath 源路径
 * @param toPath 目标路径
 */
export const copyFileSync = (fromPath: string, toPath: string): void => {
  try {
    fs.copySync(fromPath, toPath, {})
  } catch (e) {
    logger.error(e)
    throw e
  }
}

/**
 * 拷贝文件-异步
 * @param fromPath 源路径
 * @param toPath 目标路径
 */
export async function copyFile(fromPath: string, toPath: string): Promise<void> {
  try {
    await fs.copy(fromPath, toPath)
  } catch (e) {
    logger.error(e)
    throw e
  }
}

/**
 * 读取文件-同步
 * @param filePath 文件路径
 */
export function readFileSync(filePath: string): any {
  try {
    return fs.readFileSync(filePath, "utf8")
  } catch (e) {
    logger.error(e)
    throw e
  }
}

/**
 * 读取文件-异步
 * @param filePath 文件路径
 */
export async function readFile(filePath: string): Promise<any> {
  try {
    return fs.readFile(filePath, "utf8")
  } catch (e) {
    logger.error(e)
    throw e
  }
}

/**
 * 写文件
 * @param filePath 文件路径
 * @param content 文件内容
 */
export async function writeFile(filePath: string, content: any): Promise<void> {
  try {
    await fs.outputFile(filePath, content)
  } catch (e) {
    logger.error(e)
    throw e
  }
}
