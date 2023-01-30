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

const os = require("os")
const fs = require("fs")
const path = require("path")

/**
 * 获取IP
 * @returns {*|string}
 */
const getIPv4 = () => {
  const interfaces = os.networkInterfaces()
  const addresses = []

  for (const k in interfaces) {
    for (const k2 in interfaces[k]) {
      const address = interfaces[k][k2]
      if (address.family === "IPv4" && !address.internal) {
        addresses.push(address.address)
      }
    }
  }

  if (addresses.length === 0) {
    return "127.0.0.1"
  }

  let retAddr
  for (let i = 0; i < addresses.length; i++) {
    const addr = addresses[i]
    if (addr.indexOf("192.") > -1) {
      retAddr = addr
      break
    }
  }
  if (!retAddr) {
    retAddr = addresses[0]
  }

  return retAddr
}

const initPublishHelper = () => {
  /**
   * 思源笔记弹窗参数定义
   */
  window.terwer = {
    pageId: undefined,
    renderPublishHelper: () => {},
  }

  /**
   * 新窗口打开插件页面
   * @param pageId 文章ID
   * @param pageUrl 页面地址
   */
  window.terwer.renderPublishHelper = (pageId, pageUrl) => {
    const { app, BrowserWindow, getCurrentWindow } =
      window.require("@electron/remote")
    // enable webContents
    // require("@electron/remote").require("@electron/remote/main").enable(serverHost.webContents)

    const fetchPost = (url, data, cb, headers) => {
      const init = {
        method: "POST",
      }
      if (data) {
        if (
          [
            "/api/search/searchRefBlock",
            "/api/graph/getGraph",
            "/api/graph/getLocalGraph",
          ].includes(url)
        ) {
          window.siyuan.reqIds[url] = new Date().getTime()
          if (data.type === "local" && url === "/api/graph/getLocalGraph") {
            // 当打开文档A的关系图、关系图、文档A后刷新，由于防止请求重复处理，文档A关系图无法渲染。
          } else {
            data.reqId = window.siyuan.reqIds[url]
          }
        }
        if (data instanceof FormData) {
          init.body = data
        } else {
          init.body = JSON.stringify(data)
        }
      }
      if (headers) {
        init.headers = headers
      }
      fetch(url, init)
        .then((response) => {
          return response.json()
        })
        .then((response) => {
          if (
            [
              "/api/search/searchRefBlock",
              "/api/graph/getGraph",
              "/api/graph/getLocalGraph",
            ].includes(url)
          ) {
            if (
              response.data.reqId &&
              window.siyuan.reqIds[url] &&
              window.siyuan.reqIds[url] > response.data.reqId
            ) {
              return
            }
          }
          if (cb) {
            cb(response)
          }
        })
        .catch((e) => {
          console.warn("fetch post error", e)
          if (
            url === "/api/transactions" &&
            (e.message === "Failed to fetch" ||
              e.message === "Unexpected end of JSON input")
          ) {
            kernelError()
            return
          }
          /// #if !BROWSER
          if (
            url === "/api/system/exit" ||
            url === "/api/system/setWorkspaceDir" ||
            ([
              "/api/system/setUILayout",
              "/api/storage/setLocalStorage",
            ].includes(url) &&
              data.exit) // 内核中断，点关闭处理
          ) {
            ipcRenderer.send("siyuan-config-closetray")
            ipcRenderer.send("siyuan-quit")
          }
          /// #endif
        })
    }

    new Promise(function (html) {
      let url = "index.html"
      if (pageUrl) {
        url = pageUrl
      }
      fs.readFile(
        `${window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/${url}`,
        function (err, data) {
          if (err) {
            console.log(err)
          }
          let dataDir = `${window.siyuan.config.system.dataDir}`
          // 修复Windows路径问题
          dataDir = dataDir.replace(/\\/g, "/")
          const newWinPageId = pageId ?? ""
          const ipv4 = getIPv4()
          const mainWindow = getCurrentWindow()
          const currentWindowId = mainWindow.id
          console.log("dataDir=>", dataDir)
          console.log("newWinPageId=>", newWinPageId)
          console.log("ipv4=>", ipv4)
          console.log("currentWindowId=>", currentWindowId)

          var txt = data.toString().replace(/<!--.*-->/gs, "")
          txt += `<script>
          window.terwer={};
          window.terwer.pageId="${newWinPageId}";
          window.terwer.dataDir="${dataDir}";
          window.terwer.picgoExtension = require("${dataDir}/widgets/sy-post-publisher/lib/picgo/picgo.js").default;
          window.terwer.picgoExtension.activate("${dataDir}/widgets/sy-post-publisher/lib/picgo/picgo.cfg.json");
          window.terwer.ip = "${ipv4}";
          window.terwer.currentWindowId = ${currentWindowId};
          </script>`
          html(txt)
        }
      )
    }).then(function (html) {
      const mainWindow = getCurrentWindow()
      window.siyuan.printWin = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        show: true,
        width: 900,
        height: 750,
        resizable: true,
        frame: "darwin" === window.siyuan.config.system.os,
        icon: path.join(
          window.siyuan.config.system.appDir,
          "stage",
          "icon-large.png"
        ),
        titleBarStyle: "hidden",
        titleBarOverlay: {
          color: "#cccccca5",
          symbolColor: "black",
        },
        webPreferences: {
          nativeWindowOpen: true,
          nodeIntegration: true,
          webviewTag: true,
          webSecurity: false,
          contextIsolation: false,
        },
      })
      window.siyuan.printWin.webContents.userAgent = `SiYuan/${app.getVersion()} https://b3log.org/siyuan Electron`
      window.siyuan.printWin.once("ready-to-show", () => {
        window.siyuan.printWin.webContents.setZoomFactor(1)
      })
      fetchPost(
        "/api/export/exportTempContent",
        { content: html },
        (response) => {
          window.siyuan.printWin.loadURL(response.data.url)
          // 打开开发者工具
          // window.siyuan.printWin.webContents.openDevTools()
        }
      )
    })
  }
}

module.exports = initPublishHelper
