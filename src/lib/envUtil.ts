/**
 * 获取Boolean类型的环境变量
 * @param key
 */
export function getBooleanEnv(key: string) {
    let env = false
    if (getEnv(key)) {
        env = (getEnv(key).toLowerCase() === "true")
    }
    return env
}

/**
 * 获取环境变量
 * @param key key
 */
export function getEnv(key: string) {
    let env = ""
    if (import.meta.env[key]) {
        env = import.meta.env[key]
    }
    return env
}