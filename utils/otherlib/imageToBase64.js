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
//
// import * as fs from "fs/promises"
// import * as path from "path"
// import fetch from "cross-fetch"
//
// const imageRegex = /.(gif|jpe?g|tiff?|png|webp|bmp|ico)$/i
//
// export async function imageToBase64(image) {
//   let base64 = ""
//   if (image.uri) {
//     const uri = new URL(image.uri)
//     const fetchResponse = await fetch(uri)
//     const imageBuffer = await fetchResponse.buffer()
//     base64 = imageBuffer.toString("base64")
//   } else if (image.path && imageRegex.test(image.path)) {
//     const response = await fs.stat(image.path)
//     const isFile = response.isFile()
//     if (isFile) {
//       const imageBuffer = await fs.readFile(path.resolve(image.path))
//       base64 = imageBuffer.toString("base64")
//     }
//   } else {
//     throw new Error(
//       "Didn't get an image or a good uri for the appropriate param"
//     )
//   }
//   return { base64 }
// }
