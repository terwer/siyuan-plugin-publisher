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

// 执行自定义脚本
const result = await window.SyCmd.customCmd(
  "/Users/terwer/Documents/mydocs/SiYuanWorkspace/public/data/widgets/sy-post-publisher/lib/cmd/ankisiyuan.bin",
  [],
  {},
  "/Users/terwer/Documents/mydocs/SiYuanWorkspace/public/data/widgets/sy-post-publisher/lib/cmd"
)
console.log("-----------------------")
result.data

// 执行shell脚本
const shellResult = await window.SyCmd.customShellCmd("ls")
console.log("-----------------------")
shellResult.data

// 执行python脚本
const pyPath = "/Users/terwer/Documents/mydocs/my-scripts/venv/bin"
const pyResult = await window.SyCmd.customPyCmd("python", ["-V"], pyPath)
console.log("-----------------------")
pyResult.data

// 执行node脚本
const nodePath = "/Users/terwer/Documents/app/node-v16.14.0-darwin-x64/bin"
const nodeResult = await window.SyCmd.customNodeCmd("node", ["-v"], nodePath)
console.log("-----------------------")
nodeResult.data
