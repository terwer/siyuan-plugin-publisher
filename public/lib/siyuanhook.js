/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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

let fs = require("fs")
let path = require("path")
const {
  app,
  BrowserWindow,
  dialog,
  getCurrentWindow,
  ipcRenderer,
} = require("@electron/remote")

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
        (["/api/system/setUILayout", "/api/storage/setLocalStorage"].includes(
          url
        ) &&
          data.exit) // 内核中断，点关闭处理
      ) {
        ipcRenderer.send("siyuan-config-closetray")
        ipcRenderer.send("siyuan-quit")
      }
      /// #endif
    })
}

window.terwer = {
  renderPublishHelper: () => {},
}
window.terwer.renderPublishHelper = () => {
  const localData = JSON.parse(
    localStorage.getItem("local-exportpdf") ||
      JSON.stringify({
        landscape: false,
        marginType: "0",
        scale: 1,
        pageSize: "A4",
        removeAssets: true,
        keepFold: false,
      })
  )
  const servePath = window.location.protocol + "//" + window.location.host
  const isDefault =
    (window.siyuan.config.appearance.mode === 1 &&
      window.siyuan.config.appearance.themeDark === "midnight") ||
    (window.siyuan.config.appearance.mode === 0 &&
      window.siyuan.config.appearance.themeLight === "daylight")
  let themeStyle = ""
  if (!isDefault) {
    themeStyle = `<link rel="stylesheet" type="text/css" id="themeStyle" href="${servePath}/appearance/themes/${
      window.siyuan.config.appearance.themeLight
    }/${window.siyuan.config.appearance.customCSS ? "custom" : "theme"}.css?${
      window.siyuan.config.system.kernelVersion
    }"/>`
  }
  new Promise(function (html) {
    fs.readFile(
      `${window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/index.html`,
      function (err, data) {
        if (err) {
          console.log(err)
        }
        var txt = data.toString().replace(/<!--.*-->/gs, "")
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
      height: 680,
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
        contextIsolation: false,
        nodeIntegration: true,
        webviewTag: true,
        webSecurity: false,
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
      }
    )
  })
}

// export const destroyPrintWindow = () => {
//   getCurrentWindow().webContents.setZoomFactor(1);
//   window.siyuan.printWin.destroy();
// };
