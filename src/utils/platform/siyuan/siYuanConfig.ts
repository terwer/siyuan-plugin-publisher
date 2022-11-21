/* 配置文件(可以被 data/widgets/custom.js 覆盖) */
import {getEnv} from "../../envUtil";
import {getJSONConf} from "../../config";
import {isEmptyString} from "../../util";
import {SIYUAN_CONSTANTS} from "../../constants/siyuanConstants";
import logUtil from "../../logUtil";

/**
 * 思源笔记配置
 * @author terwer
 */
export class SiYuanConfig {
    public readonly baseUrl;
    public readonly token;
    public readonly middlewareUrl;

    constructor(baseUrl: string, token: string, middlewareUrl: string) {
        this.baseUrl = baseUrl;
        this.token = token;
        this.middlewareUrl = middlewareUrl;
    }
}

/**
 * 获取思源笔记配置，优先读取配置的值，如果没有配置，读取启动环境变量
 */
export const getSiyuanCfg = (): SiYuanConfig => {
    let baseUrl = getEnv("VITE_SIYUAN_API_URL");// Base Url，开发阶段需要填写
    let token = getEnv("VITE_SIYUAN_CONFIG_TOKEN");// API token, 无需填写
    let middlewareUrl = getEnv("VITE_MIDDLEWARE_URL");// 请求代理地址

    const siyuanCfg = getJSONConf<SiYuanConfig>(SIYUAN_CONSTANTS.SIYUAN_CFG_KEY);
    if (!isEmptyString(siyuanCfg.baseUrl)) {
        baseUrl = siyuanCfg.baseUrl
    }
    if (!isEmptyString(siyuanCfg.token)) {
        token = siyuanCfg.token
    }
    if (!isEmptyString(siyuanCfg.middlewareUrl)) {
        middlewareUrl = siyuanCfg.middlewareUrl
    }

    return new SiYuanConfig(baseUrl, token, middlewareUrl);
}