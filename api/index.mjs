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

import express from "express"
import fetch from "cross-fetch"
// import { imageToBase64 } from "../utils/otherlib/imageToBase64"
import { SimpleXmlRpcClient } from "simple-xmlrpc"

const app = express()
// 解决req.body undefined
app.use(express.json())

/**
 * CORS 在 vercel.json 配置，这里无需配置
 */
app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  // res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.send(200)
  } else {
    next()
  }
})

/**
 * xmlrpc请求中间代理层
 */
app.post("/api/middleware/xmlrpc", (req, res) => {
  // const headers = req.headers;
  // console.log(headers)
  const body = req.body

  // 获取代理参数
  // console.log("body.fetchParams.apiUrl=>")
  // console.log(body.fetchParams.apiUrl)
  // console.log("body.fetchParams.fetchCORSParams=>")
  // console.log(body.fetchParams.fetchCORSParams)

  // =====================================
  // =====================================
  // 发送真实请求并获取结果
  console.log("开始发送真实请求并获取结果")
  const xmlrpcApiUrl = body.fetchParams.apiUrl
  const xmlrpcCORSParams = body.fetchParams.fetchCORSParams

  let err
  try {
    console.log("xmlrpcCORSParams.reqMethod=>")
    console.log(xmlrpcCORSParams.reqMethod)
    console.log("xmlrpcCORSParams.reqParams=>")
    console.log(xmlrpcCORSParams.reqParams)

    const client = new SimpleXmlRpcClient(xmlrpcApiUrl)

    const methodPromise = client.methodCall(
      xmlrpcCORSParams.reqMethod,
      xmlrpcCORSParams.reqParams
    )
    methodPromise
      .then((resolve) => {
        console.log("methodPromise resolve=>")
        console.log(resolve)

        writeData(res, resolve)
        console.log("请求处理已成功")
      })
      .catch((reason) => {
        console.log("methodPromise catch=>")
        console.error("xmlrpc middleware error", reason)
        writeError(res, reason)
        console.log("请求处理失败")
      })
  } catch (e) {
    err = e
    console.error(e)
    writeError(res, err)
    console.log("请求处理异常")
  }
  // ========================================
  // ========================================
})

app.post("/api/middleware/fetch", (req, res) => {
  // const headers = req.headers;
  // logUtil.logInfo(headers)
  const body = req.body
  // logUtil.logInfo(body)

  // 获取代理参数
  // console.log("body.fetchParams.apiUrl=>")
  // console.log(body.fetchParams.apiUrl)
  // console.log("body.fetchParams.fetchOptions=>")
  // console.log(body.fetchParams.fetchOptions)
  // console.log("body.fetchParams.formJson=>")
  // console.log(body.fetchParams.formJson)

  // =====================================
  // =====================================
  // 发送真实请求并获取结果
  // console.log("开始发送真实请求并获取结果")

  const fetchCORSApiUrl = body.fetchParams.apiUrl
  const fetchCORSOptions = body.fetchParams.fetchOptions
  const formJson = body.fetchParams.formJson

  // 如果是form请求，进行转换
  if (formJson) {
    // 将formJson转换为formData
    const form = new URLSearchParams()
    formJson.forEach((item) => {
      form.append(item.key, item.value)
    })
    fetchCORSOptions.body = form
  }

  let err
  console.log("fetchCORS.apiUrl=>")
  console.log(fetchCORSApiUrl)
  console.log("fetchCORS.fetchOptions=>")
  console.log(fetchCORSOptions)

  fetch(fetchCORSApiUrl, fetchCORSOptions)
    .then((response) => {
      try {
        response.text().then((resText) => {
          // console.log("请求完成，准备返回真实结果")
          let resJson = {}
          try {
            resJson = JSON.parse(resText)
          } catch (e) {
            console.error(e)
          }
          // console.log(resJson)

          const finalRes = {
            headers: {
              status: response.status,
              statusText: response.statusText,
            },
            body: resJson,
          }
          console.log(finalRes)
          console.log("请求处理已成功")
          writeStatusData(res, finalRes, response.status)
        })
      } catch (e) {
        err = e
        writeStatusError(res, err, response.status)
        console.log("请求处理异常")
        console.error(e)
      }
    })
    .catch((reason) => {
      // console.log("methodPromise catch=>")
      console.log("请求处理失败")
      console.error("fetch middleware error=>", reason)
      writeError(res, reason)
    })
  // ========================================
  // ========================================
})

// app.post("/api/middleware/imageToBase64", (req, res) => {
//   const body = req.body
//
//   // =====================================
//   // =====================================
//   const imgUrl = body.fetchParams.imgUrl
//   imageToBase64({ uri: imgUrl })
//     .then((response) => {
//       const base64str = response.base64
//
//       const resJson = {
//         base64str,
//       }
//
//       const finalRes = {
//         headers: {
//           status: 200,
//           statusText: "ok",
//         },
//         body: resJson,
//       }
//       // console.log(finalRes)
//       writeStatusData(res, finalRes, 200)
//       // console.log("请求处理已成功")
//     })
//     .catch((reason) => {
//       // console.log("methodPromise catch=>")
//       console.error("imageToBase64 middleware error=>", reason)
//       writeError(res, reason)
//       // console.log("请求处理失败")
//     })
//   // ========================================
//   // ========================================
// })

/**
 * 输出数据
 * @param res
 * @param data
 */
function writeData(res, data) {
  writeStatusData(res, data, 200)
}

function writeStatusData(res, data, status) {
  const dataJson = JSON.stringify(data)
  res.writeHead(status, {
    "Content-Length": Buffer.byteLength(dataJson),
    "Content-Type": "application/json",
  })
  res.end(dataJson)
}

/**
 * 输出错误信息
 * @param res
 * @param err
 */
function writeError(res, err) {
  writeStatusError(res, err, 500)
}

function writeStatusError(res, err, status) {
  const errorJson = JSON.stringify(err)
  res.writeHead(status, {
    "Content-Length": Buffer.byteLength(errorJson),
    "Content-Type": "application/json",
  })
  res.end(errorJson)
}

export default app
