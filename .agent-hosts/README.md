# .agent-hosts —— 宿主 Electron 调试地址（项目级、跨平台）

本目录是本仓库内**唯一**定义"宿主 Electron 调试地址"的地方。全部相对仓库根：不写用户级目录、不写全局配置、不写绝对路径、不写死端口。

适配 **Windows / macOS / Linux / WSL** 四种开发环境，同一份配置、同一个启动器。

## 文件

| 文件 | 作用 |
|---|---|
| `hosts.env` | 单点配置：`HOST_CDP_PORT`、`HOST_CDP_RELAY_PORT`、可选 `HOST_CDP_URL` |
| `chrome-devtools-mcp.mjs` | 跨平台启动器：解析 `hosts.env` → 启动 `chrome-devtools-mcp`；自带 `--print` / `--probe` / `--config` |

用 Node.js（MCP 客户端本来就需要 Node）实现，不依赖 pwsh、bash 或任何 shell，因此三端行为一致。
脚本用 `import.meta.url` 定位自身目录，从任意工作目录调用都能找到 `hosts.env`。

## 地址怎么定出来

1. `HOST_CDP_URL` 有值 → 直接用。
2. WSL（`/proc/version` 含 microsoft）→ `http://<WSL 宿主地址>:<HOST_CDP_RELAY_PORT>`，宿主地址取 `/etc/resolv.conf` 的 `nameserver`，不调用外部命令。
3. 其他（Windows / macOS / Linux 桌面）→ `http://127.0.0.1:<HOST_CDP_PORT>`。

## 各客户端如何引用（全部相对仓库根）

前提：客户端以仓库根为工作目录启动。

**DSH** —— `.dsh/mcp.json`
```json
"chrome-devtools": { "command": "node", "args": [".agent-hosts/chrome-devtools-mcp.mjs"] }
```

**Claude Code** —— 项目根 `.mcp.json`，内容同上；首次使用需在会话里批准本项目的 MCP。

**Codex** —— `.codex/config.toml`
```toml
[mcp_servers.chrome-devtools]
command = "node"
args = [".agent-hosts/chrome-devtools-mcp.mjs"]
```

## 自查

```bash
node .agent-hosts/chrome-devtools-mcp.mjs --config   # 读的是哪份配置
node .agent-hosts/chrome-devtools-mcp.mjs --print    # 平台 + 解析出的地址
node .agent-hosts/chrome-devtools-mcp.mjs --probe    # 探活 /json/version
```

## 换端口 / 换机器

只改 `hosts.env`，三端同时生效；已连接的 MCP 客户端需重连。换机器、换路径都不用改配置。

## 不要在客户端侧监听同名端口

WSL/容器里监听该调试端口会触发 localhost 转发抢占，宿主应用反而绑不上——表现为"应用启动成功但 CDP 不通"。跨系统访问只走宿主侧 `netsh interface portproxy`。
