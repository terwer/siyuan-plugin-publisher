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

import minimist from "minimist"
import { execa } from "execa"
import FileUtils from "./utils/fileUtils"

/**
 * 插件打包
 *
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
class PackageApp {
  public async packagePlugin(isTest: boolean, skipBuild: boolean) {
    if (skipBuild == false) {
      // build bridge
      await this.runCommand("pnpm", ["build", "-F", "publisher-bridge"])

      // build plugin
      await this.runCommand("pnpm", ["build", "-F", "publisher-main"])
    }

    // copy to root dist
    await FileUtils.cp("./plugins/publisher-main/dist", "./dist/publish-tool", true, true)
    await FileUtils.cp("./libs/publisher-bridge/dist", "./dist/publish-tool/lib/bridge", true, true)

    // zip to build/package.zip etc.
    const zipTo = "./build/package.zip"
    await FileUtils.makeZip("./dist/publish-tool", zipTo)
    console.log(`plugin packaged to ${zipTo}`)

    // 开发测试阶段，拷贝到插件目录
    if (isTest) {
      // copy to local plugin folder
      await FileUtils.cp(
        "./dist/publish-tool",
        "/Users/terwer/Documents/mydocs/SiYuanWorkspace/public/data/plugins/publish-tool",
        true,
        true
      )
    }
  }

  private async runCommand(cmd: string, args: string[]) {
    const { stdout } = await execa(cmd, args).pipeStdout(process.stdout)
    console.log(stdout)
  }
}

// 本地生产测试
// pnpm package -t
//
// 生产环境打包
// pnpm package
;(async () => {
  const args = minimist(process.argv.slice(2))
  const isTest = args.test || args.t || false
  const skipBuild = args.test || args.s || false

  const packageApp = new PackageApp()
  // plugin
  await packageApp.packagePlugin(isTest, skipBuild)
  console.log("app packaged.")
})()
