import log from "../../logUtil";

const xmlrpc = require('xmlrpc');
const Serializer = require('xmlrpc/lib/serializer')

export async function fetchNode(apiUrl: string, reqMethod: string, reqParams: Array<string>) {
    let client

    const secure = apiUrl.indexOf('https:') > -1;
    if (secure) {
        client = xmlrpc.createSecureClient(apiUrl);
    } else {
        client = xmlrpc.createClient(apiUrl);
    }

    let err
    try {
        log.logInfo("xmlrpcNodeParams.reqMethod=>")
        log.logInfo(reqMethod)
        log.logInfo("xmlrpcNodeParams.reqParams=>")
        log.logInfo(reqParams)
        return await methodCallDirectNode(client, reqMethod, reqParams)
    } catch (e) {
        err = e
        log.logError(e)
        console.log("请求处理异常")
        throw new Error("请求处理异常")
    }
}

// xmlrpc
/*
 * Makes an XML-RPC call to the server and returns a Promise.
 * @param {String} methodName - The method name.
 * @param {Array} params      - Params to send in the call.
 * @return {Promise<Object|Error>}
 */
async function methodCallDirectNode(client: any, methodName: string, params: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        client.methodCall(methodName, params, function (error: any, data: any) {
            if (!error) {
                log.logInfo("resolve=>")
                log.logInfo(data)
                resolve(data);
            } else {
                reject(error);
            }
        });
    });
}