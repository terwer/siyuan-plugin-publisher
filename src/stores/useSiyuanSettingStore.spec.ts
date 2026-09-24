/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

/**
 * 思源连接配置的读取语义。
 *
 * 关键回归：只有在「确实运行在思源上下文」（桌面端渲染进程 / 挂件 iframe，
 * 两者都有 window.siyuan）时，才可以用当前 origin 回写 apiUrl。浏览器扩展与
 * 独立网页里 origin 是扩展/站点地址，无条件回写会把用户填的内核地址冲掉
 * （现象：填了保存、刷新后变回默认值）。
 */

const mockStorage = vi.hoisted(() => ({ stored: undefined as any, seeded: false }))
const mockSiyuanWindow = vi.hoisted(() => vi.fn())

vi.mock("~/src/stores/common/useCommonLocalStorage.ts", () => ({
  default: (_filePath: string, _storageKey: string, initialValue: any) => {
    // 模拟 useStorage：已有落盘值则以其为准，否则写入 initialValue
    if (!mockStorage.seeded) {
      mockStorage.stored = { ...initialValue }
    }
    return { value: mockStorage.stored }
  },
}))

vi.mock("zhi-device", () => ({
  SiyuanDevice: {
    siyuanWindow: mockSiyuanWindow,
  },
}))

const loadStore = async () => {
  vi.resetModules()
  const mod = await import("~/src/stores/useSiyuanSettingStore.ts")
  return mod.useSiyuanSettingStore()
}

describe("useSiyuanSettingStore apiUrl 读取语义", () => {
  beforeEach(() => {
    mockStorage.stored = undefined
    mockStorage.seeded = false
    mockSiyuanWindow.mockReset()
    delete process.env.VITE_SIYUAN_API_URL
  })

  it("浏览器扩展/独立网页：不覆盖用户已保存的内核地址", async () => {
    // 扩展弹窗：origin 是 chrome-extension://<id>，且 window 上没有 siyuan
    mockSiyuanWindow.mockReturnValue({ location: { origin: "chrome-extension://abcdefghijklmnop" } })
    mockStorage.stored = { apiUrl: "http://127.0.0.1:9999", password: "tok" }
    mockStorage.seeded = true

    const store = await loadStore()
    const cfg = store.getSiyuanSetting()

    expect(cfg.value.apiUrl).toBe("http://127.0.0.1:9999")
    expect(cfg.value.password).toBe("tok")
  })

  it("思源宿主：仍按当前 origin 同步 apiUrl（保持既有行为）", async () => {
    mockSiyuanWindow.mockReturnValue({
      siyuan: { config: {} },
      location: { origin: "https://127.0.0.1:51502" },
    })
    mockStorage.stored = { apiUrl: "http://127.0.0.1:9999", password: "tok" }
    mockStorage.seeded = true

    const store = await loadStore()
    const cfg = store.getSiyuanSetting()

    expect(cfg.value.apiUrl).toBe("https://127.0.0.1:51502")
  })

  it("首次使用（无落盘值）：用默认值初始化", async () => {
    mockSiyuanWindow.mockReturnValue({ location: { origin: "chrome-extension://abcdefghijklmnop" } })

    const store = await loadStore()
    const cfg = store.getSiyuanSetting()

    expect(cfg.value.apiUrl).toBe("http://127.0.0.1:6806")
  })

  it("构建期环境变量优先于 origin 作为默认值", async () => {
    process.env.VITE_SIYUAN_API_URL = "http://192.168.1.10:6806"
    mockSiyuanWindow.mockReturnValue({ location: { origin: "http://localhost:3000" } })

    const store = await loadStore()
    const cfg = store.getSiyuanSetting()

    expect(cfg.value.apiUrl).toBe("http://192.168.1.10:6806")
  })
})
