import log from "../../logUtil";
import {METAWEBLOG_METHOD_CONSTANTS} from "../../constants/metaweblogMethodConstants";
import {UserBlog} from "../../common/userBlog";

// 序列化
const xmlSerializer = require('xmlrpc/lib/serializer')

// 反序列化
// this.xmlDeserializer = require('xmlrpc/lib/deserializer')
// this.xmlParser = require('xml2json');
// const {XMLParser} = require('fast-xml-parser');
// const options = {
//     ignoreAttributes: true,
//     ignoreDeclaration: true,
//     ignorePiTags: true
// };
// const xmlParser = new XMLParser(options);
const Parser = require('xml2js').Parser;
const xmlParser = new Parser({});

/**
 * @deprecated The method should not be used, use `fetchNode` insdead which no need to parse xml yourself
 * @param apiUrl
 * @param reqMethod
 * @param reqParams
 */
export async function fetchElectron(apiUrl: string, reqMethod: string, reqParams: Array<string>) {
    let result

    const methodBody = xmlSerializer.serializeMethodCall(reqMethod, reqParams, "utf8")
    log.logWarn("apiUrl=>", apiUrl)
    log.logWarn("methodBody=>", methodBody)

    const fetchOption = {
        method: "POST",
        body: methodBody,
        headers: {
            "Content-Type": "text/xml"
        }
    }
    // @ts-ignore
    const response: Response = await fetch(apiUrl, fetchOption);
    let reqXml = await response.text()
    log.logInfo("reqXml=>")
    log.logInfo(reqXml)

    // 反序列化xml为合法json字符串

    // 这个有问题，xml2json也不够兼容，改成fast-xml-parser
    // const deserializer = new this.xmlDeserializer("utf8")
    // const desData = await new Promise((resolve, reject) => {
    //     deserializer.deserializeMethodResponse(response, function (err: any, result: any) {
    //         if (err) {
    //             reject(err)
    //         }
    //         resolve(result)
    //     })
    // })
    // log.logWarn(desData)

    // xml2json也不行
    // const parseResult = JSON.parse(this.xmlParser.toJson(reqXml)) || {}

    // fast-xml-parser
    // xmlParser.parse(reqXml);

    // xml2js
    const parseResult = await xmlParser.parseStringPromise(reqXml)
    log.logWarn("尝试获取反序列结果=>")
    log.logWarn(parseResult)

    let jsonResult: any = {}
    switch (reqMethod) {
        // 博客信息
        case METAWEBLOG_METHOD_CONSTANTS.GET_USERS_BLOGS: {
            const usersBlogs = parse_GetUsersBlogs(parseResult)
            log.logWarn("GetUsersBlogs组装完成准备返回=>")
            log.logWarn(usersBlogs)
            jsonResult = JSON.stringify(usersBlogs)
            break;
        }
        default:
            break;
    }

    // result = JSON.stringify(jsonResult)
    result = jsonResult

    return result
}

/**
 * 解析博客信息
 * @param parseResult
 */
function parse_GetUsersBlogs(parseResult: any) {
    let usersBlogs: Array<UserBlog> = []

    const methodResponse = parseResult.methodResponse
    const resValues = methodResponse.params.param.value.array.data.value.struct.member
    log.logInfo("解析GetUsersBlogs，resValues=>")
    log.logInfo(resValues)
    let userBlog = new UserBlog()
    for (let i = 0; i < resValues.length; i++) {
        const item = resValues[i]
        const itemKey = item.name
        // cnbllogs=>item.value.string
        // jvue || item.value
        const itemValue = item.value.string || item.value

        if (itemKey == "blogid") {
            userBlog.blogid = itemValue
        } else if (itemKey == "url") {
            userBlog.url = itemValue
        } else if (itemKey == "blogName") {
            userBlog.blogName = itemValue
        }
    }
    usersBlogs.push(userBlog)

    return usersBlogs
}