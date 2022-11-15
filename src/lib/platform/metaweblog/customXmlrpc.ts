import logUtil from "../../logUtil";
import {sendChromeMessage} from "../../browser/ChromeUtil";

const Serializer = require('xmlrpc/lib/serializer')
const {XMLParser} = require('fast-xml-parser');
const options = {
    ignoreAttributes: false
};
const xmlParser = new XMLParser(options);

/**
 * 自定义xmlrpc的请求与解析，解决apache xmlrpc的扩展问题
 * @param apiUrl
 * @param reqMethod
 * @param reqParams
 */
export async function fetchCustom(apiUrl: string, reqMethod: string, reqParams: Array<string>) {
    let ret

    try {
        const methodBodyXml = Serializer.serializeMethodCall(reqMethod, reqParams, "utf8")

        // const response = await fetch(apiUrl, {
        //     method: "POST",
        //     headers: {
        //         "content-type": "text/xml"
        //     },
        //     body: methodBodyXml
        // })

        const fetchCORSParams = {
            method: "POST",
            headers: {
                "content-type": "text/xml"
            },
            body: methodBodyXml
        }

        const resXml = await sendChromeMessage({
            // 里面的值应该可以自定义，用于判断哪个请求之类的
            type: 'fetchChromeXmlrpc',
            apiUrl: apiUrl, // 需要请求的url
            fetchCORSParams: fetchCORSParams
        });
        logUtil.logInfo("fetchChromeXmlrpc resXml=>", resXml)

        let resJson
        if (resXml) {
            const parseResult: any = xmlParser.parse(resXml)
            logUtil.logInfo("parseResult=>", parseResult)

            resJson = parseResult.methodResponse || {}
            logUtil.logInfo("resJson=>", JSON.stringify(resJson))
        } else {
            resJson = {}
        }

        return resJson
    } catch (e: any) {
        throw new Error(e)
    }

    return ret
}