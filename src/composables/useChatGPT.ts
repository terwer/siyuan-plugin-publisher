/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { HtmlUtil, StrUtil } from "zhi-common"
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from "chatgpt"
import type { SendMessageOptions } from "chatgpt"
import { Utils } from "~/src/utils/utils.ts"
import { isDev } from "~/src/utils/constants.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { AiConstants } from "~/src/ai/AiConstants.ts"
import sypIdUtil from "~/src/utils/sypIdUtil.ts"

/**
 * OpenCode Go 接口标识：其 baseURL 形如 https://opencode.ai/zen/go/v1
 *
 * OpenCode Go 要求每个请求都携带 `x-opencode-session` 头（用于会话路由与 prompt 缓存），
 * chatgpt 库默认只发送 Content-Type 与 Authorization，缺少该头会返回 400 MissingSessionID。
 */
const OPENCODE_GO_BASE_URL = "https://opencode.ai/zen/go"

/**
 * 判断当前 AI 配置目标是否为 OpenCode Go 接口
 */
const isOpenCodeGo = (baseUrl?: string): boolean => {
  return !StrUtil.isEmptyString(baseUrl) && baseUrl?.includes(OPENCODE_GO_BASE_URL)
}

/**
 * 为 OpenCode Go 请求注入 x-opencode-session 头
 *
 * @param baseFetch 原始的 fetch 实现（绑定好的全局 fetch）
 * @returns 注入会话头之后的 fetch
 */
const injectOpenCodeGoSessionHeader = (baseFetch: typeof fetch) => {
  const sessionId = sypIdUtil.newUuid()
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const headers = new Headers(init?.headers)
    // OpenCode Go 要求每条会话提供稳定 ID，使用固定 UUID 即可
    headers.set("x-opencode-session", sessionId)
    return baseFetch(input, init ? { ...init, headers } : { headers })
  }
}

/**
 * 根据目标 baseURL 计算应使用的 fetch，OpenCode Go 需要额外注入会话头
 */
const resolveFetch = (baseUrl?: string) => {
  const baseFetch = self.fetch.bind(self)
  return isOpenCodeGo(baseUrl) ? injectOpenCodeGoSessionHeader(baseFetch) : baseFetch
}

/**
 * 创建一个用于与 ChatGPT 服务进行交互的钩子
 *
 * https://github.com/transitive-bullshit/chatgpt-api
 * https://prompts.chat/
 * @author terwer
 * @since 1.9.1
 */
const useChatGPT = () => {
  const logger = createAppLogger("use-chatgpt")
  const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()
  const pref = getReadOnlyPublishPreferenceSetting()

  // 创建 ChatGPTAPI 实例
  let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI = undefined
  const getAPI = async () => {
    if (api === undefined) {
      try {
        // 设置了代理地址创建代理实例，否则使用官方实例
        if (!StrUtil.isEmptyString(pref.value.experimentalAIProxyUrl)) {
          api = new ChatGPTUnofficialProxyAPI({
            accessToken: Utils.emptyOrDefault(process.env.OPENAI_API_KEY, pref.value.experimentalAICode),
            apiReverseProxyUrl: Utils.emptyOrDefault(process.env.OPENAI_PROXY_URL, pref.value.experimentalAIProxyUrl),
            debug: isDev,
            // workaround for https://github.com/transitive-bullshit/chatgpt-api/issues/592
            fetch: resolveFetch(pref.value.experimentalAIProxyUrl),
          })
        } else {
          api = new ChatGPTAPI({
            apiKey: Utils.emptyOrDefault(process.env.OPENAI_ACCESS_TOKEN, pref.value.experimentalAICode),
            apiBaseUrl: Utils.emptyOrDefault(process.env.OPENAI_BASE_URL, pref.value.experimentalAIBaseUrl),
            debug: isDev,
            // workaround for https://github.com/transitive-bullshit/chatgpt-api/issues/592
            fetch: resolveFetch(pref.value.experimentalAIBaseUrl),
            completionParams: {
              model: pref.value.experimentalAIApiModel,
              max_tokens: pref.value.experimentalAIApiMaxTokens,
              temperature: pref.value.experimentalAIApiTemperature,
            },
          })
        }
      } catch (e) {
        // 初始化 API 失败时，记录错误但继续执行
        logger.error("Failed to initialize ChatGPT API:", e)
        throw e
      }
    }
    return api
  }
  /**
   * 发送聊天查询到 ChatGPT 服务
   *
   * @async
   * @function
   * @param {string} q - 用户输入的聊天查询
   * @param opts - 选项
   * @returns {Promise<string>} - 带有来自 ChatGPT 服务响应的 Promise
   * @throws {Error} - 如果与 ChatGPT 服务交互时出现问题，则抛出错误
   * @example
   * const chatResponse = await chat('你好，ChatGPT！');
   * console.log(chatResponse); // ChatGPT 生成的响应
   */
  const chat = async (q: string, opts?: SendMessageOptions & { silent?: boolean }): Promise<string | any> => {
    try {
      const api = await getAPI()
      // 使用 ChatGPTAPI 实例进行聊天操作
      opts = opts || {}
      const completionParams = opts?.completionParams ?? {}
      opts.completionParams = {
        ...completionParams,
        model: pref.value.experimentalAIApiModel,
        max_tokens:
          pref.value.experimentalAIApiMaxTokens > 0
            ? pref.value.experimentalAIApiMaxTokens
            : AiConstants.MAX_INPUT_TOKEN_LENGTH,
        temperature: pref.value.experimentalAIApiTemperature,
      }

      logger.debug("chat q =>", { q, opts })
      const res = await api.sendMessage(q, opts)
      logger.debug("chat res =>", res)
      if (opts.stream) {
        return res
      } else {
        return res.text
      }
    } catch (e) {
      logger.error("Chat encountered an error:", e)
      // silent 模式（如摘要自动生成）由调用方负责兜底，避免弹出误导性错误
      if (!opts?.silent) {
        ElMessage.error("Chat encountered an error:" + e)
      }
    }
  }

  /**
   * 获取聊天输入
   *
   * @param input1 可能为空的输入1，优先级高
   * @param input2 不为空的输入2，优先级低
   */
  const getChatInput = (input1: string, input2: string) => {
    const md = input1.substring(0, AiConstants.MAX_INPUT_TOKEN_LENGTH)
    const html = HtmlUtil.parseHtml(input2, AiConstants.MAX_INPUT_TOKEN_LENGTH, true)
    return Utils.emptyOrDefault(md, html)
  }

  return {
    getChatInput,
    chat,
  }
}

export { useChatGPT }
