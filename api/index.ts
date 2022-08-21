import express, {Request, Response} from "express";
import fetch from 'cross-fetch';
import logUtil from "../src/lib/logUtil";

const app = require('express')();
const {v4} = require('uuid');
const xmlrpc = require('xmlrpc');
const Serializer = require('xmlrpc/lib/serializer')

// 解决req.body undefined
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
    const path = `/api/item/${v4()}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>
        <br /> or visit xmlrpc middleware <br />
        <a href="/api/middleware/xmlrpc">/api/middleware/xmlrpc</a>
    `);
});

app.get('/api/item/:slug', (req: Request, res: Response) => {
    const {slug} = req.params;
    res.end(`Item: ${slug}`);
});

/**
 * xmlrpc请求中间代理层
 */
app.post('/api/middleware/xmlrpc', (req: Request, res: Response) => {
    const headers = req.headers;
    // logUtil.logInfo(headers)
    const body = req.body
    // logUtil.logInfo(body)

    // 获取代理参数
    console.log("body.fetchParams.apiUrl=>")
    console.log(body.fetchParams.apiUrl)
    console.log("body.fetchParams.fetchCORSParams=>")
    console.log(body.fetchParams.fetchCORSParams)

    // =====================================
    // =====================================
    // 发送真实请求并获取结果
    console.log("开的发送真实请求并获取结果")
    let client
    const xmlrpcApiUrl = body.fetchParams.apiUrl
    const xmlrpcCORSParams = body.fetchParams.fetchCORSParams

    const secure = xmlrpcApiUrl.indexOf('https:') > -1;
    if (secure) {
        client = xmlrpc.createSecureClient(xmlrpcApiUrl);
    } else {
        client = xmlrpc.createClient(xmlrpcApiUrl);
    }

    let err
    try {
        console.error("xmlrpcCORSParams.reqMethod=>")
        console.error(xmlrpcCORSParams.reqMethod)
        console.error("xmlrpcCORSParams.reqParams=>")
        console.error(xmlrpcCORSParams.reqParams)
        const methodPromise = methodCallDirect(client, xmlrpcCORSParams.reqMethod, xmlrpcCORSParams.reqParams)
        methodPromise.then((resolve: any) => {
            console.warn("methodPromise resolve=>")
            console.warn(resolve)

            console.log("请求完成，准备返回真实结果")
            writeData(res, resolve)
            console.log("请求处理已成功")
        }).catch((reason: any) => {
            console.log("methodPromise catch=>")
            console.log(reason)
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
});

app.post('/api/middleware/fetch', (req: Request, res: Response) => {
    const headers = req.headers;
    // logUtil.logInfo(headers)
    const body = req.body
    // logUtil.logInfo(body)

    // 获取代理参数
    console.log("body.fetchParams.apiUrl=>")
    console.log(body.fetchParams.apiUrl)
    console.log("body.fetchParams.fetchOptions=>")
    console.log(body.fetchParams.fetchOptions)

    // =====================================
    // =====================================
    // 发送真实请求并获取结果
    console.log("开的发送真实请求并获取结果")

    const fetchCORSApiUrl = body.fetchParams.apiUrl
    const fetchCORSOptions = body.fetchParams.fetchOptions

    let err
    console.error("fetchCORS.apiUrl=>")
    console.error(fetchCORSApiUrl)
    console.error("fetchCORS.fetchOptions=>")
    console.error(fetchCORSOptions)

    fetch(fetchCORSApiUrl, fetchCORSOptions)
        .then((response) => {
            try {
                response.text().then((resText) => {
                    console.log("请求完成，准备返回真实结果")
                    let resJson = {}
                    try {
                        resJson = JSON.parse(resText)
                    } catch (e) {
                        console.error(e)
                    }
                    console.log(resJson)

                    const finalRes = {
                        headers: {
                            status: response.status,
                            statusText: response.statusText
                        },
                        body: resJson
                    }
                    console.log(finalRes)
                    writeStatusData(res, finalRes, response.status)
                    console.log("请求处理已成功")
                })
            } catch (e) {
                err = e
                console.error(e)
                writeStatusError(res, err, response.status)
                console.log("请求处理异常")
            }
        })
        .catch((reason: any) => {
            console.log("methodPromise catch=>")
            console.log(reason)
            writeError(res, reason)
            console.log("请求处理失败")
        })
    // ========================================
    // ========================================
});

/**
 * 输出数据
 * @param res
 * @param data
 */
function writeData(res: any, data: any) {
    // const resXml = Serializer.serializeMethodResponse(resolve)
    // res.writeHead(200, {
    //     'Content-Length': Buffer.byteLength(resXml),
    //     'Content-Type': 'text/xml'
    // });
    // res.end(resXml)

    writeStatusData(res, data, 200)
}

function writeStatusData(res: any, data: any, status: number) {
    const dataJson = JSON.stringify(data)
    res.writeHead(status, {
        'Content-Length': Buffer.byteLength(dataJson),
        'Content-Type': 'application/json'
    });
    res.end(dataJson)
}

/**
 * 输出错误信息
 * @param res
 * @param err
 */
function writeError(res: any, err: any) {
    // const errorXml = Serializer.serializeFault(err)
    // res.writeHead(200, {
    //     'Content-Length': Buffer.byteLength(errorXml),
    //     'Content-Type': 'text/xml'
    // });
    // res.end(errorXml)
    //
    writeStatusError(res, err, 500)
}

function writeStatusError(res: any, err: any, status: number) {
    const errorJson = JSON.stringify(err)
    res.writeHead(status, {
        'Content-Length': Buffer.byteLength(errorJson),
        'Content-Type': 'application/json'
    });
    res.end(errorJson)
}

// xmlrpc
/*
 * Makes an XML-RPC call to the server and returns a Promise.
 * @param {String} methodName - The method name.
 * @param {Array} params      - Params to send in the call.
 * @return {Promise<Object|Error>}
 */
async function methodCallDirect(client: any, methodName: string, params: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        client.methodCall(methodName, params, function (error: any, data: any) {
            if (!error) {
                console.log("resolve=>")
                console.log(data)
                resolve(data);
            } else {
                reject(error);
            }
        });
    });
}

// module.exports = app;
export default app;