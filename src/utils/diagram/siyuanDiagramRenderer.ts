/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { SiyuanDevice } from "zhi-device"
import type {
  DiagramRenderOptions,
  DiagramRenderTheme,
  DiagramRenderer,
} from "~/src/utils/diagram/diagramTypes.ts"

const SCRIPT_PATHS: Record<string, string> = {
  mermaid: "/stage/protyle/js/mermaid/mermaid.min.js",
  flowchart: "/stage/protyle/js/flowchart.js/flowchart.min.js",
  graphviz: "/stage/protyle/js/graphviz/viz.js",
  echarts: "/stage/protyle/js/echarts/echarts.min.js",
  abc: "/stage/protyle/js/abcjs/abcjs-basic-min.js",
  plantuml: "/stage/protyle/js/plantuml/plantuml-encoder.min.js",
}

const DEFAULT_PLANTUML_SERVE_PATH = "https://www.plantuml.com/plantuml/svg/~1"
const MAX_PIXEL_SIZE = 4096
const ECHARTS_WIDTH = 900
const ECHARTS_HEIGHT = 600

interface PlantUmlImageInfo {
  imageBase64: string
  mimeType?: string
}

export interface SiyuanDiagramRendererOptions {
  /** 当前文档 / 插件页面的 origin 对应的思源内核地址；为空时使用页面相对地址 */
  baseUrl?: string
  plantUmlServePath?: string
  theme?: DiagramRenderTheme
  /** 读取 PlantUML 远程图片；默认使用 window.fetch */
  fetchImageBase64?: (url: string) => Promise<PlantUmlImageInfo>
  /** 测试注入 */
  hostWindow?: Window & typeof globalThis
  hostDocument?: Document
}

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = ""
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

const base64ToBytes = (base64: string): Uint8Array => {
  const clean = base64.includes(";base64,") ? base64.split(";base64,").pop() ?? "" : base64
  const binary = atob(clean)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

const dataUrlToBytes = (dataUrl: string): Uint8Array => {
  return base64ToBytes(dataUrl)
}

const resolveScale = (width: number, height: number, requestedScale: number): number => {
  const scale = Math.min(3, Math.max(1, Number(requestedScale) || 1))
  const maxSide = Math.max(width, height)
  if (maxSide <= 0 || maxSide * scale <= MAX_PIXEL_SIZE) {
    return scale
  }
  return Math.max(0.1, MAX_PIXEL_SIZE / maxSide)
}

const readPositiveNumber = (value: string | null | undefined): number => {
  if (!value) {
    return 0
  }
  const parsed = Number.parseFloat(value.replace(/[^\d.+-]/g, ""))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

const resolveSvgSize = (svg: SVGSVGElement): { width: number; height: number } => {
  const viewBox = svg.getAttribute("viewBox")
  if (viewBox) {
    const parts = viewBox
      .trim()
      .split(/[\s,]+/)
      .map((item) => Number.parseFloat(item))
    if (parts.length >= 4 && parts[2] > 0 && parts[3] > 0) {
      return { width: parts[2], height: parts[3] }
    }
  }
  const width = readPositiveNumber(svg.getAttribute("width"))
  const height = readPositiveNumber(svg.getAttribute("height"))
  if (width > 0 && height > 0) {
    return { width, height }
  }
  try {
    const box = svg.getBBox()
    if (box.width > 0 && box.height > 0) {
      return { width: box.width, height: box.height }
    }
  } catch {
    // getBBox 在未挂载节点上会抛错，回退默认尺寸
  }
  return { width: 1200, height: 600 }
}

const prepareSvgForRaster = (svg: SVGSVGElement, width: number, height: number): string => {
  svg.setAttribute("width", String(width))
  svg.setAttribute("height", String(height))
  if (!svg.getAttribute("viewBox")) {
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
  }
  return new XMLSerializer().serializeToString(svg)
}

const loadImage = (image: HTMLImageElement, src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error("图像加载失败"))
    image.src = src
  })
}

/**
 * 思源文本图渲染器。
 *
 * 在插件页面内创建一个同源隐藏 iframe，按需加载思源内核自带的图表渲染脚本，
 * 在隔离的窗口里渲染后光栅化为 PNG，避免污染思源主窗口的 mermaid/echarts 全局状态。
 */
export class SiyuanDiagramRenderer implements DiagramRenderer {
  private readonly options: SiyuanDiagramRendererOptions
  private frame?: HTMLIFrameElement
  private frameDocument?: Document
  private frameWindow?: Window & typeof globalThis
  private readonly scripts = new Map<string, Promise<void>>()
  private sequence = 0

  constructor(options: SiyuanDiagramRendererOptions = {}) {
    this.options = options
  }

  async render(options: DiagramRenderOptions): Promise<Uint8Array> {
    switch (options.language) {
      case "mermaid":
        return await this.renderMermaid(options)
      case "flowchart":
        return await this.renderFlowchart(options)
      case "graphviz":
        return await this.renderGraphviz(options)
      case "echarts":
        return await this.renderEcharts(options)
      case "abc":
        return await this.renderAbc(options)
      case "plantuml":
        return await this.renderPlantuml(options)
      default:
        throw new Error(`不支持的文本图类型: ${options.language}`)
    }
  }

  dispose(): void {
    this.frame?.remove()
    this.frame = undefined
    this.frameDocument = undefined
    this.frameWindow = undefined
    this.scripts.clear()
  }

  private get hostWindow(): Window & typeof globalThis {
    return (this.options.hostWindow ?? (typeof window !== "undefined" ? window : undefined)) as Window & typeof globalThis
  }

  private get hostDocument(): Document {
    const doc = this.options.hostDocument ?? this.hostWindow?.document
    if (!doc) {
      throw new Error("当前宿主没有可用 document，无法渲染文本图")
    }
    return doc
  }

  private ensureFrame(): { doc: Document; win: Window & typeof globalThis } {
    if (this.frameDocument && this.frameWindow) {
      return { doc: this.frameDocument, win: this.frameWindow }
    }
    const hostDoc = this.hostDocument
    const frame = hostDoc.createElement("iframe")
    frame.setAttribute("aria-hidden", "true")
    frame.tabIndex = -1
    frame.style.cssText =
      "position:fixed;left:-100000px;top:0;width:1200px;height:800px;border:0;pointer-events:none;"
    const parent = hostDoc.body ?? hostDoc.documentElement
    if (!parent) {
      throw new Error("当前宿主没有可用 DOM，无法渲染文本图")
    }
    parent.appendChild(frame)
    const doc = frame.contentDocument
    const win = frame.contentWindow as (Window & typeof globalThis) | null
    if (!doc || !win) {
      frame.remove()
      throw new Error("无法创建文本图渲染容器")
    }
    doc.open()
    doc.write(
      "<!doctype html><html><head><meta charset=\"utf-8\"><style>html,body{margin:0;padding:0;background:transparent;}</style></head><body></body></html>"
    )
    doc.close()
    this.frame = frame
    this.frameDocument = doc
    this.frameWindow = win
    return { doc, win }
  }

  private resolveScriptUrl(path: string): string {
    const baseUrl = this.options.baseUrl?.trim()
    if (!baseUrl) {
      return path
    }
    try {
      return new URL(path, baseUrl).toString()
    } catch {
      return path
    }
  }

  private async loadScript(win: Window & typeof globalThis, doc: Document, id: string): Promise<void> {
    const path = SCRIPT_PATHS[id]
    if (!path) {
      throw new Error(`未知的文本图渲染脚本: ${id}`)
    }
    const cached = this.scripts.get(id)
    if (cached) {
      return await cached
    }
    const promise = new Promise<void>((resolve, reject) => {
      if (doc.getElementById(`syp-diagram-${id}`)) {
        resolve()
        return
      }
      const script = doc.createElement("script")
      script.id = `syp-diagram-${id}`
      script.src = this.resolveScriptUrl(path)
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`加载思源图表渲染脚本失败: ${path}`))
      doc.head.appendChild(script)
    })
    this.scripts.set(id, promise)
    try {
      await promise
    } catch (error) {
      this.scripts.delete(id)
      throw error
    }
  }

  private background(theme: DiagramRenderTheme): string {
    return theme === "dark" ? "#1f1f1f" : "#ffffff"
  }

  private createCanvas(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const doc = this.frameDocument ?? this.hostDocument
    const canvas = doc.createElement("canvas")
    canvas.width = Math.max(1, Math.round(width))
    canvas.height = Math.max(1, Math.round(height))
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("当前宿主不支持 Canvas 2D，无法输出文本图")
    }
    return { canvas, ctx }
  }

  private async svgToPng(svg: SVGSVGElement, theme: DiagramRenderTheme, scale: number): Promise<Uint8Array> {
    const doc = this.frameDocument ?? this.hostDocument
    const size = resolveSvgSize(svg)
    const rasterScale = resolveScale(size.width, size.height, scale)
    const width = Math.max(1, Math.round(size.width * rasterScale))
    const height = Math.max(1, Math.round(size.height * rasterScale))
    const svgText = prepareSvgForRaster(svg, size.width, size.height)
    const image = doc.createElement("img")
    await loadImage(image, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`)
    const { canvas, ctx } = this.createCanvas(width, height)
    ctx.fillStyle = this.background(theme)
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(image, 0, 0, width, height)
    const trimmed = await this.trimPngDataUrl(canvas.toDataURL("image/png"), this.background(theme))
    return dataUrlToBytes(trimmed)
  }

  private parseSvg(doc: Document, svgText: string): SVGSVGElement {
    const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml")
    const root = parsed.documentElement
    if (!root || root.nodeName.toLowerCase() !== "svg" || parsed.querySelector("parsererror")) {
      throw new Error("渲染器没有返回有效 SVG")
    }
    return doc.importNode(root, true) as unknown as SVGSVGElement
  }

  private async renderMermaid(options: DiagramRenderOptions): Promise<Uint8Array> {
    const { doc, win } = this.ensureFrame()
    await this.loadScript(win, doc, "mermaid")
    const mermaid = (win as any).mermaid
    if (!mermaid) {
      throw new Error("思源 Mermaid 渲染器不可用")
    }
    mermaid.initialize({
      startOnLoad: false,
      theme: options.theme === "dark" ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "sans-serif",
      altFontFamily: "sans-serif",
      flowchart: { htmlLabels: true, useMaxWidth: true },
      sequence: { useMaxWidth: true },
    })
    const container = doc.createElement("div")
    container.style.cssText = "position:absolute;left:-100000px;top:0;width:1200px;"
    doc.body.appendChild(container)
    try {
      const id = `syp-mermaid-${Date.now()}-${this.sequence++}`
      const result = await mermaid.render(id, options.code, container)
      if (!result?.svg) {
        throw new Error("Mermaid 没有返回 SVG")
      }
      return await this.svgToPng(this.parseSvg(doc, result.svg), options.theme, options.scale)
    } finally {
      container.remove()
    }
  }

  private async renderFlowchart(options: DiagramRenderOptions): Promise<Uint8Array> {
    const { doc, win } = this.ensureFrame()
    await this.loadScript(win, doc, "flowchart")
    const flowchart = (win as any).flowchart
    if (!flowchart) {
      throw new Error("思源 Flowchart 渲染器不可用")
    }
    const container = doc.createElement("div")
    container.style.cssText = "position:absolute;left:-100000px;top:0;width:1200px;"
    doc.body.appendChild(container)
    try {
      const parsed = flowchart.parse(options.code)
      if (!parsed || typeof parsed.drawSVG !== "function") {
        throw new Error("Flowchart 代码解析失败")
      }
      parsed.drawSVG(container)
      const svg = container.querySelector("svg") as SVGSVGElement | null
      if (!svg) {
        throw new Error("Flowchart 没有返回 SVG")
      }
      return await this.svgToPng(svg, options.theme, options.scale)
    } finally {
      container.remove()
    }
  }

  private async renderGraphviz(options: DiagramRenderOptions): Promise<Uint8Array> {
    const { doc, win } = this.ensureFrame()
    await this.loadScript(win, doc, "graphviz")
    const vizFactory = (win as any).Viz
    if (!vizFactory?.instance) {
      throw new Error("思源 Graphviz 渲染器不可用")
    }
    const viz = await vizFactory.instance()
    const svg = viz.renderSVGElement(options.code) as SVGSVGElement
    return await this.svgToPng(svg, options.theme, options.scale)
  }

  private async renderEcharts(options: DiagramRenderOptions): Promise<Uint8Array> {
    const { doc, win } = this.ensureFrame()
    await this.loadScript(win, doc, "echarts")
    const echarts = (win as any).echarts
    if (!echarts) {
      throw new Error("思源 ECharts 渲染器不可用")
    }
    const option = this.parseEchartsOption(options.code)
    const container = doc.createElement("div")
    container.style.cssText = `position:absolute;left:-100000px;top:0;width:${ECHARTS_WIDTH}px;height:${ECHARTS_HEIGHT}px;`
    doc.body.appendChild(container)
    let chart: any
    try {
      chart = echarts.init(container, null, {
        renderer: "canvas",
        width: ECHARTS_WIDTH,
        height: ECHARTS_HEIGHT,
      })
      chart.setOption(option, { notMerge: true })
      await new Promise((resolve) => setTimeout(resolve, 260))
      const rasterScale = resolveScale(ECHARTS_WIDTH, ECHARTS_HEIGHT, options.scale)
      const dataUrl: string = chart.getDataURL({
        type: "png",
        pixelRatio: rasterScale,
        backgroundColor: this.background(options.theme),
      })
      const trimmed = await this.trimPngDataUrl(dataUrl, this.background(options.theme))
      return dataUrlToBytes(trimmed)
    } finally {
      chart?.dispose?.()
      container.remove()
    }
  }

  private async renderAbc(options: DiagramRenderOptions): Promise<Uint8Array> {
    const { doc, win } = this.ensureFrame()
    await this.loadScript(win, doc, "abc")
    const abcjs = (win as any).ABCJS
    if (!abcjs?.renderAbc) {
      throw new Error("思源 ABC 渲染器不可用")
    }
    const container = doc.createElement("div")
    container.style.cssText = "position:absolute;left:-100000px;top:0;width:1200px;"
    doc.body.appendChild(container)
    try {
      abcjs.renderAbc(container, options.code, this.parseAbcParams(options.code))
      const svg = container.querySelector("svg") as SVGSVGElement | null
      if (!svg) {
        throw new Error("ABC 没有返回 SVG")
      }
      return await this.svgToPng(svg, options.theme, options.scale)
    } finally {
      container.remove()
    }
  }

  private async renderPlantuml(options: DiagramRenderOptions): Promise<Uint8Array> {
    const { doc, win } = this.ensureFrame()
    await this.loadScript(win, doc, "plantuml")
    const encoder = (win as any).plantumlEncoder
    if (!encoder?.encode) {
      throw new Error("思源 PlantUML 编码器不可用")
    }
    const encoded = encoder.encode(options.code)
    const servePath = (options.plantUmlServePath || this.options.plantUmlServePath || DEFAULT_PLANTUML_SERVE_PATH).trim()
    const pngServePath = servePath.replace(/\/svg\//, "/png/")
    const url = `${pngServePath}${encoded}`
    const info = await this.fetchImageBase64(url)
    const mime = String(info.mimeType ?? "").toLowerCase()
    if (mime.includes("svg")) {
      const svgBytes = base64ToBytes(info.imageBase64)
      const svgText = new TextDecoder("utf-8").decode(svgBytes)
      return await this.svgToPng(this.parseSvg(doc, svgText), options.theme, options.scale)
    }
    return base64ToBytes(info.imageBase64)
  }

  private async fetchImageBase64(url: string): Promise<PlantUmlImageInfo> {
    if (this.options.fetchImageBase64) {
      return await this.options.fetchImageBase64(url)
    }
    const response = await this.hostWindow.fetch(url, { credentials: "same-origin" })
    if (!response.ok) {
      throw new Error(`PlantUML 服务返回 HTTP ${response.status}`)
    }
    const blob = await response.blob()
    const buffer = new Uint8Array(await blob.arrayBuffer())
    return {
      imageBase64: bytesToBase64(buffer),
      mimeType: blob.type,
    }
  }

  private parseEchartsOption(code: string): any {
    const text = String(code ?? "").trim()
    if (!text) {
      throw new Error("ECharts 配置为空")
    }
    try {
      return JSON.parse(text)
    } catch {
      const cleaned = text
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[^:])\/\/.*$/gm, "$1")
        .replace(/,\s*([}\]])/g, "$1")
      return JSON.parse(cleaned)
    }
  }

  private parseAbcParams(code: string): any {
    const params: any = { responsive: "resize" }
    const firstLine = String(code ?? "").split("\n")[0] ?? ""
    if (firstLine.startsWith("%%params")) {
      try {
        Object.assign(params, JSON.parse(firstLine.slice("%%params".length).trim()))
      } catch {
        // 参数解析失败时使用默认值，正文仍交给 ABCJS 渲染
      }
    }
    return params
  }

  private async trimPngDataUrl(dataUrl: string, background: string): Promise<string> {
    const doc = this.frameDocument ?? this.hostDocument
    const image = doc.createElement("img")
    await loadImage(image, dataUrl)
    const width = image.naturalWidth
    const height = image.naturalHeight
    if (!width || !height) {
      return dataUrl
    }
    const { canvas, ctx } = this.createCanvas(width, height)
    ctx.drawImage(image, 0, 0)
    const pixels = ctx.getImageData(0, 0, width, height)
    const rgb = this.parseColor(background)
    let left = width
    let top = height
    let right = -1
    let bottom = -1
    const tolerance = 6
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const offset = (y * width + x) * 4
        const alpha = pixels.data[offset + 3]
        if (alpha === 0) {
          continue
        }
        const diff =
          Math.abs(pixels.data[offset] - rgb[0]) +
          Math.abs(pixels.data[offset + 1] - rgb[1]) +
          Math.abs(pixels.data[offset + 2] - rgb[2])
        if (diff <= tolerance) {
          continue
        }
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
    if (right < left || bottom < top) {
      return dataUrl
    }
    const padding = 8
    left = Math.max(0, left - padding)
    top = Math.max(0, top - padding)
    right = Math.min(width - 1, right + padding)
    bottom = Math.min(height - 1, bottom + padding)
    const cropWidth = right - left + 1
    const cropHeight = bottom - top + 1
    const cropped = this.createCanvas(cropWidth, cropHeight)
    cropped.ctx.fillStyle = background
    cropped.ctx.fillRect(0, 0, cropWidth, cropHeight)
    cropped.ctx.drawImage(canvas, left, top, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
    return cropped.canvas.toDataURL("image/png")
  }

  private parseColor(color: string): [number, number, number] {
    if (color.startsWith("#")) {
      const hex = color.slice(1)
      const normalized =
        hex.length === 3
          ? hex
              .split("")
              .map((item) => item + item)
              .join("")
          : hex
      return [
        Number.parseInt(normalized.slice(0, 2), 16),
        Number.parseInt(normalized.slice(2, 4), 16),
        Number.parseInt(normalized.slice(4, 6), 16),
      ]
    }
    return [255, 255, 255]
  }
}

/**
 * 读取思源当前外观和 PlantUML 服务地址。
 */
export const readSiyuanDiagramEnvironment = (): {
  theme: DiagramRenderTheme
  plantUmlServePath?: string
  baseUrl?: string
} => {
  const win = SiyuanDevice.siyuanWindow() as any
  const mode = win?.siyuan?.config?.appearance?.mode
  return {
    theme: mode === 1 ? "dark" : "light",
    plantUmlServePath: win?.siyuan?.config?.editor?.plantUMLServePath,
    baseUrl: win?.location?.origin,
  }
}
