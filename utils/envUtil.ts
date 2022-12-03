/**
 * 获取环境变量
 * @param key key
 */
export const getEnv = (key: string): string => {
  let env = ""
  try {
    if (import.meta.env[key]) {
      env = import.meta.env[key]
    }
  } catch (e: any) {
    throw new Error(e)
  }

  return env
}

/**
 * 获取Boolean类型的环境变量
 * @param key
 */
export const getBooleanEnv = (key: string): boolean => {
  let env = false
  if (getEnv(key)) {
    env = getEnv(key).toLowerCase() === "true"
  }
  return env
}
