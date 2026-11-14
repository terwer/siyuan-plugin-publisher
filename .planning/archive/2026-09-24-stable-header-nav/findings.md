# 发现

## 1. 顶部按钮的父级 scoped 样式一直是失效的（本次一并修好）

`SypTooltip` 用 `<component :is="tag">` 渲染触发器，**这个 button 节点由 SypTooltip 自己的模板创建**，
只带 `data-v-<SypTooltip>`，**不带调用方的 `data-v-<父组件>`**。实测（jsdom 渲染结果）：

```
<nav data-v-68facd7e class="syp-header-nav">      <-- AppHeaderNav 根
  <button data-v-5e3a1ae6 class="syp-btn syp-btn-quiet syp-btn-text-entry is-active ...">
    <svg data-v-68facd7e>...</svg><span data-v-68facd7e class="syp-btn-text-entry__label">
```

- 踩坑点：父组件里的 `.syp-btn-quiet[data-v-父]` / `.syp-btn-text-entry[data-v-父]` **匹配不到按钮**。
- 嵌套写法里的 `.a .b` 编译成 `.a .b[data-v-父]`，`.a` 一侧不带 scope 约束，
  所以 `__label` 那类**后代选择器仍会生效**——这解释了「看着有效、其实父级自身样式没生效」的假象。
- 结论：给 `SypTooltip`（或任何以组件渲染触发器的封装）加样式，必须 `:deep(...)`；
  `AppHeaderNav.vue` 已按此实现。
- 参考：`base.styl` 是全局样式表（`import` 而非 scoped），其中的 `.syp-btn` 基类对按钮**是生效的**。

## 2. 顶部动作条原本的条件渲染清单（本次要消灭的行为）

| 当前视图 | 详细发布 | 批量分发 | 文章管理 | 设置 |
| --- | --- | --- | --- | --- |
| 快速发布（有文档） | 有 | 有 | 有 | 有 |
| 快速发布（无文档） | 消失 | 有 | 有 | 有 |
| 详细发布 / 批量分发 | 消失 | 消失 | 有 | 有 |
| 文章管理 | 消失 | 消失 | **变「返回发布」** | 有 |
| 设置 | 消失 | 消失 | **消失** | **变「返回账号列表/快速发布」** |

## 3. 返回能力的原去向（改造后必须仍在）

- 账号子流程（选平台 / 平台配置）原先只能靠顶部那个会变身的「返回」退出 → 现已补进内容区。
- 文章管理右侧滑入面板自带返回，不受影响。
- 详细发布 / 批量分发视图自带返回，不受影响。
