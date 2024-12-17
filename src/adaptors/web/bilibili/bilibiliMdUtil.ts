/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2024 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PublisherLuteInstance } from "~/src/publisherLuteInstance.ts"
import { JsonUtil } from "zhi-common"
import { createAppLogger } from "~/src/utils/appLogger.ts"

interface Node {
  Type: string
  HeadingLevel?: number
  Data?: string
  Children?: Node[]
  ListData?: {
    Tight: boolean
    BulletChar: number
    Padding: number
    Marker: string
    Num: number
  }
}

interface Op {
  insert: string
  attributes?: Record<string, any>
}

interface Paragraph {
  para_type: number
  text: {
    nodes: ContentNode[]
  }
}

interface ContentNode {
  node_type: number
  word: {
    words: string
    font_size: number
    font_level: string
    style?: {
      bold?: boolean
    }
  }
}

/**
 * B站解析器
 */
class BilibiliMdUtil {
  private static readonly logger = createAppLogger("bilibili-md-util")

  /**
   * 从 Markdown 转换为 Bilibili 节点格式
   */
  public static md2bilbiliNodes(md: string) {
    const { lute, Lute } = PublisherLuteInstance.getInstance()
    this.logger.debug("lute instance=>", lute)

    const luteJson = JsonUtil.safeParse<Node>(lute.RenderJSON(md), {} as Node)
    this.logger.debug("lute json=>", JSON.stringify(luteJson))

    // 初始化 ops 和 content
    const ops: Op[] = []
    const paragraphs: Paragraph[] = []

    // 递归处理节点并更新 ops 和 content
    this.processNode(luteJson, ops, paragraphs)

    // 返回包含 ops 和 content 的结果
    return { ops, content: { paragraphs } }
  }

  //================================================================
  // private function
  //================================================================

  /**
   * 递归处理节点，更新 ops 和 content
   */
  private static processNode(node: Node, ops: Op[], paragraphs: Paragraph[]): void {
    const { Type, Children = [] } = node

    switch (Type) {
      // 混合节点
      case "NodeDocument":
        this.processDocumentNode(node, ops, paragraphs)
        break
      case "NodeParagraph":
        this.processParagraphNode(node, ops, paragraphs)
        break
      // 列表节点
      case "NodeList":
        this.processListNode(node, ops, paragraphs)
        break
      case "NodeListItem":
        this.processListItemNode(node, ops, paragraphs)
        break
      // 单一节点
      case "NodeHeading":
        this.processHeadingNode(node, ops, paragraphs)
        break
      case "NodeText":
        this.processTextNode(node, ops, paragraphs)
        break
      case "NodeStrong":
        this.processStrongNode(node, ops, paragraphs) // 处理加粗
        break
      default:
        Children.forEach((child) => this.processNode(child, ops, paragraphs))
    }
  }

  /**
   * 处理文档节点
   */
  private static processDocumentNode(node: Node, ops: Op[], paragraphs: Paragraph[]): void {
    node.Children?.forEach((child) => this.processNode(child, ops, paragraphs))
  }

  /**
   * 处理标题节点
   */
  private static processHeadingNode(node: Node, ops: Op[], paragraphs: Paragraph[]): void {
    const level = Math.min(node.HeadingLevel || 2, 2)
    const text = node.Children?.map((child) => (child.Type === "NodeText" ? child.Data || "" : "")).join("") || ""

    // 添加标题文本到 ops
    ops.push({ insert: text })
    ops.push({ attributes: { header: level }, insert: "\n" })

    // 将标题转换为 content
    const paragraph: Paragraph = {
      para_type: 1,
      text: {
        nodes: [
          {
            node_type: 1,
            word: {
              words: text,
              font_size: level > 1 ? 22 : 24,
              font_level: level > 1 ? "xLarge" : "xxLarge",
              style: { bold: true },
            },
          },
        ],
      },
    }
    paragraphs.push(paragraph)
  }

  /**
   * 处理列表节点
   */
  private static processListNode(node: Node, ops: Op[], paragraphs: Paragraph[]): void {
    node.Children?.forEach((child) => this.processNode(child, ops, paragraphs)) // 递归处理列表项
  }

  /**
   * 处理列表项节点
   */
  private static processListItemNode(node: Node, ops: Op[], paragraphs: Paragraph[]): void {
    const text =
      node.Children?.map((child) => {
        if (child.Type === "NodeParagraph") {
          return child.Children?.map((grandchild) =>
            grandchild.Type === "NodeText" ? grandchild.Data || "" : ""
          ).join("")
        }
        return ""
      }).join("") || ""

    ops.push({ insert: `${text}\n` })

    // 将列表项转换为 content
    const paragraph: Paragraph = {
      para_type: 1,
      text: {
        nodes: [
          {
            node_type: 1,
            word: {
              words: text,
              font_size: 24,
              font_level: "xxLarge",
              style: { bold: true },
            },
          },
        ],
      },
    }
    paragraphs.push(paragraph)
  }

  /**
   * 处理段落节点
   */
  private static processParagraphNode(node: Node, ops: Op[], paragraphs: Paragraph[]): void {
    const paragraphChildNodes: Paragraph[] = []

    // 递归处理段落中的所有子节点
    node.Children?.forEach((child) => {
      this.processNode(child, ops, paragraphChildNodes)
    })

    // 将处理后的段落数据加入 content 格式
    const paragraph: Paragraph = {
      para_type: 1,
      text: {
        nodes: [],
      },
    }
    // 将 `paragraphChildNodes` 中的所有节点推送到 `nodes` 中
    paragraphChildNodes.forEach((node) => {
      paragraph.text.nodes.push(...node.text.nodes)
    })

    paragraphs.push(paragraph)
  }

  /**
   * 处理文本节点
   */
  private static processTextNode(node: Node, ops: Op[], paragraphs: Paragraph[]): void {
    const text = node.Data || ""
    ops.push({ insert: text })

    // 处理文本内容转化为 content（如果有样式需要调整可修改）
    const paragraph: Paragraph = {
      para_type: 1,
      text: {
        nodes: [
          {
            node_type: 1,
            word: {
              words: text,
              font_size: 17,
              font_level: "regular",
              style: {},
            },
          },
        ],
      },
    }
    paragraphs.push(paragraph)
  }

  /**
   * 处理加粗节点（NodeStrong）
   */
  private static processStrongNode(node: Node, ops: Op[], paragraphs: Paragraph[]): void {
    // 解析加粗的文本内容
    const strongText =
      node.Children?.map((child) => {
        if (child.Type === "NodeText") {
          return child.Data || ""
        }
        return ""
      }).join("") || ""

    // 加入加粗文本到 ops
    ops.push({ insert: strongText, attributes: { bold: true } })

    // 将加粗内容转换为 content
    const paragraph: Paragraph = {
      para_type: 1,
      text: {
        nodes: [
          {
            node_type: 1,
            word: {
              words: strongText,
              font_size: 17,
              font_level: "regular",
              style: { bold: true },
            },
          },
        ],
      },
    }
    paragraphs.push(paragraph)
  }
}

export { BilibiliMdUtil }
