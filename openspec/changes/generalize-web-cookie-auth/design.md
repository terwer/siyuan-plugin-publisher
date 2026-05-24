## Context

V2 平台配置桥接目前通过复用旧设置组件来降低迁移成本：`V2PlatformConfigBridge` 挂载各平台 Setting 组件，`CommonBlogSetting` 在 Cookie 字段附近暴露 `cookie-actions` slot，`V2WebCookieAuthPanel` 通过 `useWebCookieAuthorization` 完成自动读取、metadata 校验和状态写回。

这套能力本应属于所有网页 Cookie 平台，但实际接入历史上先围绕语雀网页版、Halo 网页版展开；新增 CSDN、知乎等平台进入 V2 selector 后，如果 setting 组件没有统一转发 `cookie-actions` slot，V2 就只能显示普通 Cookie 文本框，无法使用自动读取/校验/退出的共用体验。问题的根因不是 CSDN 需要重写授权，而是横向能力接入维度错误。

必须遵守既有架构边界：配置校验走 `BlogAdaptor` / `api.checkAuth()`；网页 Cookie 自动授权走 `useWebCookieAuthorization` + WebAdaptor；传输链路不在本变更调整；禁止在 `useProxy` 或各平台适配器堆 V2 UI 分支。

## Goals / Non-Goals

**Goals:**

- 所有已启用 `pre.customCfg` 网页 Cookie 平台在 V2 Bridge 配置页都能看到同一个 Cookie 授权操作区。
- CSDN、知乎等非语雀平台复用 `useWebCookieAuthorization`，通过现有 WebAdaptor 的 `buildCookie()`、`getMetaData()`、`updateCfg()` 完成授权校验。
- 将 slot 转发、是否展示、自动读取支持、手动编辑 fallback、退出/清除授权都定义为平台无关的共用行为。
- 用自动化测试锁住“所有 enabled custom web preset 都接入共用 Cookie 授权面板”，防止以后新增平台漏接。

**Non-Goals:**

- 不重写 CSDN、知乎、语雀网页版发布适配器。
- 不改变 JSON/multipart/XML-RPC 发布传输 facade。
- 不改变历史配置 JSON 字段和 platform key。
- 不把尚未启用的 Flowus、小红书等注释 preset 强行放出。
- 不保证各平台真实远端登录/发布一定成功；本变更保证 V2 共用授权入口、校验路径和状态写回一致。

## Decisions

### Decision 1: Cookie 授权操作区挂在 `CommonBlogSetting` 的 Cookie 字段 slot，而不是单个平台组件

- 方案：保留 `CommonBlogSetting` 的 `cookie-actions` slot 作为唯一注入点，所有 Web Setting 组件只负责把该 slot 原样透传给 `CustomWebSetting` / `CommonBlogSetting`。
- 理由：`CommonBlogSetting` 已经掌握 `cfg`、`dynCfg`、`setting`、`dynamicConfigArray`、手动编辑展开状态，是最接近配置状态且最平台无关的位置。
- 替代方案：在每个平台 Setting 组件中直接渲染 `V2WebCookieAuthPanel`。拒绝，因会重复 UI/状态逻辑，并导致 CSDN/知乎各打一套补丁。

### Decision 2: Web 平台可用性由共用判定决定

- 方案：`V2WebCookieAuthPanel` 继续以 `dynCfg.authMode === AuthMode.WEBSITE` 且 `cfg.passwordType === PasswordType.PasswordType_Cookie` 判定是否展示。
- 理由：这是平台能力契约，优于按 subtype 判断；CSDN、知乎、语雀、Halo、Bilibili 等都可由同一条件覆盖。
- 替代方案：维护 `Custom_Yuqueweb | Custom_CSDN | Custom_Zhihu...` 白名单。拒绝，因新增平台会再次漏接。

### Decision 3: 平台差异留在配置和 WebAdaptor 内部

- 方案：`authUrl`、`logoutUrl`、domain、Cookie 构造、metadata 校验仍由 `pre.customCfg`、平台 Config、平台 WebAdaptor 提供；V2 面板只调用共用 composable。
- 理由：不同平台确有 Cookie 名、metadata 接口和退出机制差异，但这些是适配器契约，不应泄漏到 V2 UI。
- 替代方案：在 `V2WebCookieAuthPanel` 中为 CSDN/知乎特殊处理。拒绝，会破坏高内聚和低耦合。

### Decision 4: 自动化覆盖以“所有 enabled custom web preset”为主断言

- 方案：测试不只断言 CSDN/知乎，还断言 `pre.customCfg` 中所有启用 custom web preset 进入 V2 Bridge 后都有组件映射和 Cookie slot 转发。
- 理由：用户当前问题源于维度错误；只补 CSDN/知乎无法防止下一平台再次漏接。
- 替代方案：只为 CSDN/知乎加快照。拒绝，覆盖范围不足。

## Risks / Trade-offs

- [Risk] 某些 Web Setting 组件未导入/透传 `CustomWebSetting`，放入 V2 后会运行时渲染失败。→ Mitigation：补组件级测试或 mount smoke，覆盖所有 enabled custom web setting。
- [Risk] 某平台 `getMetaData()` 语义不稳定，自动读取 Cookie 后校验失败。→ Mitigation：共用流程保留 Cookie 可编辑但不写 `isAuth=true`，并要求平台适配器测试覆盖 metadata 成功/失败。
- [Risk] 退出能力各平台差异大。→ Mitigation：统一 logout composable 中只按能力探测 fallback；V2 UI 不做平台分支；语雀真实退出仍保留现有专门适配器能力。
- [Risk] 非 Electron 环境无法自动读取 Cookie。→ Mitigation：共用面板按环境展示手动路径，保持旧文本框可编辑。
- [Risk] 当前工作区已有其他未提交改动。→ Mitigation：实施时只触碰本 OpenSpec 列出的文件，提交前用 `git diff` 精确审计。

## Migration Plan

1. 审计所有 `pre.customCfg` 已启用 Web Setting 组件的 slot 透传情况。
2. 把缺失透传的组件改为与语雀/Halo 网页版一致：接收 `cookie-actions` slot 并原样转发。
3. 如果发现组件缺少必要 import 或异步 setup 问题，做最小修复使其可在 V2 Bridge 中挂载。
4. 补自动化测试：
   - V2 selector/registry 覆盖所有 custom web preset；
   - V2 bridge 对 CSDN、知乎、语雀网页版均能渲染 `V2WebCookieAuthPanel`；
   - `useWebCookieAuthorization` 对非语雀平台不走语雀专属路径。
5. 运行聚焦测试、`pnpm lint`、`pnpm build:v2`。
6. V2 宿主手验优先 CSDN、知乎、语雀网页版：配置页可见 Cookie 操作区、手动编辑可展开、自动读取入口按环境展示、校验失败详情脱敏。

## Open Questions

- 是否本批次也要求真实远端账号完成 CSDN/知乎 metadata 校验通过？如果没有可用账号，本变更先以自动化和宿主 UI smoke 证明共用入口连通，真实账号验证记录为待验。
- Bilibili 当前 Setting 组件是否存在缺失 `CustomWebSetting` import 的编译/运行问题；若存在，应作为本变更必要修复，因为它属于 enabled custom web preset。
