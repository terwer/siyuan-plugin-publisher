/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { removeMarkdownHeadingNumbers, removeTitleNumber } from "~/src/utils/titleNumber.ts"

describe("removeTitleNumber", () => {
  it("去掉思源标题块自动编号的十进制形态", () => {
    expect(removeTitleNumber("1 引言")).toBe("引言")
    expect(removeTitleNumber("1.2 实现")).toBe("实现")
    expect(removeTitleNumber("1.2.3 细节")).toBe("细节")
    expect(removeTitleNumber("2. 安装")).toBe("安装")
    expect(removeTitleNumber("3、配置")).toBe("配置")
  })

  it("去掉中文序号形态", () => {
    expect(removeTitleNumber("一、准备工作")).toBe("准备工作")
    expect(removeTitleNumber("（二）验证")).toBe("验证")
    expect(removeTitleNumber("(1) 附录")).toBe("附录")
  })

  it("不误删真实的数字标题", () => {
    expect(removeTitleNumber("2024 年度总结")).toBe("2024 年度总结")
    expect(removeTitleNumber("100 个技巧")).toBe("100 个技巧")
    expect(removeTitleNumber("Python 入门")).toBe("Python 入门")
  })

  it("标题只由编号构成时保持原样", () => {
    expect(removeTitleNumber("1.")).toBe("1.")
    expect(removeTitleNumber("")).toBe("")
  })
})

describe("removeMarkdownHeadingNumbers", () => {
  it("去掉各级标题开头的编号，保留标题层级", () => {
    const md = ["## 1.1 安装", "### 1.1.1 依赖"].join("\n")
    expect(removeMarkdownHeadingNumbers(md)).toBe(["## 安装", "### 依赖"].join("\n"))
  })

  it("不处理代码块里的井号行", () => {
    const md = ["```bash", "# 1.1 注释不是标题", "```", "## 1.1 真标题"].join("\n")
    expect(removeMarkdownHeadingNumbers(md)).toBe(["```bash", "# 1.1 注释不是标题", "```", "## 真标题"].join("\n"))
  })

  it("没有编号的标题不受影响", () => {
    const md = ["# 开始", "## 2024 年度总结"].join("\n")
    expect(removeMarkdownHeadingNumbers(md)).toBe(md)
  })
})
