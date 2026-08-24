# zhi-siyuan-api 改动契约 — 笔记本过滤支持（发布源范围）

> 目标：让内核文档查询支持**按笔记本集合过滤**，用于「文章管理按笔记本隔离」（issue #2044）。
> 仓库：`terwer/zhi` → `libs/zhi-siyuan-api`。改动需**向后兼容**：`notebookIds` 为空/缺省时不追加任何条件，行为与现在完全一致。
> 结论契约已完成，待 terwer 在 zhi 仓库实施并发布，之后本仓库 bump 并对接。

## 背景（已确认事实）

- `blocks` 表每行有 `box` 字段 = 块所属**笔记本 id**。
- 根文档 = `b.id = b.root_id AND b.type = 'd'`，其 `box` 即该文档所在笔记本。
- 现有 `getRootBlocks` 的 SELECT **已带出 `b.box as notebookId`**，但 WHERE 没有按 notebook 过滤。

## 改动点 1 — `SiyuanKernelApi`

文件：`libs/zhi-siyuan-api/src/.../kernel/siyuanKernelApi.ts`

### `getRootBlocksCount`
- 现签名：`getRootBlocksCount(keyword, showPublished)`（内部 `t` 即 showPublished）。
- 新增可选第 3 参：`notebookIds?: string[]`。
- 未配置（`!notebookIds?.length`）→ 不变。
- 配置非空 → 在 WHERE 追加 `AND b.box IN ('id1','id2')`。
  - 注意 `getRootBlocksCount` 有两支（showPublished 真假），两处 WHERE 都要加。

### `getRootBlocks`
- 现签名：`getRootBlocks(offset, limit, keyword, showPublished)`。
- 新增可选第 5 参：`notebookIds?: string[]`。
- 未配置 → 不变；配置非空 → `AND b.box IN (...)`。
- 同样有 showPublished 两支分支，都要加。
- **保留现有 `LIMIT/OFFSET/ORDER BY` 关系不变**，只加 WHERE 条件。

**SQL WHERE 追加（统一 helper）**
```ts
const nbWhere = (notebookIds?: string[]) =>
  !notebookIds || notebookIds.length === 0
    ? ""
    : ` AND b.box IN (${notebookIds.map((id) => `'${id}'`).join(",")})`
```

## 改动点 2 — `SiYuanApiAdaptor`

文件：`libs/zhi-siyuan-api/src/.../adaptor/siYuanApiAdaptor.ts`

### `getRecentPostsCount`
- 现签名：`getRecentPostsCount(keyword, showPublished)`。
- 新增可选第 3 参 `notebookIds?: string[]`，透传给 `getRootBlocksCount(keyword, showPublished, notebookIds)`。

### `getRecentPosts`
- 现签名：`getRecentPosts(numOfPosts, offset, keyword, showPublished)`。
- 新增可选第 5 参 `notebookIds?: string[]`，透传给 `getRootBlocks(offset, numOfPosts, keyword, showPublished, notebookIds)`。
  - 内部 `let a = 0; t && (a = t)` 的 offset 逻辑**原样保留**。

## 行为矩阵

| public 调用 | keyword | showPublished | notebookIds | 结果 |
|---|---|---|---|---|
| `getRecentPostsCount("", false)` | "" | false | 缺省/`[]` | **全量**（现状） |
| `getRecentPostsCount("", false, ["n1","n2"])` | "" | false | `["n1","n2"]` | 仅 n1/n2 笔记本根文档数量 |
| `getRecentPosts(8, 1, "kw", false, ["n1"])` | "kw" | false | `["n1"]` | n1 笔记本、含 kw 的根文档（第 2 页） |
| 任何组合 | — | true | `[]` | 与现状一致（showPublished 分支不变） |

## 注意

- **不要改动** `LIMIT/OFFSET` 布局、排序、`LEFT JOIN attributes` 等既有逻辑。
- `notebookIds` 为 strings（笔记本 id，来自 `lsNotebooks()` 的 `id` 字段）。
- 新增参数必须是**可选/尾参**，避免破坏现有调用点。
- 顺手可加：若后续要支持挂件模式 `getSubdocs`/`getSubdocCount`，同样加尾参 `notebookIds`（本期可选，先做根文档列表）。

## 本仓库对接（bump 之后）
- `src/pages/Admin.vue`：`blogApi.getRecentPosts(size, offset, state, showPublished, selectedNotebookIds)`；count 同理。
- 其余见 `task_plan.md` Phase 2-5。
