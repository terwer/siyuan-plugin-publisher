import logUtil from "~/utils/logUtil";
import {getWidgetId} from "~/utils/platform/siyuan/siyuanUtil";
import {getEnv} from "~/utils/envUtil";
import {isInChromeExtension, sendChromeMessage} from "~/utils/browser/ChromeUtil";
import {isEmptyString} from "~/utils/util";

export class CommonblogApi {
    constructor() {
    }

    /**
     * 请求中转支持浏览器跨域
     * @param apiUrl 请求地址
     * @param fetchOptions 请求参数
     * @param formJson 可选，发送form请求才需要
     */
    private async fetchCORS(apiUrl: string, fetchOptions: RequestInit, formJson?: any[]): Promise<Response> {
        const middleWareUrl = getEnv("VITE_MIDDLEWARE_URL") || "/api/middleware"
        const middleApiUrl = middleWareUrl + "/fetch"
        logUtil.logInfo("apiUrl=>")
        logUtil.logInfo(apiUrl)

        logUtil.logInfo("fetchOptions=>")
        logUtil.logInfo(fetchOptions)

        const originalFetchParams = {
            apiUrl: apiUrl,
            fetchOptions: fetchOptions
        }
        if (formJson) {
            Object.assign(originalFetchParams, {
                formJson: formJson
            })
        }

        const data = {
            fetchParams: originalFetchParams
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
     * 请求中转支持Chrome插件跨域
     * @param apiUrl 请求地址
     * @param fetchOptions 请求参数
     * @param formJson 可选，发送form请求才需要
     */
    private async fetchChromeCORS(apiUrl: string, fetchOptions: RequestInit, formJson?: any[]): Promise<string> {
        try {
            const reqOps = {
                // 里面的值应该可以自定义，用于判断哪个请求之类的
                type: 'fetchChromeJson',
                apiUrl: apiUrl, // 需要请求的url
                fetchCORSOptions: fetchOptions,
            }
            if (formJson) {
                Object.assign(reqOps, {
                    formJson: JSON.stringify(formJson)
                })
            }
            logUtil.logInfo("fetchChrome reqOps=>", reqOps)
            const resJson = await sendChromeMessage(reqOps);
            logUtil.logInfo("fetchChromeJson resJson=>", resJson)

            // @ts-ignore
            return resJson;
        } catch (e: any) {
            throw new Error("请求异常", e)
        }
    }

    /**
     * 同时兼容浏览器和思源宿主环境的fetch API，支持浏览器跨域
     * @param apiUrl 请求地址
     * @param fetchOptions 请求参数
     * @param formJson 可选，发送form请求才需要
     */
    private async fetchCall(apiUrl: string, fetchOptions: RequestInit, formJson?: any[]) {
        let result

        const widgetResult = getWidgetId()
        if (widgetResult.isInSiyuan) {
            logUtil.logInfo("当前处于挂件模式，使用electron的fetch获取数据")
            // 不解析了，直接使用Node兼容调用
            result = await fetch(apiUrl, fetchOptions)
        } else if (isInChromeExtension()) {
            logUtil.logInfo("当前处于Chrome插件中，需要模拟fetch解决CORS跨域问题")
            result = await this.fetchChromeCORS(apiUrl, fetchOptions, formJson)
        } else {
            logUtil.logInfo("当前处于非挂件模式，已开启请求代理解决CORS跨域问题")
            logUtil.logInfo("formJson=>", formJson)
            result = await this.fetchCORS(apiUrl, fetchOptions, formJson)
        }

        if (!result) {
            throw new Error("请求错误或者返回结果为空")
        }

        logUtil.logInfo("最终返回给前端的数据=>", result)

        return result
    }

    /**
     * 通用的统一调用入口
     * @param apiUrl 请求地址
     * @param fetchOptions 请求参数
     * @param formJson 可选，发送form请求才需要
     */
    private async fetchEntry(apiUrl: string, fetchOptions: RequestInit, formJson?: any[]): Promise<Response | string> {
        const result = await this.fetchCall(apiUrl, fetchOptions, formJson)
        logUtil.logInfo("请求结果，result=>")
        logUtil.logInfo(result)
        return result
    }

    /**
     * 解析CORS返回数据
     * @param corsjson cors数据
     * @protected
     */
    private parseCORSBody(corsjson: any) {
        return corsjson.body;
    }

    /**
     * fetch的兼容处理，统一返回最终的JSON数据
     * @param apiUrl 请求地址
     * @param fetchOptions 请求参数
     * @param formJson 可选，发送form请求才需要
     * @protected
     */
    protected async doFetch(apiUrl: string, fetchOptions: RequestInit, formJson?: any[]): Promise<any> {
        // const response = await fetch(apiUrl, fetchOps)
        const response = await this.fetchEntry(apiUrl, fetchOptions, formJson)
        if (!response) {
            throw new Error("请求异常")
        }

        let resJson

        const isTest = process.env.TEST == "true"
        if (isTest || (typeof Response != "undefined" && response instanceof Response)) {
            // 解析响应体并返回响应结果
            // @ts-ignore
            const statusCode = response.status

            // const resText = await response.text()
            // logUtil.logInfo("向链滴请求数据，resText=>", resText)

            if (200 != statusCode) {
                if (401 == statusCode) {
                    throw new Error("因权限不足操作已被禁止")
                } else if (statusCode > 401) {
                    if (statusCode == 413) {
                        throw new Error("请求内容过多，请删减文章正文之后再试")
                    }

                    // @ts-ignore
                    const msg = response.statusText
                    throw new Error(msg)
                } else {
                    throw new Error("fetch请求错误")
                }
            }

            const widgetResult = getWidgetId()

            if (widgetResult.isInSiyuan) {
                // @ts-ignore
                resJson = await response.json()
            } else {
                // @ts-ignore
                const corsJson = await response.json()
                resJson = this.parseCORSBody(corsJson)
            }
        } else {
            resJson = response
        }

        return resJson
    }

    /**
     * 发送form数据的fetch的兼容处理，统一返回最终的JSON数据
     * @param apiUrl 请求地址
     * @param fetchOptions 请求参数
     * @param formJson 可选，发送form请求才需要
     * @protected
     */
    protected async doFormFetch(apiUrl: string, fetchOptions: RequestInit, formJson: any[]): Promise<any> {
        const widgetResult = getWidgetId()
        if (widgetResult.isInSiyuan) {
            // 将formJson转换为formData
            const form = new URLSearchParams();
            formJson.forEach((item) => {
                form.append(item.key, item.value)
            })
            fetchOptions.body = form
            return await this.doFetch(apiUrl, fetchOptions)
        }
        if (isInChromeExtension()) {
            return await this.doFetch(apiUrl, fetchOptions, formJson)
        } else {
            return await this.doFetch(apiUrl, fetchOptions, formJson)
        }
    }
}