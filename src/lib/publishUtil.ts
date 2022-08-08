import {getJSONConf} from "./config";

/**
 * 新版获取apiParams参数的方法，使用ts泛型
 * @param apiType 参数类型
 */
export function getApiParams<T>(apiType: string): T {
    return getJSONConf<T>(apiType);
}