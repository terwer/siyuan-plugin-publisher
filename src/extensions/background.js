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

// Extension event listeners are a little different from the patterns you may have seen in DOM or
// Node.js APIs. The below event listener registration can be broken in to 4 distinct parts:
//
// * chrome      - the global namespace for Chrome's extension APIs
// * runtime     – the namespace of the specific API we want to use
// * onInstalled - the event we want to subscribe to
// * addListener - what we want to do with this event
//
// See https://developer.chrome.com/docs/extensions/reference/events/ for additional details.
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Chrome Extension Installed")
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "fetchChromeXmlrpc":
      ;(async () => {
        let resText
        try {
          console.log("chrome.runtime fetchChromeXmlrpc apiUrl", request.apiUrl)
          console.log("chrome.runtime fetchChromeXmlrpc fetchCORSOptions", request.fetchCORSParams)
          const response = await fetch(request.apiUrl, request.fetchCORSParams)
          resText = await response.text()
          // console.log("chrome.runtime.onMessage.addListener fetchChromeXmlrpc response:", resText)
        } catch (e) {
          console.error("chrome.runtime fetchChromeXmlrpc request error", e)
        }
        sendResponse(resText)
      })()
      break
    case "fetchChromeJson":
      ;(async () => {
        let resJson
        try {
          const fetchCORSOptions = request.fetchCORSOptions
          const formJsonText = request.formJson
          // console.log("formJsonText=>", formJsonText)
          if (formJsonText) {
            const formJson = JSON.parse(formJsonText)
            // 将formJson转换为formData
            const form = new URLSearchParams()
            formJson.forEach(function (item) {
              form.append(item.key, item.value)
            })
            fetchCORSOptions.body = form
            // console.log("fetchCORSOptions.body=>", form)
          }
          // console.log("chrome.runtime fetchChromeJson apiUrl", request.apiUrl)
          // console.log("chrome.runtime fetchChromeJson reqOps", fetchCORSOptions)
          const response = await fetch(request.apiUrl, fetchCORSOptions)
          resJson = await response.json()
          // console.log("chrome.runtime.onMessage.addListener fetchChromeJson response:", resJson)
        } catch (e) {
          console.error("chrome.runtime fetchChromeJson request error", e)
        }
        sendResponse(resJson)
      })()
      break
  }

  // keep the messaging channel open for sendResponse
  return true
})
