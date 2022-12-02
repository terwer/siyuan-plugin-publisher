/* eslint-disable @typescript-eslint/strict-boolean-expressions,@typescript-eslint/explicit-function-return-type */
/**
 * 获取Boolean类型的环境变量
 * @param key
 */
export function getBooleanEnv(key: string) {
  let env = false
  if (getEnv(key)) {
    env = getEnv(key).toLowerCase() === "true"
  }
  return env
}

/**
 * 获取环境变量
 * @param key key
 */
export function getEnv(key: string) {
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
