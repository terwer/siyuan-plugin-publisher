
# Findings: CSDN / 知乎图片回归调查

## 初始证据

- 用户最新证据指出：CSDN 与知乎图片都出现回归，而博客园、语雀网页版图片仍正常。
- 用户怀疑回归与之前的 eval / crypto 相关修复有关，且这次问题可能不是单个平台专属，而是共用图片算法或替换链路被破坏。
- `main` 分支保留原始未重构代码，可作为评判基线；当前开发分支是 `feature/ui-2.0`。

## 取证目标

- 用 CSDN、知乎官方编辑器的 DevTools 页面对照插件发布请求。
- 重点抓：请求 URL、method、headers、请求体字段、响应结构、编辑器最终插入的图片 URL。
- 再对照插件端的图片发现/上传/替换链路，判断回归点。

## 当前假设

- 更像是共用图片管线回归，而不是单一平台上传接口自己坏掉。
- 优先怀疑：图片发现、替换映射、上传返回 URL 解析、或与 eval / crypto 修复相关的共用工具逻辑。

## 关键澄清

- 用户明确指出：评判基线不是当前 `main` 的“现状”，而是 **eval 修复之前、CSDN / 知乎图片仍可用的那版老代码**。
- `feature/ui-2.0` 中的大量重构，尤其是 eval / crypto 相关修改，才是当前回归嫌疑。
- 因此后续取证必须以”老代码可用，feature/ui-2.0 之后失效”为前提，不能把当前 `main` 的状态误当作基线。

## 阶段 1 代码 Diff 分析结果

### 变更 1：知乎 MD5 哈希计算方式改变（高风险）

**文件**: `src/adaptors/web/zhihu/zhihuWebAdaptor.ts`

旧代码：
```ts
const bits = arrayToBuffer(ab)  // ArrayBuffer → Node Buffer
const hash = CryptoJS.MD5(bits.toString(“utf8”)).toString()
```
新代码：
```ts
const bits = new Uint8Array(ab)
const hash = md5Hex(bits)  // SparkMD5.ArrayBuffer.hash(bytes.buffer)
```

**问题**：旧代码对二进制数据做 `toString(“utf8”)` 再 MD5——语义上错误（二进制非合法 UTF-8），但知乎服务端已接受这种哈希。新代码对原始字节做 MD5，哈希值**必然不同**。知乎用 `image_hash` 去重，哈希不匹配可能导致上传流程异常。

**结论**：知乎图片回归的**最可能原因**。

### 变更 2：CSDN 签名从 CryptoJS 改为 Web Crypto API（中风险）

**文件**: `src/adaptors/web/csdn/csdnUtils.ts`

旧代码用 `CryptoJS.Utf8.parse(secret)` + `CryptoJS.HmacSHA256`；新代码用 `TextEncoder.encode(secret)` + `crypto.subtle.sign`。理论上 UTF-8 编码一致，但需要单测验证。

### 变更 3：传输层重构 formUploadClient（中风险）

新逻辑优先走 `plugin-node-fetch`（只要 `win.require` 可用）。在思源桌面端行为应与旧代码一致。但浏览器扩展环境可能有差异。

### 变更 4：图片替换正则（低风险）

从 `\b${key}\b` 改为 `ImageUtils.escapeRegExp(key)`，不太可能导致”图片不显示”。

### 变更 5：错误处理改为逐图 try/catch（无风险）

改进，不会导致回归。

## 阶段 2 DevTools 取证结果

### CSDN 官方编辑器图片上传流程（2026-05-24 取证）

**两步流程：**

1. **获取签名** `POST https://bizapi.csdn.net/resource-api/v1/image/direct/upload/signature`
   - 请求头：`x-ca-key: 260196572`（= 插件的 `X_CA_KEY_MEDIA`）
   - 请求头：`x-ca-signature-headers: x-ca-key,x-ca-nonce,x-ca-timestamp`
   - 请求头：`x-ca-signature: YyeRkiPBQYPL0HwES8gq1bqjqmzrMLyOWq0BWvX8sb4=`（HMAC-SHA256 Base64）
   - 请求体：`{"imageTemplate":"standard","appName":"direct_blog_markdown","imageSuffix":"png"}`
   - 响应：返回华为云 OBS 上传凭证（policy、signature、filePath、host、callbackUrl 等）

2. **上传到华为云 OBS** `POST https://csdn-img-blog.obs.cn-north-4.myhuaweicloud.com/`
   - multipart/form-data，字段：key、policy、signature、callbackBody、callbackBodyType、callbackUrl、AccessKeyId、x:rtype、x:watermark、x:templateName、x:filePath、x:isAudit、x:x-image-app、x:type、x:x-image-suffix、x:username、file
   - 响应：`{"code":200,"data":{"imageUrl":"https://i-blog.csdnimg.cn/direct/xxx.png",...}}`

**对比插件代码**：`csdnWebAdaptor.ts:csdnUploadImage2025` 的实现与官方编辑器完全一致（相同的 URL、相同的签名头格式、相同的 FormData 字段顺序）。

### 知乎官方编辑器图片上传流程（2026-05-24 取证）

**四步流程：**

1. **创建图片记录** `POST https://api.zhihu.com/images`
   - 请求头：`content-type: application/json`，Cookie 认证
   - 请求体：`{"image_hash":"8a43bc19ac016880a6ea412d9ef29ef6","source":"article"}`
   - 响应：返回 `upload_token`（阿里云 OSS STS 凭证）、`upload_file.object_key`、`upload_file.state`

2. **上传到阿里云 OSS** `PUT https://zhihu-pics-upload.zhimg.com/v2-{hash}`
   - 请求头：`authorization: OSS {access_id}:{signature}`、`x-oss-security-token`、`content-type: image/png`
   - 请求体：图片原始二进制
   - 响应 ETag：`"8A43BC19AC016880A6EA412D9EF29EF6"`（= image_hash 大写）

3. **标记上传完成** `PUT https://api.zhihu.com/images/{image_id}/uploading_status`
4. **获取图片信息** `GET https://api.zhihu.com/images/{image_id}`

**关键验证**：测试图片（79 字节 PNG）的 Python `hashlib.md5(data).hexdigest()` = `8a43bc19ac016880a6ea412d9ef29ef6`，与官方编辑器发送的 `image_hash` 完全一致，也与 OSS 返回的 ETag 一致。

**结论**：知乎的 `image_hash` 就是图片原始二进制字节的 MD5 hex。

### P0 假设修正

**原假设**：新代码 `md5Hex(bits)` 产生的哈希与旧代码不同，导致知乎回归。

**DevTools 证据**：新代码 `md5Hex(new Uint8Array(ab))` 产生的 MD5 与知乎官方编辑器**完全一致**。旧代码 `CryptoJS.MD5(buffer.toString("utf8"))` 反而是错误的（对二进制做 UTF-8 解码再 MD5，会产生不同的哈希值）。

**修正后的结论**：
- 如果旧代码之前能工作，说明知乎对 `image_hash` 不做严格校验（仅用于去重/秒传判断），哈希不匹配时走正常上传流程
- 新代码的 MD5 是正确的，不应该导致回归
- **知乎回归的真正原因需要在其他环节寻找**

### 更新后的嫌疑排序

| 优先级 | 嫌疑点 | 影响平台 | 状态 |
|--------|--------|---------|------|
| ~~P0~~ | ~~知乎 MD5 哈希算法不等价~~ | 知乎 | **已排除** — DevTools 证明新代码正确 |
| **P1** | **`resolvePublishTransport` 忽略 `forceProxy`** | 知乎 | **根因确认** — 见下方分析 |
| P2 | 知乎 `zhihuFormFetch` 缺少 Content-Type: application/json | 知乎 | P1 的直接后果 |
| P3 | CSDN 签名算法等价性（hmacSha256Base64） | CSDN | 待验证 — 格式一致 |
| P4 | ali-oss SDK 版本差异（插件 6.16 vs 官方 6.8） | 知乎 | 低风险 |

### 修复

**知乎修复**：在 `zhihuFormFetch` 中添加 `Content-Type: application/json` header。
- 文件：`src/adaptors/web/zhihu/zhihuWebAdaptor.ts:385`
- 原因：新代码走 `plugin-node-fetch` 通道时，node-fetch 对字符串 body 默认设置 `text/plain`，知乎 API 需要 `application/json`

**CSDN 无需修复**：
- 签名请求走 `jsonFetchClient`，`buildPluginRequestHeaders` 自动设置 Content-Type
- OBS 上传走 `formUploadClient`，FormData body 由 node-fetch 自动设置 multipart boundary

### P1 根因分析：传输通道路由变化

**旧代码** (`main` 分支) `webFormFetch` 逻辑：
```
if (!isInSiyuanOrSiyuanNewWin() || forceProxy) {
  → 走 siyuan forward proxy（服务端代理，自动处理 Content-Type）
} else {
  → 走 zhi-formdata-fetch（plugin-node-fetch，本地 Node.js）
}
```

**新代码** (`feature/ui-2.0`) `resolvePublishTransport` 逻辑：
```
if (canUsePluginFetch) {
  return "plugin-node-fetch"  // 无条件优先，完全忽略 forceProxy！
}
```

**影响**：
- 知乎 `zhihuFormFetch` 调用 `webFormFetch(url, headers, formData, true)` — `forceProxy=true`
- 旧代码：走 siyuan forward proxy → `proxyFetch` 会处理 Content-Type 和编码
- 新代码：走 `zhi-formdata-fetch` → 直接用 node-fetch，但 headers 中没有 Content-Type
- 结果：知乎 API 收到没有 Content-Type 的 JSON body，可能返回错误

**CSDN 不受影响的原因**：
- CSDN `csdnFormFetch` 默认 `forceProxy=false`
- 旧代码中也走 `zhi-formdata-fetch`（plugin-node-fetch）
- 所以 CSDN 的传输通道没有变化

**但 CSDN 签名请求走 `csdnMediaFetch` → `webFetch`**：
- 旧代码 `webFetch`：走 `proxyFetch`（siyuan forward proxy）
- 新代码 `webFetch`：走 `jsonFetchClient` → `resolvePublishTransport` → `plugin-node-fetch`
- `runPluginJsonFetch` 会自动设置 Content-Type（`buildPluginRequestHeaders` 第 129 行），所以应该没问题

## 日志复核：知乎本次实测失败（2026-05-24 20:35）

- `logs/zhihu.log` 显示在 `BaseExtendApi.handlePictures()` 阶段直接输出：`图片图床服务未指定，跳过图片处理`。
- 同一次发布正文请求 `https://zhuanlan.zhihu.com/api/articles/drafts` 的 body 仍包含本地相对图片：`assets/network-asset-...png`、`assets/image-...png`。
- 日志中没有出现 `zhihu start uploadFile` 或 `https://api.zhihu.com/images`，说明这次失败并未进入知乎图片上传接口。
- `logs/zhihu.request` 保存的实际配置中，`custom_Zhihu.picbedService` 与 `custom_Csdn-iqo7y.picbedService` 均为 `"none"`，而两者 `bundledPicbedSupported` 为 `true`。
- 因此当前失败根因不是知乎 `/images` 返回结构，也不是 MD5 / OSS 上传，而是 CSDN、知乎账号配置层把平台图床保存成了 `none`，导致共用图片预处理链路跳过。

## 新增平台为什么没有走默认图床

- `bundledPicbedSupported = true` 只表达“平台支持内置/平台图床”，不等于当前账号选择了该图床。
- 图片预处理实际读取 `cfg.picbedService`，只有等于 `PicbedServiceTypeEnum.Bundled` 时才会执行平台上传。
- `zhi-blog-api` 的 `BlogConfig` 构造默认 `picbedService = PicbedServiceTypeEnum.None`。
- `feature/ui-2.0` 引入 `safeMergeConfig()` 后，新账号的 `{}` 会先构造平台默认实例；CSDN/知乎自己的 Config 构造函数没有覆盖 `picbedService`，所以默认实例继承到 `none`。
- 随后 `useCsdnWeb()` / `useZhihuWeb()` 虽然设置了 `cfg.bundledPicbedSupported = true`，但没有把 `cfg.picbedService` 从 `none` 改成 `bundled`；`getPicbedServiceType()` 看到 `none` 不是空值，会尊重它，最终跳过图片处理。
- 修复点应在 CSDN/知乎 Config 构造默认值：支持平台图床的平台新建账号默认 `picbedService = bundled`；显式保存的 `none` 仍由 safeMerge 覆盖并保留。

## CSDN 实测结论

- 用户 2026-05-24 反馈：CSDN 测试通过。
- 因此此前默认平台图床配置修复对 CSDN 已经覆盖；CSDN 签名/OBS 上传暂不继续扩展。

## 知乎新失败点：OSS 未定义

- 新错误发生在 `ZhihuWebAdaptor.uploadFile()` 内部，并且日志文案显示已经进入“使用平台图床”。这证明默认图床选择修复有效。
- 当前失败是 `src/vendors/alioss/s3oss.ts` 直接使用裸全局 `OSS`，但 V2 运行时没有预先加载 `public/libs/alioss/aliyun-oss-sdk-6.16.0.min.js`。
- 修复原则：在 `s3oss.ts` vendor 层显式解析/加载 SDK；知乎适配器只传入宿主上下文并 await 客户端，避免把 SDK 加载细节散落到平台适配器。
