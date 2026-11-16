# Firefox 扩展产物缺 manifest

> 建立日期：2026-09-24
> 状态：**待修** —— 计划在 **2.0.1** 处理
> 阻塞关系：**不阻塞 2.0.0 发布**（用户决定：先发 2.0.0）

## 一句话

`pnpm package` 产出的 `build/sy-post-publisher-firefox-*.zip` **不含 `manifest.json`**，
Firefox 无法安装该扩展。

## 现象与影响

| 产物 | manifest | 状态 |
|---|---|---|
| `sy-post-publisher-chrome-*.zip` | ✓ 有 | 正常 |
| `sy-post-publisher-firefox-*.zip` | ✗ **缺失** | 无法安装 |
| 挂件 / nginx / vercel | — | 正常 |
| 插件本体（思源内使用） | — | 正常 |

**影响面**：仅 Firefox 扩展产物。思源本体（99% 用户）不受影响。

## 性质：既有问题

**1.41.1 的 Firefox 包同样缺 manifest**，不是 2.0.0 引入的回归。

## 根因

两个文件协作出顺序缺陷：

```
scripts/ext_build.py
  121 行  cp_folder("./src/extensions", dist_folder)    # 复制 src/extensions（含 mv2/）
  131 行  vite build --outDir extension/firefox         # emptyOutDir: true → 清空该目录
  144 行  do_firefox_package(dist_folder)               # 想 mv mv2/manifest-v2-for-firefox.json
                                                        # → 文件已被清掉，静默失败（无报错）
```

```
vite.webapp.config.ts
   95 行  source = "src/extensions/manifest.json"       # 这是 MV3 格式
  104 行  writeFileSync(outDir + "/manifest.json")      # 不区分 chromium / firefox
```

**核心**：vite 不知道自己在为哪个浏览器构建 manifest，一律写 MV3；
而脚本原本靠 `mv2/` 目录替换成 MV2 的路子，被 `emptyOutDir` 清掉了。
失败是**静默的**——脚本没报错，所以一直没被发现。

## 修复策略

### 方案 A（推荐）：让构建期就知道目标浏览器

`vite.webapp.config.ts` 的 `copyExtensionAssets` 插件中，当 `EXT_TYPE=firefox` 时：

- 改读 `src/extensions/mv2/manifest-v2-for-firefox.json`
- 按 MV2 规则处理（`manifest_version: 2`、`browser_action` 等）

**为什么推荐**：消除了「构建产物与目标浏览器不一致」这个根因，
而不是在脚本里补时机。`EXT_TYPE` 本来就已经通过环境变量传入，插件可直接读取。

### 方案 B（备选）：调整脚本顺序

把 `mv2/` 的拷贝挪到 vite 构建**之后**（改 `ext_build.py`）。

**为什么不首选**：仍保留「vite 先写错 manifest、脚本再覆盖」的双写路径，
下次改动容易再次踩到同类的顺序问题。

### 附带的健壮性改进

无论选哪个方案，都建议：

1. 移除 `ext_build.py` 里对 `mv2/` 的依赖（该目录拷贝已被 `emptyOutDir` 清掉，是死代码）
2. 打包后**校验 zip 内存在 `manifest.json`**，缺失即失败退出——
   避免同类问题再次静默通过

## 验收标准

1. `pnpm extBuild -t firefox` 产出的 zip 含 `manifest.json`
2. 该 manifest 的 `manifest_version` 为 `2`
3. `pnpm package` 后，Firefox 包与 Chrome 包各自带**正确版本**的 manifest
4. 在 Firefox 中实际加载该扩展成功

## 关键文件

| 文件 | 作用 |
|---|---|
| `scripts/ext_build.py` | 扩展构建与打包入口 |
| `vite.webapp.config.ts` | 通用壳构建；写 manifest 的插件在此 |
| `src/extensions/manifest.json` | MV3（chromium 用） |
| `src/extensions/mv2/manifest-v2-for-firefox.json` | MV2（firefox 用） |
| `.github/workflows/release-please.yml` | 发版流程 |

## 发现经过

2.0.0 发版前的**本地预演**：逐条执行 `release-please.yml` 里的实际命令
（`pnpm install` → `pnpm prepareRelease` → `pnpm package` → 上传用的 `find` 逻辑），
并对产物做内容校验时发现。