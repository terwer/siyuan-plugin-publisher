/* eslint-disable @typescript-eslint/no-floating-promises,@typescript-eslint/strict-boolean-expressions,@typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
import express, { NextFunction, Request, Response } from 'express'
import fetch from 'cross-fetch'
import { imageToBase64 } from '~/utils/parser/imageToBase64'

// @ts-expect-error
import xmlrpc from 'xmlrpc'

const app = express()
// 解决req.body undefined
app.use(express.json())

// Enable CORS from client-side
app.use(function (req: Request, res: Response, next: NextFunction) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  // res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

/**
 * xmlrpc请求中间代理层
 */
app.post('/api/middleware/xmlrpc', (req: Request, res: Response) => {
  // const headers = req.headers;
  // console.log(headers)
  const body = req.body
  // logUtil.logInfo(body)

  // 获取代理参数
  // console.log("body.fetchParams.apiUrl=>")
  // console.log(body.fetchParams.apiUrl)
  // console.log("body.fetchParams.fetchCORSParams=>")
  // console.log(body.fetchParams.fetchCORSParams)

  // =====================================
  // =====================================
  // 发送真实请求并获取结果
  // console.log("开始发送真实请求并获取结果")
  let client
  const xmlrpcApiUrl = body.fetchParams.apiUrl
  const xmlrpcCORSParams = body.fetchParams.fetchCORSParams

  const secure = xmlrpcApiUrl.indexOf('https:') > -1
  if (secure) {
    client = xmlrpc.createSecureClient(xmlrpcApiUrl)
  } else {
    client = xmlrpc.createClient(xmlrpcApiUrl)
  }

  let err
  try {
    console.log('xmlrpcCORSParams.reqMethod=>')
    console.log(xmlrpcCORSParams.reqMethod)
    console.log('xmlrpcCORSParams.reqParams=>')
    console.log(xmlrpcCORSParams.reqParams)
    const methodPromise = methodCallDirect(client, xmlrpcCORSParams.reqMethod, xmlrpcCORSParams.reqParams)
    methodPromise.then((resolve: any) => {
      // console.log("methodPromise resolve=>")
      // console.log(resolve)

      // console.log("请求完成，准备返回真实结果")
      writeData(res, resolve)
      // console.log("请求处理已成功")
    }).catch((reason: any) => {
      // console.log("methodPromise catch=>")
      console.error('xmlrpc middleware error', reason)
      writeError(res, reason)
      // console.log("请求处理失败")
    })
  } catch (e) {
    err = e
    console.error(e)
    writeError(res, err)
    // console.log("请求处理异常")
  }
  // ========================================
  // ========================================
})

app.post('/api/middleware/fetch', (req: Request, res: Response) => {
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
    formJson.forEach((item: any) => {
      form.append(item.key, item.value)
    })
    fetchCORSOptions.body = form
  }

  let err
  console.log('fetchCORS.apiUrl=>')
  console.log(fetchCORSApiUrl)
  console.log('fetchCORS.fetchOptions=>')
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
              statusText: response.statusText
            },
            body: resJson
          }
          // console.log(finalRes)
          writeStatusData(res, finalRes, response.status)
          // console.log("请求处理已成功")
        })
      } catch (e) {
        err = e
        console.error(e)
        writeStatusError(res, err, response.status)
        // console.log("请求处理异常")
      }
    })
    .catch((reason: any) => {
      // console.log("methodPromise catch=>")
      console.error('fetch middleware error=>', reason)
      writeError(res, reason)
      // console.log("请求处理失败")
    })
    // ========================================
    // ========================================
})

app.post('/api/middleware/imageToBase64', (req: Request, res: Response) => {
  const body = req.body

  // =====================================
  // =====================================
  const imgUrl = body.fetchParams.imgUrl
  imageToBase64({ uri: imgUrl }).then((response) => {
    const base64str = response.base64

    const resJson = {
      base64str
    }

    const finalRes = {
      headers: {
        status: 200,
        statusText: 'ok'
      },
      body: resJson
    }
    // console.log(finalRes)
    writeStatusData(res, finalRes, 200)
    // console.log("请求处理已成功")
  }).catch((reason: any) => {
    // console.log("methodPromise catch=>")
    console.error('imageToBase64 middleware error=>', reason)
    writeError(res, reason)
    // console.log("请求处理失败")
  })
  // ========================================
  // ========================================
})

/**
 * 输出数据
 * @param res
 * @param data
 */
function writeData (res: any, data: any) {
  writeStatusData(res, data, 200)
}

function writeStatusData (res: any, data: any, status: number) {
  const dataJson = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Length': Buffer.byteLength(dataJson),
    'Content-Type': 'application/json'
  })
  res.end(dataJson)
}

/**
 * 输出错误信息
 * @param res
 * @param err
 */
function writeError (res: any, err: any) {
  writeStatusError(res, err, 500)
}

function writeStatusError (res: any, err: any, status: number) {
  const errorJson = JSON.stringify(err)
  res.writeHead(status, {
    'Content-Length': Buffer.byteLength(errorJson),
    'Content-Type': 'application/json'
  })
  res.end(errorJson)
}

// xmlrpc
/*
 * Makes an XML-RPC call to the server and returns a Promise.
 * @param {String} methodName - The method name.
 * @param {Array} params      - Params to send in the call.
 * @return {Promise<Object|Error>}
 */
async function methodCallDirect (client: any, methodName: string, params: any): Promise<any> {
  return await new Promise(function (resolve, reject) {
    client.methodCall(methodName, params, function (error: any, data: any) {
      if (!error) {
        // console.log("resolve=>")
        // console.log(data)
        resolve(data)
      } else {
        reject(error)
      }
    })
  })
}

export default app
