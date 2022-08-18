import log from "../../logUtil";
import {isEmptyObject} from "../../util";
import 'isomorphic-fetch';

/**
 * 链滴API
 *
 * @author terwer
 * @date 2022-08-02 23:17
 *
 * https://ld246.com/article/1488603534762
 */
export class LiandiApi {
    private readonly baseUrl: string
    private readonly token: string

    /**
     * 初始化链滴API
     * @param baseUrl
     * @param token
     */
    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    /**
     * 获取当前登录用户信息
     */
    public async getUser() {
        let url = "/user"
        let data = {}
        return this.request(url, data, "GET", true)
        // 示例：https://ld246.com/api/v2/user
    }

    /* 向思源请求数据
    * @param url url
    * @param data 数据
    * @param method 请求方法 GET | POST
    * @param useToken 权限TOKEN
    */
    private async request(url: string, data?: any, method?: string, useToken?: boolean) {
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
        log.logInfo("向链滴请求数据，apiUrl=>", apiUrl)
        log.logInfo("向链滴请求数据，fetchOps=>", fetchOps)
        const response = await fetch(apiUrl, fetchOps)
        if (!response) {
            throw new Error("请求异常")
        }

        // 解析响应体并返回响应结果
        const statusCode = await response.status

        // const resText = await response.text()
        // log.logInfo("向链滴请求数据，resText=>", resText)

        if (200 != statusCode) {
            if (401 == statusCode) {
                throw new Error("因权限不足操作已被禁止")
            } else {
                throw new Error("请求错误")
            }
        }

        const resJson = await response.json()
        log.logInfo("向链滴请求数据，resJson=>", resJson)
        return resJson.code === 0 ? resJson.data : null
    }
}