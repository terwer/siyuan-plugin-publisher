type FetchFunction = typeof window.fetch

export type XmlRpcValue =
  | string
  | number
  | boolean
  | Date
  | Buffer
  | null
  | object
  | XmlRpcValue[]
  | { [key: string]: XmlRpcValue }

export interface XMLRPCClientOptions {
  endpoint: string
  fetch?: FetchFunction
}

export class XMLRPCClient {
  private fetch: FetchFunction
  private endpoint: string

  constructor(options: XMLRPCClientOptions) {
    this.endpoint = options.endpoint
    this.fetch = options.fetch || window.fetch
  }

  private createXmlRpcRequest(methodName: string, params: XmlRpcValue[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
  <methodName>${methodName}</methodName>
  <params>
    ${params.map((param) => `<param><value>${this.valueToXml(param)}</value></param>`).join("\n    ")}
  </params>
</methodCall>`
    return xml
  }

  private valueToXml(value: XmlRpcValue): string {
    if (value === null || value === undefined) {
      return "<nil/>"
    }

    if (value instanceof Date) {
      return `<dateTime.iso8601>${value.toISOString()}</dateTime.iso8601>`
    }

    if (value instanceof Buffer) {
      return `<base64>${value.toString("base64")}</base64>`
    }

    switch (typeof value) {
      case "string":
        return `<string>${this.escapeXml(value)}</string>`
      case "number":
        if (Number.isInteger(value)) {
          return `<int>${value}</int>`
        }
        return `<double>${value}</double>`
      case "boolean":
        return `<boolean>${value ? 1 : 0}</boolean>`
      case "object":
        if (Array.isArray(value)) {
          return `<array><data>${value.map((item) => `<value>${this.valueToXml(item)}</value>`).join("")}</data></array>`
        }
        return `<struct>${Object.entries(value)
          .map(([key, val]) => `<member><name>${key}</name><value>${this.valueToXml(val)}</value></member>`)
          .join("")}</struct>`
      default:
        return `<string>${String(value)}</string>`
    }
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  }

  public async methodCall(methodName: string, ...params: XmlRpcValue[]): Promise<XmlRpcValue> {
    const xmlRequest = this.createXmlRpcRequest(methodName, params)

    try {
      const response = await this.fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml",
          "Content-Length": String(xmlRequest.length),
        },
        body: xmlRequest,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()
      return this.parseXmlResponse(responseText)
    } catch (error) {
      throw new Error(`XML-RPC call failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  public async methodCallWithTimeout(methodName: string, params: XmlRpcValue[], timeout: number): Promise<XmlRpcValue> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const xmlRequest = this.createXmlRpcRequest(methodName, params)
      const response = await this.fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml",
          "Content-Length": String(xmlRequest.length),
        },
        body: xmlRequest,
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()
      return this.parseXmlResponse(responseText)
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`XML-RPC call timeout after ${timeout}ms`)
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private parseXmlResponse(xmlText: string): XmlRpcValue {
    const parser = new window.DOMParser()
    const doc = parser.parseFromString(xmlText, "text/xml")

    // 检查是否有错误
    const fault = doc.getElementsByTagName("fault")[0]
    if (fault) {
      const faultValue = this.parseValue(fault.getElementsByTagName("value")[0])
      throw new Error(`XML-RPC Fault: ${JSON.stringify(faultValue)}`)
    }

    // 获取返回值
    const params = doc.getElementsByTagName("param")
    if (params.length === 0) {
      return null
    }

    return this.parseValue(params[0].getElementsByTagName("value")[0])
  }

  private parseValue(valueElement: Element): XmlRpcValue {
    const type = valueElement.firstElementChild?.tagName
    const content = valueElement.firstElementChild?.textContent

    switch (type) {
      case "string":
        return content || ""
      case "int":
      case "i4":
        return parseInt(content || "0", 10)
      case "double":
        return parseFloat(content || "0")
      case "boolean":
        return content === "1"
      case "dateTime.iso8601":
        return new Date(content || "")
      case "base64":
        return Buffer.from(content || "", "base64")
      case "array":
        const data = valueElement.getElementsByTagName("data")[0]
        return Array.from(data.getElementsByTagName("value")).map((v) => this.parseValue(v))
      case "struct":
        const members = valueElement.getElementsByTagName("member")
        const result: { [key: string]: XmlRpcValue } = {}
        for (let i = 0; i < members.length; i++) {
          const member = members[i]
          const name = member.getElementsByTagName("name")[0].textContent || ""
          const value = member.getElementsByTagName("value")[0]
          result[name] = this.parseValue(value)
        }
        return result
      case "nil":
        return null
      default:
        return content || ""
    }
  }
}

export default XMLRPCClient
