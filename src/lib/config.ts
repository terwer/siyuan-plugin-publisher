import log from "./logUtil";

/**
 * 获取配置
 * @param key key
 */
export function getConf(key: string) {
    log.logInfo("尝试从localStorage获取数据，key=>", key)

    const value = localStorage.getItem(key)
    if (!value) {
        log.logWarn("未找到对应值，key=>", key)
        return null;
    }
    const valueObj = JSON.parse(value);
    log.logInfo("从localStorage获取数据=>", valueObj)
    return valueObj;
}

/**
 * 设置配置
 * @param key
 * @param value
 */
export async function setConf(key: string, value: any) {
    log.logInfo("尝试保存数据到localStorage里key=>", key)
    const valueString = JSON.stringify(value)
    localStorage.setItem(key, valueString)
    log.logInfo("保存数据到localStorage=>", value)
}