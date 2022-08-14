import {getWidgetId} from "../siyuan/siyuanUtil";
import log from "../logUtil";
import {getEnv} from "../envUtil";

/**
 * Xmlrpc客户端封装类
 */
export class XmlrpcClient {
    private readonly apiType: string
    private readonly apiUrl: string
    private readonly username: string
    private readonly password: string

    constructor(apiType: string, apiUrl: string, username: string, password: string) {
        this.apiType = apiType
        this.apiUrl = apiUrl
        this.username = username
        this.password = password
    }

    /**
     * 请求中转支持浏览器跨域
     * @param apiUrl 端点
     * @param fetchCORSParams 中转参数
     */
    private async fetchCORS(apiUrl: string, fetchCORSParams: object): Promise<Response> {
        const middleApiUrl = getEnv("VITE_MIDDLEWARE_URL") || "/api/middleware/xmlrpc"
        log.logInfo("apiUrl=>")
        log.logInfo(apiUrl)
        log.logInfo("fetchCORSParams=>")
        log.logInfo(fetchCORSParams)

        const data = {
            fetchParams: {
                apiUrl: apiUrl,
                fetchCORSParams: fetchCORSParams
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
     * @param reqMethod 方法
     * @param reqParams 参数数组
     */
    private async fetchXmlrpc(apiUrl: string, reqMethod: string, reqParams: Array<string>) {

        let response: Response

        const widgetResult = await getWidgetId()
        if (widgetResult.isInSiyuan) {
            const fetchOption = {
                method: "POST",
                body: "",
                headers: {
                    "Content-Type": "text/xml"
                }
            }
            response = await fetch(apiUrl, fetchOption);
        } else {
            const fetchCORSParams = {
                reqMethod: reqMethod,
                reqParams: reqParams
            }
            log.logWarn("当前处于非挂件模式，已开启请求代理解决CORS跨域问题")
            response = await this.fetchCORS(apiUrl, fetchCORSParams)
        }
        let result = await response.text()
        if (!result || result == "") {
            throw new Error("请求错误或者返回结果为空")
        }
        return result
    }

    /**
     * xmlrpc统一调用入口
     * @param reqMethod 方法
     * @param reqMarams 参数
     */
    public async methodCallEntry(reqMethod: string, reqMarams: Array<string>) {
        const result = await this.fetchXmlrpc(this.apiUrl, reqMethod, reqMarams)
        log.logInfo("请求结果，result=>")
        log.logInfo(result)
        return result
    }
}

/**
 * Xmlrpc服务器封装类
 */
export class XmlrpcServer {

}
