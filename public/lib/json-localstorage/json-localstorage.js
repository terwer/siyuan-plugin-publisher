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

// 警告⚠️：请勿在非思源笔记浏览器环境调用此文件中的任何方法

"use strict"
var fs = require("fs")
var path = require("path")

// 警告⚠️：请勿在非Electron环境调用此文件中的任何方法

var LocalStorage
;(function (LocalStorage) {
  LocalStorage.filepath = ""
  LocalStorage.filename = ".storage.json"

  LocalStorage.length = getLength()

  function init(filepath) {
    LocalStorage.filepath = filepath

    window.JsonLocalStorage = LocalStorage
    console.log("挂载window.JsonLocalStorage", window.JsonLocalStorage)

    const fullpath = path.join(__dirname, LocalStorage.filepath)
    console.log("设置json配置目录", fullpath)
  }

  LocalStorage.init = init

  function switchCfg(filename) {
    LocalStorage.filename = filename
  }

  LocalStorage.switchCfg = switchCfg

  function getItem(key) {
    return getStoredItems()[key] || null
  }

  LocalStorage.getItem = getItem

  function setItem(key, value) {
    var obj = getStoredItems()
    obj[key] = value
    LocalStorage.length = countKeys(obj)
    writeFile(obj)
  }

  LocalStorage.setItem = setItem

  function removeItem(key) {
    var obj = getStoredItems()
    delete obj[key]
    LocalStorage.length = countKeys(obj)
    writeFile(obj)
  }

  LocalStorage.removeItem = removeItem

  function clear() {
    LocalStorage.length = 0
    writeFile({})
    return undefined
  }

  LocalStorage.clear = clear

  function getLength() {
    return countKeys(getStoredItems())
  }

  LocalStorage.getLength = getLength

  function countKeys(obj) {
    var size = 0
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) size++
    }
    return size
  }

  function key(n) {
    var obj = getStoredItems()
    var counter = 0
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (n == counter) {
          return key
        } else if (counter > n) {
          return null
        }
        counter++
      }
    }
    return null
  }

  LocalStorage.key = key

  function getStoredItems() {
    try {
      return JSON.parse(readFile())
    } catch (e) {
      return {}
    }
  }

  function readFile() {
    return fs.readFileSync(getFilepath(), getFileOptions())
  }

  function writeFile(obj) {
    return fs.writeFileSync(
      getFilepath(),
      JSON.stringify(obj),
      getFileOptions()
    )
  }

  function getFilepath() {
    const fullpath = path.join(__dirname, LocalStorage.filepath)
    if (!fs.existsSync(fullpath)) {
      fs.mkdirSync(fullpath)
    }
    // console.log("fullpath=>", fullpath)
    // console.log("LocalStorage.filename=>", LocalStorage.filename)
    return path.join(fullpath, LocalStorage.filename)
  }

  function getFileOptions() {
    return { encoding: "utf8" }
  }
})(LocalStorage || (LocalStorage = {}))
module.exports = LocalStorage
console.log("json-localstorage register success")
