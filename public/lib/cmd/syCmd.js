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

// 警告⚠️：请勿在非思源笔记浏览器环境调用此文件中的任何方法

/**
 * 是否是Electron环境，等价于isInSiyuanOrSiyuanNewWin
 */
const { spawn } = require("child_process")

/**
 * 获取Path环境变量
 */
const getEnvPath = (CUSTOM_PATH) => {
  let ENV_PATH = process.env.PATH

  const NEW_ENV_PATH = CUSTOM_PATH || ""
  if (NEW_ENV_PATH !== "") {
    ENV_PATH = process.env.PATH + ":" + NEW_ENV_PATH
  }

  return ENV_PATH
}

/**
 * 简单执行命令
 *
 * @param command
 */
async function cmd(...command) {
  return await customCmd(command[0], [command.slice(1)])
}

/**
 * 自定义命令
 *
 * @param cmd 命令
 * @param args 参数数组
 * @param env 环境变量（可选）
 * @param cwd 执行路径（可选）
 */
async function customCmd(cmd, args, env = {}, cwd = process.cwd()) {
  let p = spawn(cmd, args, {
    cwd: cwd,
    env: Object.assign({}, process.env, env),
  })
  return new Promise((resolve, reject) => {
    let output = ""
    try {
      if (p.stdout) {
        p.stdout.on("data", (x) => {
          output += x.toString()
        })
      }

      if (p.stderr) {
        p.stderr.on("data", (x) => {
          output += x.toString()
        })
      }

      p.on("exit", (code) => {
        console.log("exit code=>", code)
      })

      p.on("close", (code) => {
        let ret
        output = output.replace(/\n$/, "")
        if (!code) {
          ret = { code: 0, data: output }
        } else {
          ret = { code: code, data: output }
        }

        console.log("命令执行完毕.", ret)
        resolve(ret)
      })
    } catch (e) {
      console.log("命令执行出错.", e)
      reject({ code: -1, data: e.toString() })
    }
  })
}

/**
 * 执行shell脚本
 *
 * @param shell shell命令
 * @param cwd 工作目录
 */
async function customShellCmd(shell, cwd = undefined) {
  const ret = await customCmd("bash", ["-c", shell], cwd)
  return ret
}

/**
 * 执行python命令
 *
 * @param pyCmd python命令
 * @param pyArgs 参数
 * @param pyPath python环境变量
 * @param cwd 工作目录
 */
const customPyCmd = async (
  pyCmd,
  pyArgs,
  pyPath = undefined,
  cwd = undefined
) => {
  const env = {
    PATH: getEnvPath(pyPath),
  }
  return await customCmd(pyCmd, pyArgs, env, cwd)
}

/**
 * 执行Node命令
 *
 * @param nodeCmd node命令
 * @param nodeArgs 参数
 * @param nodePath Node环境变量
 * @param cwd 工作目录
 */
const customNodeCmd = async (
  nodeCmd,
  nodeArgs,
  nodePath = undefined,
  cwd = undefined
) => {
  const env = {
    PATH: getEnvPath(nodePath),
  }
  return await customCmd(nodeCmd, nodeArgs, env, cwd)
}

const syCmd = {
  cmd,
  customCmd,
  customShellCmd,
  customPyCmd,
  customNodeCmd,
}

module.exports = syCmd
