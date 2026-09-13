import { SiyuanDevice } from "zhi-device"
import type { SiyuanKernelApi } from "zhi-siyuan-api"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const isHttpUrl = (value: string) => /^[a-z]+:\/\//i.test(value)
const isFileUrl = (value: string) => value.startsWith("file://")
const isLikelyPath = (value: string) => /^[a-zA-Z]:[\\/]/.test(value) || value.startsWith("/")

const normalizeError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message || String(error)
  }
  return String(error ?? "未知错误")
}

export const openPathOrUrl = async (
  value: string,
  kernelApi: SiyuanKernelApi,
  existingWindow?: Window | null
) => {
  if (!value) {
    return false
  }

  const logger = createAppLogger("path-utils")
  const mainWin = SiyuanDevice.siyuanWindow?.()
  const canUseRemote = !!(mainWin && mainWin.require)

  if (value.startsWith("about:")) {
    await kernelApi.pushErrMsg({
      msg: "预览链接无效（about:），请检查发布结果。",
      timeout: 5000,
    })
    logger.warn("Refused to open about url", value)
    return false
  }

  if (isFileUrl(value) || isLikelyPath(value)) {
    if (canUseRemote) {
      try {
        const remote = mainWin.require("@electron/remote")
        const { shell } = remote
        const filePath = isFileUrl(value) ? decodeURIComponent(value.replace("file://", "")) : value
        await shell.openPath(filePath)
        logger.info("Opened local path", filePath)
        return true
      } catch (error) {
        await kernelApi.pushErrMsg({
          msg: `无法自动打开本地路径：${normalizeError(error)}`,
          timeout: 6000,
        })
        logger.error("Failed to open local path", error)
        return false
      }
    }

    await kernelApi.pushMsg({
      msg: "当前环境无法自动打开本地路径，请手动打开。",
      timeout: 5000,
    })
    logger.warn("Cannot open local path in non-electron env", value)
    return false
  }

  if (canUseRemote && isHttpUrl(value)) {
    try {
      const remote = mainWin.require("@electron/remote")
      const { shell } = remote
      await shell.openExternal(value)
      logger.info("Opened external url", value)
      return true
    } catch (error) {
      await kernelApi.pushErrMsg({
        msg: `无法打开链接：${normalizeError(error)}`,
        timeout: 6000,
      })
      logger.error("Failed to open external url", error)
      return false
    }
  }

  const win = existingWindow ?? window.open("", "_blank", "noreferrer")
  if (!win) {
    window.open(value, "_blank", "noreferrer")
    logger.warn("Popup blocked, fallback window.open", value)
    return true
  }
  win.location.href = value
  logger.info("Opened url in new window", value)
  return true
}
