---
name: chrome-devtools-electron-attach
description: 把 Chrome DevTools MCP 附加到已运行的 Electron 应用（思源、VS Code、其他桌面端），在其真实渲染进程里核验界面与插件行为。适用于附加模式、宿主验证、本体验证、桌面端调试、Electron 注入；调试地址由项目内单点配置在运行时解析，不预设端口，跨 Windows / macOS / Linux / WSL。
---

# Electron 附加模式：注入已运行的桌面端

复用已经在运行的 Electron 应用，不另开浏览器。这是 Chrome DevTools 协议对 Electron 渲染进程的通用用法，不绑定某一款应用，也不绑定某个客户端或某个操作系统。

## 地址与配置：仓库内单点真理

调试地址是运行时事实，不是常量——端口、网关、转发都可能变。任何脚本、客户端配置、文档都不得写死，也不得写绝对路径。

**唯一事实来源**：仓库内 `.agent-hosts/hosts.env`（只属于本仓库，不写用户级目录、不写全局配置）
- 键：`HOST_CDP_PORT`（应用本机调试端口）、`HOST_CDP_RELAY_PORT`（Windows portproxy 转发端口）、`HOST_CDP_URL`（可选显式地址）

**唯一启动器**：`.agent-hosts/chrome-devtools-mcp.mjs`（Node，跨平台，不依赖 pwsh/bash）
- 自行判定平台：WSL 走宿主地址 + 转发端口，Windows/macOS/Linux 直连 `127.0.0.1`

**客户端只写一行引用，不含端口、不含绝对路径**：

| 客户端 | 项目内配置 | MCP 命令 |
|---|---|---|
| DSH | `.dsh/mcp.json` | `node .agent-hosts/chrome-devtools-mcp.mjs` |
| Claude Code | 项目根 `.mcp.json` | 同上 |
| Codex | `.codex/config.toml` 的 `[mcp_servers.chrome-devtools]` | 同上 |

只读查询（任何平台同一条命令）：
- `node .agent-hosts/chrome-devtools-mcp.mjs --print` — 平台 + 解析出的地址
- `node .agent-hosts/chrome-devtools-mcp.mjs --probe` — 探活 `/json/version`
- `node .agent-hosts/chrome-devtools-mcp.mjs --config` — 实际读的配置文件

改端口只改 `hosts.env`，三端同时跟着变；已在运行的 MCP 客户端要重连才读新值。

## 附加步骤

1. 调用客户端的 `list_pages` 看当前连接；再用 `--probe` 只读检查目标 `/json/version`、`/json/list`。
2. 确认目标是用户指定的那个实例（同名应用常开多份）。不可达时先查应用是否在运行、转发是否还在；需要重启应用时先确认，不关闭未知实例。
3. 要换地址就改 `hosts.env`，或临时给启动器传显式地址；不把具体地址写进技能、脚本或会话记录。
4. 保留原服务器名称、启动命令、包版本与权限策略，只调整连接方式。
5. 通过客户端重载/重连该 MCP 服务器。需要重开会话时说明并等待；不擅自重启 IDE、网关或目标应用。
6. 再次调用 `list_pages`，确认页面与目标一致；随后只读取得应用版本与实际工作空间/窗口身份。

## 端口占用：别在客户端侧监听

- WSL/容器侧不要监听同一个调试端口。监听会触发 localhost 转发抢占，宿主应用反而绑不上——表现为"应用启动成功但 CDP 不通"。
- 跨系统访问走宿主侧转发（Windows `netsh interface portproxy`）或直连宿主地址，绝不在客户端伪造同名端口。

## 验证边界

- 只在用户指定的实例与工作空间内验证。写入、安装插件前核验实际路径/身份，不只看窗口标题或端口。
- 插件安装、样本与清理限定在本轮获准范围；目标不符时停止，不切换到其他实例。
- 用 `take_snapshot`、`evaluate_script` 操作已有页面。Electron 常不支持创建新页，不以 `new_page` 失败作为模式验证结论。

## 完成条件

MCP 自身已列出目标页面，且实际实例身份核验通过，才算附加完成。仅端口可达、配置已写入或独立脚本连通，都不代表当前 MCP 已切换。

需要独立浏览器做网页探索时，使用 [探索模式](../chrome-devtools-explore-mode/SKILL.md)。
