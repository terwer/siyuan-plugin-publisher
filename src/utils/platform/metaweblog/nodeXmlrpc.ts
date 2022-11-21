import logUtil from "../../logUtil";

const xmlrpc = require('xmlrpc');

export async function fetchNode(apiUrl: string, reqMethod: string, reqParams: Array<string>) {
    let client

    const secure = apiUrl.indexOf('https:') > -1;
    if (secure) {
        client = xmlrpc.createSecureClient(apiUrl);
    } else {
        client = xmlrpc.createClient(apiUrl);
    }

    try {
        logUtil.logInfo("methodCallDirectNode开始")
        logUtil.logInfo("xmlrpcNodeParams.reqMethod=>")
        logUtil.logInfo(reqMethod)
        logUtil.logInfo("xmlrpcNodeParams.reqParams=>")
        logUtil.logInfo(reqParams)
        const data = await methodCallDirectNode(client, reqMethod, reqParams)
        const dataJson = JSON.stringify(data)
        return dataJson
    } catch (e) {
        logUtil.logError(e)
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
                logUtil.logInfo("resolve=>")
                logUtil.logInfo(data)
                resolve(data);
            } else {
                reject(error);
            }
        });
    });
}