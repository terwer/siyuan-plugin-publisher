import {isEmptyObject} from "../../../util";
import log from "../../../logUtil";

/**
 * 语雀API
 *
 * https://www.yuque.com/yuque/developer
 */
export class YuqueApi {
    private readonly baseUrl: string
    private readonly token: string


    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    public repos() {
        let url = "/hello"
        let data = {}
        return this.request(url, data, "GET")
    }

    private async request(url: string, data?: any, method?: string) {
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
        log.logInfo("向语雀请求数据，apiUrl=>", apiUrl)
        log.logInfo("向语雀请求数据，fetchOps=>", fetchOps)
        const response = await fetch(apiUrl, fetchOps)
        if (!response) {
            throw new Error("请求异常")
        }

        // 解析响应体并返回响应结果
        const statusCode = await response.status

        // const resText = await response.text()
        // log.logInfo("向语雀请求数据，resText=>", resText)

        if (200 != statusCode) {
            if (401 == statusCode) {
                throw new Error("因权限不足操作已被禁止")
            } else {
                throw new Error("请求错误")
            }
        }

        const resJson = await response.json()
        log.logInfo("向语雀请求数据，resJson=>", resJson)
        return resJson.code === 0 ? resJson.data : null
    }
}