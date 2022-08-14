import express, {Request, Response} from "express";
// @ts-ignore
import fetch from 'node-fetch';

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
    // console.log(headers)
    const body = req.body
    // console.log(body)

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

    const dataJson = JSON.stringify(data)
    res.writeHead(200, {
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
    const errorJson = JSON.stringify(err)
    res.writeHead(200, {
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