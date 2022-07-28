import log from "./logUtil";

/**
 * 获取Boolean配置
 * @param key key
 */
export function getBooleanConf(key: string) {
    log.logInfo("------------------------------")
    log.logInfo("尝试从localStorage获取Boolean数据，key=>", key)

    let valueObj = false
    let value = getConf(key)
    valueObj = value.toLowerCase() === "true"

    log.logInfo("从localStorage获取Boolean数据=>")
    log.logInfo(valueObj)
    log.logInfo("------------------------------\n")
    return valueObj;
}

/**
 * 获取JSON配置
 * @param key key
 */
export function getJSONConf(key: string) {
    log.logInfo("------------------------------")
    log.logInfo("尝试从localStorage获取JSON数据，key=>", key)

    let valueObj = {}
    let value = getConf(key)
    if (typeof value === "string") {
        valueObj = JSON.parse(value);
    }

    log.logInfo("从localStorage获取JSON数据=>")
    log.logInfo(valueObj)
    log.logInfo("------------------------------\n")
    return valueObj;
}

/**
 * 获取配置
 * @param key key
 */
export function getConf(key: string) {
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
export function setBooleanConf(key: string, value: any) {
    log.logInfo("++++++++++++++++++++++++++++++")
    log.logInfo("尝试保存Boolean数据到localStorage里key=>", key)
    log.logInfo("保存Boolean数据到localStorage=>")
    log.logInfo(value)

    const boolString = value.toString()
    setConf(key, boolString)
    log.logInfo("++++++++++++++++++++++++++++++\n")
}

/**
 * 保存JSON配置
 * @param key
 * @param value
 */
export function setJSONConf(key: string, value: any) {
    log.logInfo("++++++++++++++++++++++++++++++")
    log.logInfo("尝试保存JSON数据到localStorage里key=>", key)
    log.logInfo("保存JSON数据到localStorage=>")
    log.logInfo(value)

    const valueString = JSON.stringify(value)
    setConf(key, valueString)
    log.logInfo("++++++++++++++++++++++++++++++\n")
}

/**
 * 保存配置
 * @param key
 * @param value
 */
export function setConf(key: string, value: any) {
    if (!value || value == "") {
        log.logWarn("空值，不保存")
        return
    }
    log.logInfo("尝试保存数据到localStorage里key=>", key)
    log.logInfo("保存数据到localStorage=>", value)

    localStorage.setItem(key, value)
}