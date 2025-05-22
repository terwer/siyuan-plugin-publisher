// noinspection JSConstantReassignment

import { describe, it, expect, vi, beforeEach } from "vitest"
import XMLRPCClient from "./index"
import { JSDOM } from "jsdom"

// Mock global window object
const dom = new JSDOM()
global.window = {
  fetch: vi.fn(),
  DOMParser: dom.window.DOMParser,
} as any

describe("XMLRPCClient", () => {
  let client: XMLRPCClient
  let mockFetch: any

  beforeEach(() => {
    // Mock fetch function
    mockFetch = vi.fn()
    // Reset window.fetch mock
    window.fetch = mockFetch
    client = new XMLRPCClient({
      endpoint: "http://test.endpoint",
    })
  })

  describe("constructor", () => {
    it("should create client with custom fetch function", () => {
      const customFetch = vi.fn()
      const client = new XMLRPCClient({
        endpoint: "http://test.endpoint",
        fetch: customFetch,
      })
      expect(client).toBeInstanceOf(XMLRPCClient)
    })

    it("should use window.fetch when no fetch function provided", () => {
      const client = new XMLRPCClient({
        endpoint: "http://test.endpoint",
      })
      expect(client).toBeInstanceOf(XMLRPCClient)
    })
  })

  describe("methodCall", () => {
    it("should make successful XML-RPC call with string parameter", async () => {
      const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <methodResponse>
          <params>
            <param>
              <value><string>success</string></value>
            </param>
          </params>
        </methodResponse>`

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const result = await client.methodCall("testMethod", "testParam")
      expect(result).toBe("success")
      expect(mockFetch).toHaveBeenCalledWith(
        "http://test.endpoint",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "text/xml",
          }),
        }),
      )
    })

    it("should handle XML-RPC fault response", async () => {
      const mockFaultResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <methodResponse>
          <fault>
            <value>
              <struct>
                <member>
                  <name>faultCode</name>
                  <value><int>1</int></value>
                </member>
                <member>
                  <name>faultString</name>
                  <value><string>Test Error</string></value>
                </member>
              </struct>
            </value>
          </fault>
        </methodResponse>`

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockFaultResponse),
      })

      await expect(client.methodCall("testMethod")).rejects.toThrow("XML-RPC Fault")
    })

    it("should handle HTTP error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(client.methodCall("testMethod")).rejects.toThrow("HTTP error! status: 500")
    })
  })

  describe("methodCallWithTimeout", () => {
    it("should timeout after specified duration", async () => {
      mockFetch.mockImplementationOnce(() => new Promise(() => {}))

      await expect(client.methodCallWithTimeout("testMethod", [], 100)).rejects.toThrow(
        "XML-RPC call timeout after 100ms",
      )
    })

    it("should complete successfully within timeout", async () => {
      const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <methodResponse>
          <params>
            <param>
              <value><string>success</string></value>
            </param>
          </params>
        </methodResponse>`

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const result = await client.methodCallWithTimeout("testMethod", [], 1000)
      expect(result).toBe("success")
    })
  })

  describe("value conversion", () => {
    it("should handle different value types correctly", async () => {
      const testCases = [
        { input: "string", expected: "<string>string</string>" },
        { input: 42, expected: "<int>42</int>" },
        { input: 3.14, expected: "<double>3.14</double>" },
        { input: true, expected: "<boolean>1</boolean>" },
        { input: false, expected: "<boolean>0</boolean>" },
        { input: null, expected: "<nil/>" },
        { input: new Date("2024-01-01"), expected: "<dateTime.iso8601>2024-01-01T00:00:00.000Z</dateTime.iso8601>" },
        { input: Buffer.from("test"), expected: "<base64>dGVzdA==</base64>" },
        {
          input: ["a", "b"],
          expected: "<array><data><value><string>a</string></value><value><string>b</string></value></data></array>",
        },
        {
          input: { key: "value" },
          expected: "<struct><member><name>key</name><value><string>value</string></value></member></struct>",
        },
      ]

      for (const testCase of testCases) {
        const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
          <methodResponse>
            <params>
              <param>
                <value>${testCase.expected}</value>
              </param>
            </params>
          </methodResponse>`

        mockFetch.mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockResponse),
        })

        const result = await client.methodCall("testMethod", testCase.input)
        expect(result).toEqual(testCase.input)
      }
    })

    it("should escape XML special characters", async () => {
      const input = "<test>&\"'</test>"
      const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <methodResponse>
          <params>
            <param>
              <value><string>&lt;test&gt;&amp;&quot;&apos;&lt;/test&gt;</string></value>
            </param>
          </params>
        </methodResponse>`

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const result = await client.methodCall("testMethod", input)
      expect(result).toBe(input)
    })
  })
})
