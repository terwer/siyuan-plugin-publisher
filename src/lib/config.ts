import logUtil from "./logUtil";
import {isEmptyObject} from "./util";

/**
 * 获取Boolean配置
 * @param key key
 */
export function getBooleanConf(key: string): boolean {
    logUtil.logInfo("------------------------------")
    logUtil.logInfo("尝试从localStorage获取Boolean数据，key=>", key)

    let valueObj = false
    let value = getConf(key)
    valueObj = value.toLowerCase() === "true"

    logUtil.logInfo("从localStorage获取Boolean数据=>")
    logUtil.logInfo(valueObj)
    logUtil.logInfo("------------------------------")
    return valueObj;
}

/**
 * 获取JSON配置，不建议使用，建议包裹一层存储object
 * @deprecated
 * @param key key
 */
export function getArrayJSONConf<T>(key: string): T {
    let conf = getJSONConf<T>(key)
    if (isEmptyObject(conf)) {
        // @ts-ignore
        conf = []
    }
    return conf
}

/**
 * 获取JSON配置
 * @param key key
 */
export function getJSONConf<T>(key: string): T {
    logUtil.logInfo("------------------------------")
    logUtil.logInfo("尝试从localStorage获取JSON数据，key=>", key)

    let valueObj = <T>({} || [])
    let value = getConf(key)
    if (value != "") {
        try {
            valueObj = JSON.parse(value);
        } catch (e) {
            logUtil.logInfo("JSON格式不正确", e)
        }
    }

    logUtil.logInfo("从localStorage获取JSON数据=>")
    logUtil.logInfo(valueObj)
    logUtil.logInfo("------------------------------")
    return valueObj;
}

/**
 * 获取配置：这个是所有数据保存的根方法
 * @param key key
 */
export function getConf(key: string): string {
    logUtil.logInfo("尝试从localStorage获取数据，key=>", key)

    const value = localStorage.getItem(key)
    if (!value) {
        logUtil.logWarn("未找到对应数据，key=>", key)
        return "";
    }
    logUtil.logInfo("从localStorage获取数据=>", value)
    return value;
}

/**
 * 保存Boolean配置
 * @param key
 * @param value
 */
export function setBooleanConf(key: string, value: boolean): void {
    logUtil.logInfo("++++++++++++++++++++++++++++++")
    logUtil.logInfo("尝试保存Boolean数据到localStorage里key=>", key)
    logUtil.logInfo("保存Boolean数据到localStorage=>")
    logUtil.logInfo(value)

    const boolString = value.toString()
    setConf(key, boolString)
    logUtil.logInfo("++++++++++++++++++++++++++++++")
}

/**
 * 保存JSON配置
 * @param key
 * @param value
 */
export function setJSONConf<T>(key: string, value: T): void {
    logUtil.logInfo("++++++++++++++++++++++++++++++")
    logUtil.logInfo("尝试保存JSON数据到localStorage里key=>", key)
    logUtil.logInfo("保存JSON数据到localStorage=>")
    logUtil.logInfo(value)

    const valueString = JSON.stringify(value)
    setConf(key, valueString)
    logUtil.logInfo("++++++++++++++++++++++++++++++")
}

/**
 * 保存配置：这个是所有数据保存的根方法
 * @param key
 * @param value
 */
export function setConf(key: string, value: string): void {
    if (!value || value == "") {
        logUtil.logWarn("空值，不保存")
        return
    }

    logUtil.logInfo("尝试保存数据到localStorage里key=>", key)
    logUtil.logInfo("保存数据到localStorage=>", value)

    localStorage.setItem(key, value)
}

/**
 * 检测key是否冲突
 * @param key
 */
export function checkKeyExists(key: string): boolean {
    let flag = false

    for (let i = 0; i < localStorage.length; i++) {
        // 获取key 索引从0开始
        const getKey = localStorage.key(i);
        if (key === getKey) {
            flag = true;
            break;
        }
    }

    return flag;
}