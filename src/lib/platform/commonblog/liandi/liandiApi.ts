import logUtil from "../../../logUtil";
import {isEmptyObject} from "../../../util";
import {CommonblogApi} from "../commonblogApi";
import {getWidgetId} from "../../siyuan/siyuanUtil";

/**
 * 链滴API
 *
 * @author terwer
 * @date 2022-08-02 23:17
 *
 * https://ld246.com/article/1488603534762
 */
export class LiandiApi extends CommonblogApi {
    private readonly baseUrl: string
    private readonly token: string

    /**
     * 初始化链滴API
     * @param baseUrl
     * @param token
     */
    constructor(baseUrl: string, token: string) {
        super();
        this.baseUrl = baseUrl;
        this.token = token;
    }

    /**
     * 获取当前登录用户信息
     */
    public async getUser() {
        let url = "/user"
        let data = {}
        return this.liandiRequest(url, data, "GET", true)
        // 示例：https://ld246.com/api/v2/user
    }

    // ==========================================================================
    // ==========================================================================
    /**
     * 向链滴请求数据
     * @param url url
     * @param data 数据
     * @param method 请求方法 GET | POST
     * @param useToken 是否使用权限TOKEN
     * @private
     */
    private async liandiRequest(url: string, data?: any, method?: string, useToken?: boolean) {
        let resData = null

        // 设置请求参数
        const apiUrl = this.baseUrl + url

        let m = "POST"
        if (method) {
            m = method;
        }

        let fetchOps = {
            method: m
        }

        // 数据不为空才传递
        if (!isEmptyObject(data)) {
            Object.assign(fetchOps, {
                body: JSON.stringify(data),
            })
        }

        if (useToken != false) {
            Object.assign(fetchOps, {
                headers: {
                    Authorization: `token ${this.token}`,
                    "User-Agent": "Terwer/0.0.2"
                }
            })
        }

        // 发送请求
        logUtil.logInfo("向链滴请求数据，apiUrl=>", apiUrl)
        logUtil.logInfo("向链滴请求数据，fetchOps=>", fetchOps)

        // 使用兼容的fetch调用并返回统一的JSON数据
        const resJson = await this.doFetch(apiUrl, fetchOps)

        logUtil.logInfo("向链滴请求数据，resJson=>", resJson)
        return resJson.code === 0 ? resJson.data : null
    }
}