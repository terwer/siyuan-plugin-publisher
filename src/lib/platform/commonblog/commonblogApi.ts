import logUtil from "../../logUtil";
import {getWidgetId} from "../siyuan/siyuanUtil";
import {getEnv} from "../../envUtil";

export class CommonblogApi {
    constructor() {
    }

    /**
     * 请求中转支持浏览器跨域
     * @param apiUrl 请求地址
     * @param fetchOptions 请求参数
     */
    private async fetchCORS(apiUrl: string, fetchOptions: RequestInit): Promise<Response> {
        const middleWareUrl = getEnv("VITE_MIDDLEWARE_URL") || "/api/middleware"
        const middleApiUrl = middleWareUrl + "/fetch"
        logUtil.logInfo("apiUrl=>")
        logUtil.logInfo(apiUrl)

        logUtil.logInfo("fetchOptions=>")
        logUtil.logInfo(fetchOptions)

        const data = {
            fetchParams: {
                apiUrl: apiUrl,
                fetchOptions: fetchOptions
            }
        }

        let middleFetchOption = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        logUtil.logInfo("middleApiUrl=>")
        logUtil.logInfo(middleApiUrl)
        logUtil.logInfo("middleFetchOption=>")
        logUtil.logInfo(middleFetchOption)

        return await fetch(middleApiUrl, middleFetchOption);
    }

    /**
     * 同时兼容浏览器和思源宿主环境的fetch API，支持浏览器跨域
     * @param apiUrl 请求地址
     * @param fetchOptions 请求参数
     */
    private async fetchCall(apiUrl: string, fetchOptions: RequestInit) {
        let result

        const widgetResult = await getWidgetId()
        if (widgetResult.isInSiyuan) {
            logUtil.logWarn("当前处于挂件模式，使用electron的fetch获取数据")
            // 不解析了，直接使用Node兼容调用
            result = await fetch(apiUrl, fetchOptions)
        } else {
            logUtil.logWarn("当前处于非挂件模式，已开启请求代理解决CORS跨域问题")
            result = await this.fetchCORS(apiUrl, fetchOptions)
        }

        if (!result) {
            throw new Error("请求错误或者返回结果为空")
        }

        logUtil.logWarn("最终返回给前端的数据=>")
        logUtil.logWarn(result)

        return result
    }

    /**
     * 通用的统一调用入口
     * @param apiUrl 请求地址
     * @param fetchOptions 请求参数
     */
    protected async fetchEntry(apiUrl: string, fetchOptions: RequestInit): Promise<Response> {
        const result = await this.fetchCall(apiUrl, fetchOptions)
        logUtil.logInfo("请求结果，result=>")
        logUtil.logInfo(result)
        return result
    }
}