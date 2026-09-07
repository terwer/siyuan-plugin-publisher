# 小红书签名机制研究报告

> 研究日期：2026-03-31
> 状态：暂停开发，待后续继续研究

## 一、研究背景

小红书创作者平台 (`creator.xiaohongshu.com`) 的 API 请求需要携带签名头部信息，否则无法正常调用。本研究旨在破解签名机制，实现插件自动发布功能。

## 二、签名头部分析

### 2.1 关键请求头

| 头部名称 | 格式示例 | 说明 |
|---------|---------|------|
| `x-s` | `XYS_eyJzaWduU3Ry...` | 请求签名，前缀 `XYS_` + Base64 编码数据 |
| `x-s-common` | `XZqakGJhbGci...` (超长字符串) | 通用签名参数，约 500+ 字符 |
| `x-t` | `1743411014000` | 毫秒级时间戳 |
| `x-b3-traceid` | `a1b2c3d4e5f6...` | 追踪 ID，随机生成 |

### 2.2 验证 API

- **接口**: `GET /api/galaxy/user/info`
- **成功响应**: `{result:0, success:true, code:0, data:{userId, userName, ...}}`
- **失败响应**: `{code:-1, msg:"登录已过期", result:-100}`

## 三、签名机制发现

### 3.1 核心签名函数

通过分析 `library-launcher.c81599e1.js` 发现签名逻辑：

```javascript
if (window.shouldSign && window.shouldSign(url)) {
  var signHeaders = window.sign(url, data) || {}
  var commonHeaders = window.f && typeof window.f === 'function' ? window.f() : {}
  request.headers = { ...request.headers, ...signHeaders, ...commonHeaders }
}
```

### 3.2 函数来源

| 函数 | 来源 | 状态 |
|-----|------|------|
| `window.sign(url, data)` | `/api/sec/v1/scripting` 动态加载 | ❌ 需登录后动态获取 |
| `window.f()` | 安全脚本注入 | ❌ 需登录后动态获取 |
| `window.shouldSign(url)` | 安全脚本注入 | ❌ 需登录后动态获取 |

### 3.3 已发现的可调用对象

通过 Puppeteer 测试发现以下对象可用：

| 对象 | 类型 | 方法 | 返回值示例 |
|-----|------|------|-----------|
| `xhsFingerprintV3` | object | `getV18()`, `getCurMiniUa()`, `runMiniUa()`, `r6()` | 设备指纹相关 |
| `mnsv2()` | function | - | `mns0101_OYFeE3BIC2J1SYmNz75CbzaLOad7mDyP...` |

`mnsv2()` 返回值看起来是设备指纹数据，可能是 `x-s-common` 的组成部分之一。

## 四、Puppeteer 全局安装方案

### 4.1 方案说明

由于 Puppeteer 体积过大（约 300MB+），无法打包进插件。采用以下方案：
1. 用户手动全局安装：`npm install -g puppeteer`
2. 插件运行时动态加载：`require('puppeteer')`
3. 未安装时提示用户安装

### 4.2 NODE_PATH 问题

**问题**：全局安装的 npm 包无法被 `require()` 直接找到

**解决方案**：
```javascript
// 设置全局模块路径
process.env.NODE_PATH = process.env.NODE_PATH || '/usr/local/lib/node_modules'
require('module').Module._initPaths()
```

### 4.3 验证结果

- ✅ Puppeteer 全局安装成功
- ✅ NODE_PATH 设置后可正确加载
- ✅ 浏览器可启动并访问小红书
- ❌ `window.sign` 和 `window.f` 未找到（需进一步研究加载触发条件）

## 五、技术难点

### 5.1 鸡生蛋问题

签名函数 (`window.sign`) 需要通过 `/api/sec/v1/scripting` API 获取，但请求这个 API 本身需要签名。

### 5.2 动态脚本加载

签名脚本不是静态存在于页面中，而是在特定条件下动态加载：
1. 用户已登录
2. 页面触发特定请求
3. 安全脚本通过 API 返回并注入

### 5.3 反爬虫机制

小红书可能采用以下反爬策略：
- 设备指纹检测
- 行为分析
- 请求频率限制

## 六、后续研究方向

### 6.1 短期方案

1. **手动登录 + Cookie 复用**
   - 用户手动登录小红书
   - 插件保存完整 Cookie
   - 直接使用 Cookie 请求 API

### 6.2 中期方案

1. **触发签名脚本加载**
   - 研究在 Puppeteer 中如何触发签名脚本加载
   - 可能需要模拟用户操作或特定请求

2. **逆向签名算法**
   - 深入分析 `library-launcher.c81599e1.js`
   - 尝试提取签名算法核心逻辑

### 6.3 长期方案

1. **官方 API**
   - 关注小红书是否开放官方 API
   - 申请开发者权限

## 七、相关文件

| 文件 | 说明 |
|-----|------|
| `src/adaptors/web/xiaohongshu/XiaohongshuWebAdaptor.ts` | 小红书适配器主文件 |
| `src/platforms/pre.ts` | 平台配置（已临时禁用） |
| `tmp/test.js` | Puppeteer 签名测试脚本 |
| `/tmp/xiaohongshu.txt` | 完整抓包数据（用户本地） |
| `/tmp/library-launcher.c81599e1.js` | 签名逻辑 JS 文件（用户本地） |

## 八、结论

小红书签名机制较为复杂，涉及动态脚本加载、设备指纹、多层签名等多个环节。当前研究已初步理清签名流程，但距离完全破解仍有距离。建议采用"持续攻坚"策略，在不影响整体开发进度的情况下，逐步完善签名方案。

---

**暂停原因**：签名破解工作量大，需要更多时间研究，暂时搁置以推进其他功能开发。
