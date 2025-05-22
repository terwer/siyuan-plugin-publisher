import { describe, it, expect, vi, beforeEach } from 'vitest'
import BaseClient from './index'

describe('BaseClient', () => {
  let client: BaseClient
  let mockFetch: any

  beforeEach(() => {
    mockFetch = vi.fn()
    client = new BaseClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      headers: {
        'X-Custom-Header': 'test'
      },
      fetch: mockFetch
    })
  })

  describe('Constructor', () => {
    it('should initialize with default values', () => {
      const defaultClient = new BaseClient()
      expect(defaultClient).toBeDefined()
    })

    it('should set custom options correctly', () => {
      expect(client).toBeDefined()
    })
  })

  describe('Request Methods', () => {
    it('should handle successful JSON response', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockResponse)
      })

      const result = await client['request']({
        method: 'GET',
        url: '/test'
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers)
        })
      )
    })

    it('should handle successful text response', async () => {
      const mockResponse = 'test response'
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve(mockResponse)
      })

      const result = await client['request']({
        method: 'GET',
        url: '/test'
      })

      expect(result).toBe(mockResponse)
    })

    it('should throw error on request timeout', async () => {
      mockFetch.mockImplementationOnce(() => new Promise(() => {}))

      await expect(client['request']({
        method: 'GET',
        url: '/test'
      })).rejects.toThrow('Request timeout after 5000ms')
    })

    it('should throw error on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(client['request']({
        method: 'GET',
        url: '/test'
      })).rejects.toThrow('HTTP error! status: 404')
    })
  })

  describe('Proxy Configuration', () => {
    it('should set proxy correctly', () => {
      const proxy = {
        host: 'proxy.example.com',
        port: 8080,
        protocol: 'http' as const,
        auth: {
          username: 'user',
          password: 'pass'
        }
      }

      client.setProxy(proxy)
      const proxyUrl = client['getProxyUrl']()
      expect(proxyUrl).toBe('http://user:pass@proxy.example.com:8080')
    })

    it('should remove proxy correctly', () => {
      client.setProxy({
        host: 'proxy.example.com',
        port: 8080
      })
      client.removeProxy()
      const proxyUrl = client['getProxyUrl']()
      expect(proxyUrl).toBeUndefined()
    })
  })

  describe('Header Operations', () => {
    it('should set header correctly', () => {
      client.setHeader('X-Test', 'value')
      expect(client['headers']['X-Test']).toBe('value')
    })

    it('should remove header correctly', () => {
      client.setHeader('X-Test', 'value')
      client.removeHeader('X-Test')
      expect(client['headers']['X-Test']).toBeUndefined()
    })
  })
}) 