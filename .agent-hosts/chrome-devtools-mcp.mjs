#!/usr/bin/env node
// chrome-devtools MCP 启动器（跨平台：Windows / macOS / Linux / WSL）
//
//   node .agent-hosts/chrome-devtools-mcp.mjs           按 hosts.env 解析地址并启动 MCP
//   node .agent-hosts/chrome-devtools-mcp.mjs --print   只打印解析结果
//   node .agent-hosts/chrome-devtools-mcp.mjs --probe   探活 /json/version
//   node .agent-hosts/chrome-devtools-mcp.mjs --config  打印配置文件路径
//
// 客户端配置只需 `{"command":"node","args":[".agent-hosts/chrome-devtools-mcp.mjs"]}`，
// 不含端口、不含绝对路径、不依赖 pwsh/bash。
// 端口唯一来源：与本脚本同目录的 hosts.env。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CONF_FILE = process.env.HOST_CDP_ENV || path.join(HERE, 'hosts.env');

function parseEnvFile(file) {
  const out = {};
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return out;
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i < 1) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

function isWsl() {
  if (process.platform !== 'linux') return false;
  try {
    return /microsoft/i.test(fs.readFileSync('/proc/version', 'utf8'));
  } catch {
    return /microsoft/i.test(os.release());
  }
}

// WSL2 访问 Windows 宿主：默认网关就是宿主地址。
// 直接读 /proc/net/route（不调用外部命令，因此不依赖任何 shell），
// 解析失败时退回 /etc/resolv.conf 的 nameserver。
function wslHostAddress() {
  try {
    const rows = fs.readFileSync('/proc/net/route', 'utf8').split('\n').slice(1);
    for (const row of rows) {
      const cols = row.trim().split(/\s+/);
      if (cols.length < 3 || cols[1] !== '00000000') continue; // 默认路由
      const bytes = (cols[2].match(/../g) || []).reverse().map((b) => parseInt(b, 16));
      if (bytes.length === 4 && bytes.some((b) => b !== 0) && !bytes.includes(NaN)) {
        return bytes.join('.');
      }
    }
  } catch {
    /* ignore */
  }
  try {
    const m = fs.readFileSync('/etc/resolv.conf', 'utf8').match(/^\s*nameserver\s+(\S+)/m);
    if (m) return m[1];
  } catch {
    /* ignore */
  }
  return null;
}

function resolveCdpUrl() {
  const conf = parseEnvFile(CONF_FILE);
  if (conf.HOST_CDP_URL) return conf.HOST_CDP_URL;

  const port = conf.HOST_CDP_PORT;
  if (!port) throw new Error(`缺少 HOST_CDP_PORT，检查配置：${CONF_FILE}`);
  const relay = conf.HOST_CDP_RELAY_PORT || port;

  if (isWsl()) {
    const host = wslHostAddress();
    if (host) return `http://${host}:${relay}`;
  }
  return `http://127.0.0.1:${port}`;
}

const argv = process.argv.slice(2);
if (argv.includes('--config')) {
  console.log(CONF_FILE);
  process.exit(0);
}

let url;
try {
  url = resolveCdpUrl();
} catch (err) {
  console.error(`无法解析调试地址：${err.message}`);
  process.exit(1);
}

if (argv.includes('--print')) {
  console.log('config      :', CONF_FILE);
  console.log('platform    :', `${process.platform}${isWsl() ? ' (wsl)' : ''}`);
  console.log('browser-url :', url);
  process.exit(0);
}

if (argv.includes('--probe')) {
  try {
    const res = await fetch(`${url}/json/version`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log(`${url}  OK`);
    console.log(JSON.stringify(await res.json()));
    process.exit(0);
  } catch (err) {
    console.log(`${url}  UNREACHABLE (${err.message})`);
    console.log(`检查：目标 Electron 应用是否在运行；hosts.env 的 HOST_CDP_PORT / HOST_CDP_RELAY_PORT`);
    process.exit(1);
  }
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['-y', 'chrome-devtools-mcp@latest', '--allow-unrestricted-paths', `--browser-url=${url}`];

const child = spawn(npx, args, { stdio: 'inherit', env: process.env });
child.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
child.on('error', (err) => {
  console.error(`启动 chrome-devtools-mcp 失败：${err.message}`);
  process.exit(1);
});
