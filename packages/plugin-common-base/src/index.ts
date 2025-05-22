export type FetchFunction = typeof fetch

export interface BaseClientOptions {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  fetch?: FetchFunction
  proxy?: {
    host: string
    port: number
    protocol?: "http" | "https"
    auth?: {
      username: string
      password: string
    }
  }
}

export class BaseClient {
  private baseURL: string
  private timeout: number
  private headers: Record<string, string>
  private fetch: FetchFunction
  private proxy?: BaseClientOptions["proxy"]

  constructor(options: BaseClientOptions = {}) {
    this.baseURL = options.baseURL || ""
    this.timeout = options.timeout || 30000
    this.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }
    this.fetch = options.fetch || globalThis.fetch
    this.proxy = options.proxy
  }

  private getProxyUrl(): string | undefined {
    if (!this.proxy) return undefined

    const { host, port, protocol = "http", auth } = this.proxy
    const authStr = auth ? `${auth.username}:${auth.password}@` : ""
    return `${protocol}://${authStr}${host}:${port}`
  }

  protected async request<T>(config: {
    method: string
    url: string
    data?: any
    headers?: Record<string, string>
  }): Promise<T> {
    const url = new URL(config.url, this.baseURL)
    const headers = new Headers({
      ...this.headers,
      ...config.headers,
    })

    const proxyUrl = this.getProxyUrl()
    const fetchOptions: RequestInit = {
      method: config.method,
      headers,
      body: config.data ? JSON.stringify(config.data) : undefined,
      // @ts-ignore - 代理配置
      agent: proxyUrl ? new URL(proxyUrl) : undefined,
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)
      fetchOptions.signal = controller.signal

      const response = await this.fetch(url.toString(), fetchOptions)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        return response.json()
      }
      return response.text() as unknown as T
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${this.timeout}ms`)
        }
        throw new Error(`Request failed: ${error.message}`)
      }
      throw error
    }
  }

  public setHeader(key: string, value: string): void {
    this.headers[key] = value
  }

  public removeHeader(key: string): void {
    delete this.headers[key]
  }

  public setProxy(proxy: BaseClientOptions["proxy"]): void {
    this.proxy = proxy
  }

  public removeProxy(): void {
    this.proxy = undefined
  }

  public setFetch(fetch: FetchFunction): void {
    this.fetch = fetch
  }
}

export default BaseClient
