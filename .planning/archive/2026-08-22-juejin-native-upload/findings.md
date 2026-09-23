# 掘金图片上传集成说明

> 记录掘金平台图片上传集成的实现与验证结论。集成本身基于字节 veImageX 图片上传接口
> （`gen_token` / `ApplyImageUpload` / `TOS 直传` / `CommitImageUpload` / `get_img_url`）完成。

## 一、实现

- 新增文件：`src/vendors/byteimagex/imagexClient.ts`（CRC32 + AWS SigV4 + 三步直传）、
  `src/utils/cryptoUtils.ts`（`sha256Hex` / `hmacSha256Raw` / `bytesToHex`）、
  `src/utils/rawHeaderFetch.ts`（大小写保真请求通道）；`juejinWebAdaptor.ts` 增加 `uploadFile`。
- 调用流程：`gen_token` 取 STS 临时凭证 → `ApplyImageUpload`(SigV4 签名) → `TOS 直传`(带 CRC32) →
  `CommitImageUpload` → `get_img_url` 取可访问 URL。
- 掘金默认图床 = `Bundled`（原生图片直传）。
- 正文图片地址采用 `get_img_url.main_url`（完整签名 URL），读取端按需重新生成签名。

## 二、API 契约要点（用于保证调用正确）

- SigV4 的 `amzDate` 必须不带冒号（如 `20260822T155943Z`）；带冒号会被服务端拒绝（100024）。
- TOS 直传必须携带 `Content-CRC32`；缺失返回 `400 MismatchChecksum`。
- `gen_token` 的 `uuid` 参数仅供上报，服务端不做校验。
- `CommitImageUpload` 返回 `UriStatus=2000` 即上传成功。

## 三、存储契约（正文图片形态）

- 掘金正文 `mark_content` 中的图片为完整签名 URL：
  `https://p0-xtjj-private.juejin.cn/tos-cn-i-…~tplv-…&rk3s=…&x-orig-sign=…`。
- 读取端会按需重新生成签名，延长有效期；**不应持久化裸 StoreUri**——文章页会按相对路径解析，导致图片 404。

## 四、修复与验证结论

- 修复：`uploadFile` 返回 `get_img_url.main_url`（完整签名 URL）作为 `url`（此前返回裸 `storeUri`），
  取不到 `main_url` 时显式抛错。
- 验证：`build:v2` 通过；带图文档发布/更新后，文章页图片渲染为完整 URL（`p3-xtjj-sign.byteimg.com/…`）；
  `webPicbedDefaults.spec` 通过。

## 五、平台发布注意

- 掘金发布要求分类、标签、摘要：未显式填写时使用默认分类/标签/摘要。
- 新文章初始处于审核中（`audit_status=1`），放行后（`audit_status=2`）才对外可见，与上传机制无关。
