# 任务计划：核实并修复 issue #2054 反馈的若干问题

## 目标
逐条核实 issue #2054 的 7 条反馈，确认缺陷的立即修复并补文档；非缺陷如实解释；界面布局类缺陷给出根因，待宿主验证后排期。

## 当前阶段
阶段 3（实施与验证完成，待实机复核）

## 各阶段

### 阶段 1：逐条核实（只读）
- [x] A1 源码模式 YAML 读不到现存属性（关联 #2026）→ 属性名大小写不一致（见 findings）
- [x] A2 自定义预览规则不生效 → `instanceof` 判断在发布链路恒为 false
- [x] A3 更新时间不统一 → YAML 的 `updated` 覆盖文档更新时间并因此冻结
- [x] A4 详细模式修改不同步 /「同步到思源」无效（关联 #1796）→ 写回初始化快照
- [x] B1 去除自动编号不生效 → 只处理文章标题，未处理正文标题编号
- [x] B2 同步按钮说明不详细 → 文档确认缺失
- [x] B3 顶栏插件设置入口出现移动端容器 → `openSetting()` 未传锚点，桌面端落到全屏菜单
- **状态：** complete

### 阶段 2：范围决策
- [x] A1~A4、B1、B2 纳入本次修复（局部、可单测覆盖）
- [x] B3 属界面布局，需宿主实机比对截图；本环境无思源宿主，单独跟进，不并入本次提交
- **状态：** complete

### 阶段 3：实施
- [x] `getDynYamlKey` 生成思源规范的小写属性名；读取侧做一次大小写兼容（`usePublish.readPlatformYamlAttr`）
- [x] 新增 `src/utils/platformYaml.ts`：`buildPlatformYamlFormatObj` 以适配器结果为准、合并回已保存 YAML 的额外字段；源码模式、发布、同步三处共用
- [x] Hexo / Quartz 转换器去掉 `instanceof` 判断，按配置读取预览规则生成 permalink
- [x] 「同步修改到思源笔记」按当前模型重算平台 YAML 后写回（源码模式仍以编辑框为准）
- [x] 更新时间取文档时间与 YAML 中较晚者；详细发布编辑流初始化时取文档时间
- [x] 新增 `src/utils/titleNumber.ts`：文章标题与正文各级标题去编号（跳过代码块，纯数字限 1–2 位）
- [x] 文档：`docs/guide/single-publish.md` 补同步按钮语义与预览链接区别，`docs/guide/settings.md` 同步去编号范围
- **状态：** complete

### 阶段 4：验证
- [x] 单测：新增 `titleNumber`、`platformYaml`、`permalinkPlainConfig`、`usePublish.initAttrs` 四个用例文件
- [x] 全量 `npx vitest run`：78 文件 / 423 用例通过
- [x] `npx vue-tsc --noEmit` 通过
- [ ] 宿主手验（无思源宿主环境，未做）：Git 静态博客平台发布/更新、源码模式 YAML、同步按钮、去除标题编号
- [ ] B3 修复 + 宿主截图比对（后续跟进）
- **状态：** in progress
