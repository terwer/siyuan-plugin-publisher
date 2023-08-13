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

import { Buffer } from "node:buffer"
import { Base64 } from "js-base64"

/**
 * 将 file 对象转换为 Buffer
 *
 * @param file - file
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export const fileToBuffer = async (file: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: any) => {
      // 将 ArrayBuffer 转换成 Buffer 对象
      const buffer = Buffer.from(e.target.result)
      resolve(buffer)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 提取 base64 编码字符串中的 mime 类型。
 *
 * @param base64Str - 包含 base64 编码数据的字符串
 * @returns 提取到的 mime 类型，如果未找到则返回空字符串
 */
const extractMimeType = (base64Str: string): string => {
  const match = base64Str.match(/^data:(.*?);base64,/)
  if (match && match[1]) {
    return match[1]
  }
  return ""
}

/**
 * 将指定URL的图片文件转换为Base64编码字符串
 *
 * @param imageUrl 图片文件的URL地址
 * @returns 图片文件的Base64编码字符串
 */
export const remoteImageToBase64 = async (imageUrl: string): Promise<string> => {
  const base64String = await readFileToBase64(imageUrl)
  const imageBase64 = base64String.split(";base64,").pop() || ""
  return imageBase64
}

/**
 * 将远程图片转换为 base64 编码字符串，并获取图片名称和 mime 类型。
 *
 * @param imageUrl - 包含远程图片URL的字符串
 * @returns 包含图片名称、mime 类型和 base64 编码字符串的对象
 */
export const remoteImageToBase64Info = async (
  imageUrl: string
): Promise<{ imageName: string; mimeType: string; imageBase64: string }> => {
  const base64String = await readFileToBase64(imageUrl)
  const imageBase64 = base64String.split(";base64,").pop() || ""
  const imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1)
  const mimeType = extractMimeType(base64String)

  return {
    imageName,
    mimeType,
    imageBase64,
  }
}

/**
 * 将Base64编码的字符串转换为Buffer对象
 *
 * @param base64Str Base64编码的字符串
 * @returns Buffer对象
 */
export const base64ToBuffer = (base64Str: string): Buffer => {
  const uintArray = Base64.toUint8Array(base64Str)
  const buffer = Buffer.from(uintArray)
  return buffer
}

// ================
// private methods
// ================
function readFileToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let body = null
      try {
        const response = await fetch(url)
        body = await response.blob()
      } catch (e) {
        return reject(e)
      }
      if (body != null) {
        const reader = new FileReader()
        reader.readAsDataURL(body)
        reader.onloadend = function () {
          var base64data = reader.result as string
          resolve(base64data)
        }
        reader.onerror = function (e) {
          reject(e)
        }
      }
    })()
  })
}

const uintArrayToBuffer = (uint8Array: Uint8Array): Buffer => {
  return Buffer.from(uint8Array)
}
