# 调查发现：issue #2050 与源码模式图床分流缺陷

## 一、现象

### issue #2050（外部反馈，仅存档）

- 标题：在文章内无图片时也会尝试上传图床；作者 emptylight370，2026-10-03 创建，OPEN
- 现象：文章内无图片时，「详细发布 > 源码模式」提示
  `文档可能已经成功发布，但是 PicGo 图床内核上传失败，详细信息=>Uploader "smms" config is invalid`，且 YAML、md 源码不加载
- 环境：思源 v3.8.7-alpha.3；发布插件 v2.1.0；PicGo 图床插件 v3.0.3
  - PicGo 侧选择 app 模式，对应软件未运行；发布插件内部图床未设置 → 当前 uploader 为 smms（默认）
- 复现：打开文章 → 详细发布 → 切源码模式 → 报错且源码不加载

### 语雀网页版实测（作者补充）

- 平台配置「图床服务」选择「当前平台」（Bundled）并保存验证通过
- 打开源码模式仍报同样的 smms 错误 → 暴露缺陷 1（源码模式绕过图床服务分流）

## 二、缺陷 1：SourceMode 绕过图床服务分流

### 触发路径

| 步骤 | 位置 | 行为 |
| --- | --- | --- |
| 1 | `SinglePublishDoPublish.vue:509` / `BatchPublishIndex.vue:413` | `<source-mode>` 渲染（editType === EditMode_source） |
| 2 | `SourceMode.vue:249-251` | `onMounted` → `initPage()` |
| 3 | `SourceMode.vue:220` | `await handlePicgo(id, post.markdown)` — 无条件调用，未判 `cfg.picbedService`，也未判有无图片 |
| 4 | `SourceMode.vue:239-241` | catch → `ElMessage.error(e.message)`；`initPage` 在 `handlePostToHoHtml(post)`（L234，生成 YAML）之前中断 → `yamlFormatObj` 未初始化 → YAML/md 不渲染 |

### 与发布主流程的分流对照

`baseExtendApi.handlePictures`（L479 起，`preEditPost` 的前置步骤）按 `cfg.picbedService` 正确分流：

| picbedService | 发布主流程行为 |
| --- | --- |
| `PicGo` | `handlePicgo` → 内核上传 + 链接替换 |
| `Bundled` | `getImagesFromMd` → 无图片直接 `return post`（L520-523）；有图片逐个 `readFileToBase64` + `api.newMediaObject` 上传平台 → 链接替换 |
| `default`（含 None） | 「图片图床服务未指定，跳过图片处理」 |

源码模式是绕过这套分流的独立入口（唯一另一处 `handlePicgo` 调用点见下表）。

### 语雀网页版事实（`src/adaptors/web/yuqueweb/YuquewebConfig.ts:35-37`）

- `picgoPicbedSupported = false`——配置页不显示 PicGo 选项（`CommonBlogSetting.vue:528-539` 的 v-if）
- `bundledPicbedSupported = true`，默认 `picbedService = Bundled`
- 支持 `newMediaObject`（`YuquewebWebAdaptor.ts:258`），平台图片上传可用
- 配置页保存时 `getPicbedServiceType(cfg)`（`CommonBlogSetting.vue:362`）按能力定默认——分流在配置层明确，唯独源码模式不遵守

### 批量模式连带

`BatchPublishIndex.vue:413` 的 `<source-mode>` 未传 `cfg`（default `{}`）→ 同样无条件走 PicGo（无单平台上下文可用）。

### 历史佐证（git）

- `handlePicgo` 调用 2023-08-21 引入（`09583e402`）
- 图床服务分流 2024-03-30 才引入（`e13720c9 fix: allow custom set picbed service`）
- → SourceMode 是未跟上演进的遗留逻辑

## 三、缺陷 2：无本地图片时内核仍前置校验 uploader 配置

### 内核 wrapper 关键代码（zhi-siyuan-picgo@3.0.3 `SiyuanPicGoHeadlessManager.uploadMarkdownImages`）

```js
async uploadMarkdownImages(pageId, attrs, mdContent) {
  const uploaderId = await this.getCurrentUploader();
  const validation = this.validateUploaderConfig(uploaderId, await this.getUploaderConfig(uploaderId));
  if (!validation.ok) throw new PicGoHeadlessError({
    message: `Uploader "${uploaderId}" config is invalid`, errors: validation.errors
  });
  return this.postApi.uploadPostImagesToBed(pageId, attrs, mdContent);  // ← 「文章中没有图片」短路在这层内部，没执行到
}
```

- 校验是无条件的、先于图片检测；smms 配置为空/无效（用户未配置）即抛错
- 报错文案在插件侧的包装：`usePicgoBridge.ts:46`（`文档可能已经成功发布，但是 PicGo 图床内核上传失败，详细信息=>`）

### 内核底层已有正确的无图短路（`SiyuanPicgoPostApi.uploadPostImagesToBed`）

- `getImageBlocksByID(rootId)`：SQL `select * from blocks where root_id='{id}' and markdown like '%![%'`（zhi-siyuan-api 的 `SiyuanKernelApi`）
- 再用 `ImageParser.parseLocalImagesToArray(mdContent)` 收集本地图片（assets/ 正则）
- 无本地图片时返回 `{flag:false, hasImages:false, mdContent, errmsg:"文章中没有图片"}`，**不做任何上传**
- 结论：**「无图片不上传」内核本来就有，只是被 headless 包装层的 uploader 前置校验挡住**

### 发布流程同样受影响

- `baseExtendApi.ts:497`（`handlePictures`，PicGo 分支）：`handlePicgo` 包在 try/catch，失败收集到 `post.imageUploadErrors`
- `usePublish.ts:158-165`：`singleFormData.errMsg = "图片上传存在 N 个错误"`，发布不中断
- 即：无图片文章发布时也会出现同样的误报（「文档可能已经成功发布，但是…」正是此语义）

### handlePicgo 的两个调用点

| 调用点 | 场景 | 错误处理 |
| --- | --- | --- |
| `SourceMode.vue:220` | 源码模式初始化 | 直接抛出 → 提示 + 源码不渲染 |
| `baseExtendApi.ts:497` | 发布预处理 | 收集到 imageUploadErrors → 发布继续，结果附错误提示 |

## 四、关键事实（修复设计依据）

### 判据一致性（插件侧与内核同源）

- 内核 minified 里 `Zd` = `SiyuanKernelApi`（dist L34427 日志「初始化 SiyuanKernelApi 实例」佐证）
- 插件侧 `useSiyuanApi.ts:43` 已实例化同一个类：`new SiyuanKernelApi(siyuanConfig)`
- → `kernelApi.getImageBlocksByID(pageId)` 与内核判据完全一致，无「双轨」风险
- SQL 命中为空 ⇒ 必定无图片 ⇒ 短路安全；命中非空（含宽松情况）交由内核二次过滤

### 源码模式「编辑→发布」数据流转

- `SourceMode.initPage` 中 `post.markdown` 被处理后的结果进入 YAML 生成（`handlePostToHoHtml`）
- 用户在源码模式保存 YAML → `emitSyncPost` → `SinglePublishDoPublish.syncPost` → `formData.mergedPost = post`
- 点「发布」→ `doSinglePublish` → `preEditPost` → `handlePictures` **再按 picbedService 处理一遍**（PicGo 幂等：fileMap 命中的图片不再上传）
- `doInitSinglePage`（打开详细发布页时）只读取文章，不做图片处理；图片处理仅发生在：① 发布时 preEditPost；② 打开源码模式时（本次修复移除）

### 容错缺失对照

- 图床设置页（`PicBedSettings.vue`）对 runtime 错误有完整降级展示（`state.picgoRuntime.ok` 分支）
- 源码模式 catch 后整体中断渲染 → 空白。同类错误两处待遇不一致（本次由 P1 消除该路径）
