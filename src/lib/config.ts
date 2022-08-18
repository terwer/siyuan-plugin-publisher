import log from "./logUtil";

/**
 * 获取Boolean配置
 * @param key key
 */
export function getBooleanConf(key: string): boolean {
    log.logInfo("------------------------------")
    log.logInfo("尝试从localStorage获取Boolean数据，key=>", key)

    let valueObj = false
    let value = getConf(key)
    valueObj = value.toLowerCase() === "true"

    log.logInfo("从localStorage获取Boolean数据=>")
    log.logInfo(valueObj)
    log.logInfo("------------------------------")
    return valueObj;
}

/**
 * 获取JSON配置
 * @param key key
 */
export function getJSONConf<T>(key: string): T {
    log.logInfo("------------------------------")
    log.logInfo("尝试从localStorage获取JSON数据，key=>", key)

    let valueObj = <T>({} || [])
    let value = getConf(key)
    if (value != "") {
        try {
            valueObj = JSON.parse(value);
        } catch (e) {
            log.logInfo("JSON格式不正确", e)
        }
    }

    log.logInfo("从localStorage获取JSON数据=>")
    log.logInfo(valueObj)
    log.logInfo("------------------------------")
    return valueObj;
}

/**
 * 获取配置：这个是所有数据保存的根方法
 * @param key key
 */
export function getConf(key: string): string {
    log.logInfo("尝试从localStorage获取数据，key=>", key)

    const value = localStorage.getItem(key)
    if (!value) {
        log.logWarn("未找到对应数据，key=>", key)
        return "";
    }
    log.logInfo("从localStorage获取数据=>", value)
    return value;
}

/**
 * 保存Boolean配置
 * @param key
 * @param value
 */
export function setBooleanConf(key: string, value: boolean): void {
    log.logInfo("++++++++++++++++++++++++++++++")
    log.logInfo("尝试保存Boolean数据到localStorage里key=>", key)
    log.logInfo("保存Boolean数据到localStorage=>")
    log.logInfo(value)

    const boolString = value.toString()
    setConf(key, boolString)
    log.logInfo("++++++++++++++++++++++++++++++")
}

/**
 * 保存JSON配置
 * @param key
 * @param value
 */
export function setJSONConf<T>(key: string, value: T): void {
    log.logInfo("++++++++++++++++++++++++++++++")
    log.logInfo("尝试保存JSON数据到localStorage里key=>", key)
    log.logInfo("保存JSON数据到localStorage=>")
    log.logInfo(value)

    const valueString = JSON.stringify(value)
    setConf(key, valueString)
    log.logInfo("++++++++++++++++++++++++++++++")
}

/**
 * 保存配置：这个是所有数据保存的根方法
 * @param key
 * @param value
 */
export function setConf(key: string, value: string): void {
    if (!value || value == "") {
        log.logWarn("空值，不保存")
        return
    }

    log.logInfo("尝试保存数据到localStorage里key=>", key)
    log.logInfo("保存数据到localStorage=>", value)

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