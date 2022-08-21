import {isEmptyObject} from "../../../util";
import logUtil from "../../../logUtil";
import {CommonblogApi} from "../commonblogApi";

/**
 * 语雀API
 *
 * https://www.yuque.com/yuque/developer
 */
export class YuqueApi extends CommonblogApi {
    private readonly baseUrl: string
    private readonly username: string
    private readonly token: string

    constructor(baseUrl: string, username: string, token: string) {
        super();
        this.baseUrl = baseUrl;
        this.username = username
        this.token = token;
    }

    public repos() {
        let url = "/users/" + this.username + "/repos"
        let data = {}
        return this.yuqueRequest(url, data, "GET")
    }

    // ==========================================================================
    // ==========================================================================
    /**
     * 向语雀请求数据
     * @param url 请求地址
     * @param data 数据
     * @param method 请求方法 GET | POST
     * @private
     */
    private async yuqueRequest(url: string, data?: any, method?: string) {
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

        Object.assign(fetchOps, {
            headers: {
                "X-Auth-Token": this.token,
                "User-Agent": "Terwer/0.0.2"
            }
        })

        // 发送请求
        logUtil.logInfo("向语雀请求数据，apiUrl=>", apiUrl)
        logUtil.logInfo("向语雀请求数据，fetchOps=>", fetchOps)

        // 使用兼容的fetch调用并返回统一的JSON数据
        const resJson = await this.doFetch(apiUrl, fetchOps)

        logUtil.logInfo("向语雀请求数据，resJson=>", resJson)
        return resJson.data ? resJson.data : null
    }
}