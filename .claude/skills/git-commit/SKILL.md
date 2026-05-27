---
name: git-commit
description: Review all current changes, generate a conventional commit message (feat/fix/docs/chore/refactor + breaking changes), stage all changes, and commit without pushing. Triggered when user says "提交git" or similar.
metadata:
  author: terwer
  version: "2.0"
---

# Git Commit Skill

当用户说"提交 git"、"提交代码"或类似指令时，执行以下步骤：

## Steps

### 1. 检查工作区状态

```bash
git status
git diff
git diff --cached
git log --oneline -5
```

同时检查 `.gitignore` 中的规则，了解哪些文件被忽略。

### 2. 智能文件审查（核心步骤）

**逐文件判断，不能无脑 `git add -A`。** 对每个变更文件分类：

#### A. 常规待提交文件（自动 stage）
以下类型直接加入暂存区，无需询问：
- 已跟踪文件的修改（modified）—— 源码、配置、文档
- 已跟踪文件的删除（deleted）
- 新增的 `.ts` / `.vue` / `.tsx` / `.js` / `.json` / `.md` / `.css` / `.styl` 等常规源码文件
- `.claude/` 下的 skill 文件
- 脚本文件、测试文件

#### B. 需要提醒用户的文件（列出并等待确认）
- **疑似敏感文件**：`.env`、`credentials`、`token`、`secret`、`password`、`*.pem`、`*.key` —— 强烈不建议提交
- **被 .gitignore 忽略但可能是核心源码的文件** —— 提醒用户确认是否需要 `git add -f`
- **与核心变更无关的孤立文件** —— 提醒用户是否需要单独提交或丢弃
- **大二进制文件**（>1MB 的图片、压缩包等）

#### C. 拿不定主意的文件（列出并询问用户）
- 不常见文件扩展名
- 修改范围异常大的文件
- 可能属于其他变更批次的文件
- package.json / pnpm-lock.yaml 的变更（确认是否与本次改动匹配）
- .gitignore 中新增条目（确认意图）

### 3. 展示变更清单

向用户清晰列出：

```
📋 待提交（自动 stage）：
  - modified: src/xxx.ts
  - new file: src/yyy.vue
  - deleted: src/zzz.ts

⚠️ 需要确认：
  - new file: .env.example → 这个是示例文件还是真实密钥?
  - untracked (被 ignore): dist/custom.js → 需要强制加入吗?

❓ 拿不定主意：
  - modified: pnpm-lock.yaml → 依赖变更是否与本改动相关?
```

### 4. 分析变更内容并生成提交信息

- 阅读所有待提交文件的 diff，理解变更目的
- 识别变更类型：
  - `feat:` — 新功能
  - `fix:` — bug 修复
  - `docs:` — 文档变更
  - `style:` — 代码格式（不影响功能）
  - `refactor:` — 重构（不改变功能）
  - `perf:` — 性能优化
  - `test:` — 测试相关
  - `chore:` — 构建/工具/依赖变更
  - `ci:` — CI/CD 变更
- 判断是否有破坏性变更（BREAKING CHANGE），如有在类型后加 `!`，如 `feat!:`，并在 body 中说明

### 5. 展示提交信息并等待确认

格式遵循 conventional commits：
```
<type>[optional scope]: <description>

[optional body — 说明 WHY 和 breaking changes]

[optional footer — 关联 issue]
```
- description 用英文，50-72 字符以内
- scope 可选，根据变更模块确定（如 platform, transport, v2, ui）

### 6. 提交

用户确认后：
```bash
git add <具体文件1> <具体文件2>  # 只用文件名，不用 -A
git commit -m "$(cat <<'EOF'
<commit message>
EOF
)"
```

### 7. 验证

```bash
git status
git log --oneline -3
```

## 核心原则

- **不执行 `git push`**
- **不用 `git add -A`**，逐个指定文件名
- 工作区干净时直接告知
- 拿不定主意就询问用户，不自行判断
- 提交说明用英文，与仓库历史保持一致