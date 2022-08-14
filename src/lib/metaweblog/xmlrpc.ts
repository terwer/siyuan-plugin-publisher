import {getWidgetId} from "../siyuan/siyuanUtil";
import log from "../logUtil";
import {config} from "../siyuan/siYuanConfig";
import {getEnv} from "../envUtil";
import {getJSONConf} from "../config";
import {IMetaweblogCfg} from "./IMetaweblogCfg";
import {API_TYPE_CONSTANTS} from "../constants/apiTypeConstants";

/**
 * Xmlrpc客户端封装类
 */
export class XmlrpcClient {

    /**
     * 请求中转支持浏览器跨域
     * @param apiUrl
     * @param fetchOption
     */
    private async fetchCORS(apiUrl: any, fetchOption: any): Promise<Response> {
        const middleApiUrl = getEnv("VITE_MIDDLEWARE_URL") || "/api/middleware/xmlrpc"
        log.logInfo("apiUrl=>")
        log.logInfo(apiUrl)
        log.logInfo("fetchOptions=>")
        log.logInfo(fetchOption)

        const data = {
            fetchParams: {
                apiUrl: apiUrl,
                fetchOption: fetchOption
            }
        }

        let middleFetchOption = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        log.logInfo("middleApiUrl=>")
        log.logInfo(middleApiUrl)
        log.logInfo("middleFetchOption=>")
        log.logInfo(middleFetchOption)

        return await fetch(middleApiUrl, middleFetchOption);
    }

    /**
     * 同时兼容浏览器和思源宿主环境的xmlrpc API
     * @param apiUrl 端点
     * @param xmlbody xml文本
     */
    private async fetchXmlrpc(apiUrl: string, xmlbody: string) {
        const fetchOption = {
            method: "POST",
            body: xmlbody,
            headers: {
                "Content-Type": "text/xml"
            }
        }
        let response: Response

        const widgetResult = await getWidgetId()
        if (widgetResult.isInSiyuan) {
            response = await fetch(apiUrl, fetchOption);
        } else {
            log.logWarn("当前处于非挂件模式，已开启请求代理解决CORS跨域问题")
            response = await this.fetchCORS(apiUrl, fetchOption)
        }
        let result = await response.text()
        if (!result || result == "") {
            throw new Error("请求错误或者返回结果为空")
        }
        return result
    }

    public async methodCall() {
        let apiUrl = '';
        let appKey = ""
        let username = ""
        let password = ""

        const cfg = getJSONConf<IMetaweblogCfg>(API_TYPE_CONSTANTS.API_TYPE_CNBLOGS)

        apiUrl = cfg.apiUrl
        appKey = API_TYPE_CONSTANTS.API_TYPE_CNBLOGS
        username = cfg.username
        password = cfg.password

        let xmlbody = `<?xml version="1.0"?>
<methodCall>
    <methodName>metaWeblog.getUsersBlogs</methodName>
    <params>
        <param>
            <value><string>cnblogs</string></value>
        </param>
        <param>
            <value><string>${username}</string></value>
        </param>
        <param>
            <value><string>${password}</string></value>
        </param>
    </params>
</methodCall>`

        const result = await this.fetchXmlrpc(apiUrl, xmlbody)

        log.logInfo("请求结果，result=>")
        log.logInfo(result)
    }
}

/**
 * Xmlrpc服务器封装类
 */
export class XmlrpcServer {

}
