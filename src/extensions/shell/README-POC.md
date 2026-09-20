# 扩展弹窗 V2 POC（vite.ext.config.ts）

> 仅用于压掉「浏览器扩展迁移到 V2」的未知量。**不是**正式扩展产物，也不参与任何发布流程；
> `src/extensions/manifest.json`、`background.js`、`vite.v1.app.config.ts`、`vite.v2.config.ts`
> 等既有文件都没有改动。

## 文件

| 文件 | 作用 |
| --- | --- |
| `popup.html` | 弹窗入口：壳标题栏 + 「连接配置 / V2 主界面」两个挂载点 |
| `main.ts` | 壳启动：`createV2VueApp({ locale, messages, docId, onClose })` 挂 V2 主界面；`createApp(ExtConnectionPanel)` 挂连接配置；顶部按钮切换两者 |
| `ExtConnectionPanel.vue` | 思源 API 地址 + Token 表单，直接读写 `src/stores/useSiyuanSettingStore.ts` |
| `manifest.poc.json` | POC 专用 MV3 manifest（构建时复制为产物里的 `manifest.json`，version 从 `package.json` 注入） |
| `../../vite.ext.config.ts` | 独立构建配置（蓝本：`vite.v2.config.ts`） |

## 构建

```bash
pnpm exec vite build --config vite.ext.config.ts
```

产物在 `extension/poc/`（`extension/` 已在 `.gitignore`）：

```
extension/poc/popup.html                  2.2 kB
extension/poc/manifest.json               0.5 kB
extension/poc/manifest.poc.json           0.5 kB
extension/poc/assets/popup-<hash>.js  11861.5 kB  (gzip 4564.8 kB)
extension/poc/assets/style-<hash>.css   469.5 kB  (gzip   66.6 kB)
extension/poc/assets/icon-<hash>.png      8.5 kB
```

构建配置要点（与 V2 宿主构建对齐）：`nodePolyfills`、`unplugin-icons`、`unplugin-auto-import`、
`unplugin-vue-components` + `ElementPlusResolver`、`~` alias、`define` 注入
`VITE_DEFAULT_TYPE=siyuan` / `APP_BASE=/` / `VITE_SIYUAN_API_URL=http://127.0.0.1:6806` / `DEV_MODE=true`
（同 `vite.v1.app.config.ts` 的扩展口径）。两份 d.ts 生成都关掉（`dts: false`），避免额外产物。

## 装载

**A. 已解压扩展**：`chrome://extensions` → 打开「开发者模式」→「加载已解压的扩展程序」→ 选 `extension/poc` 目录 → 点工具栏图标。

**B. 本地静态服务器**（无需改 manifest，最省事）：

```bash
python -m http.server 8917 --directory extension/poc
# 打开 http://127.0.0.1:8917/popup.html
```

## 本次验证了什么

在真实 Chrome（152.0.7977.83，headless=new，800x600）下打开 `popup.html`：

1. **V2 界面正常渲染**：`#syp-ext-v2 .syp-v2 / .syp-panel` 存在；标题「快速发布」；动作条
   「批量分发 / 文章管理 / 设置 / 关闭」；空文档分支「当前文档 / 未检测到当前文档 / 请先打开一个文档」正常。
2. **设置视图正常**：点「设置」→ 标题「发布设置」，导航 5 项（账号设置 / 图床设置 / 偏好设置 / AI 设置 / 关于），
   账号列表空态与「添加账号」按钮（Element Plus）正常。
3. **连接配置面板可见可保存**：切换按钮可用；两项字段（思源 API 地址 / API Token）默认值
   `http://127.0.0.1:6806`；保存后 `localStorage["siyuan-cfg"]` 内含所填 Token，刷新后 Token 仍在。
4. **控制台**：无 CSP 违规、无模块解析失败、无「Failed to resolve component」、无未捕获异常、无 Vue 警告。
   仅有 3 类非致命输出：`401 Unauthorized`（本机思源内核在 6806 上确实在跑，但没有有效 token）、
   应用自己捕获并 log 的 `[common-storage] ... 401`、以及 `[DOM] Password field is not contained in a form`。

## 本次没有验证

- **没有以真正的扩展身份加载**（`chrome-extension://`）：验证是在 http 页面下做的。
  真实扩展下会变的有：`BrowserUtil.isInChromeExtension()` 为真 → `useSiyuanApi().isUseSiyuanProxy` 变 `false`；
  `DeviceDetection.getDevice()` 返回 `Chrome_Extension`；CSP 来自 manifest 而非页面默认策略；
  `chrome.*` API 可用（弹窗打开平台登录窗口 / 读写 cookie 的链路只能装成扩展再验）。
- 未验证弹窗里走宿主的动作：登录窗口、cookie 读取、图片上传、发布/更新/删除。
- 未验证 MV3 service worker（`background.js`）与 popup 的联动。

## 已知限制（POC 结论，需在完整迁移中处理）

1. **`useSiyuanSettingStore` 会回写 `apiUrl`**：`getSiyuanSetting()` 每次调用都执行
   `siyuanConfig.value.apiUrl = Utils.emptyOrDefault(process.env.VITE_SIYUAN_API_URL, origin)`，
   因此用户填的内核地址在下次读取时被打回构建期默认值（实测：填 `http://127.0.0.1:9999` 保存成功、
   `localStorage` 也是 9999，刷新后字段与落盘值双双变回 6806；Token 不受影响）。
   要做「扩展里能改内核地址」，必须改成「仅当已存值为空时才用默认值」。
2. **`VITE_DEFAULT_TYPE=siyuan`**（沿用 V1 扩展口径）→ 账号/动态配置走思源内核 HTTP 存储；
   内核地址或 token 不对时，账号列表为空、发布动作不可用（本次实测 401）。
   扩展若要走 `localStorage`，需改这个 define，并同步核对 `CommonStorageAsync`。
3. **`docId` 只能传空串**：弹窗里没有宿主 DOM，`WidgetPageUtils.getPageId()` 取不到文档，
   必然走「未检测到文档」分支。扩展要么通过 kernel API 自己列文档/当前文档，要么由用户选文档。
4. **产物偏大**：单 chunk ~12 MB（Element Plus + 全量平台适配器 + 图标数据，无 code splitting）。
5. `DEV_MODE=true` 是为了 POC 观测日志；正式扩展构建应置 `false`。
