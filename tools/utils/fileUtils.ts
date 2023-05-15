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

import fs from "fs"
import path from "path"
import glob from "glob"
import archiver from "archiver"

class FileUtils {
  static async cp(sourcePath, destinationPath, r = false, f = false) {
    if (!fs.existsSync(sourcePath)) {
      throw `文件或目录不存在：${sourcePath}`
    }

    if (fs.statSync(sourcePath).isFile()) {
      throw `${sourcePath} 不是一个目录`
    }

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true })
    }

    let pattern = `${sourcePath}/*`
    if (r) {
      pattern = `${sourcePath}/**/*`
    }

    let count = 0
    const files = glob.sync(pattern, { nodir: true })
    for (const file of files) {
      const dest = path.join(destinationPath, file.replace(sourcePath, ""))
      if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true })
      }

      if (!f && fs.existsSync(dest)) {
        throw `目标文件或目录已经存在: ${dest}`
      }

      try {
        fs.copyFileSync(file, dest)
        ++count
      } catch (err) {
        throw `复制文件时出错：${file} => ${dest}`
      }
    }

    console.log(`从 ${sourcePath} 复制 ${count} 个文件到 ${destinationPath}`)
  }

  public static async makeZip(source: string, destination: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const archive = archiver("zip", { zlib: { level: 9 } })
      const output = fs.createWriteStream(destination)

      output.on("close", () => {
        resolve(destination)
      })

      archive.on("warning", (err: archiver.ArchiverError) => {
        if (err.code === "ENOENT") {
          console.warn(err)
        } else {
          reject(err)
        }
      })

      archive.on("error", (err: archiver.ArchiverError) => {
        reject(err)
      })

      archive.pipe(output)
      archive.directory(source, "/")
      archive.finalize()
    }).then((destination: string) => {
      return new Promise<string>((resolve, reject) => {
        const targetDirectory = path.dirname(destination)

        fs.promises
          .mkdir(targetDirectory, { recursive: true })
          .then(() => {
            resolve(destination)
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  }
}

// 示例用法
// ;(async function () {
//   try {
//     await FileUtils.cp("./test", "./test-copy", true, true)
//   } catch (error) {
//     console.error(`执行命令出错: ${error}`)
//   }
// })()

export default FileUtils
