---
name: release-please-flow
description: |
  使用 Google release-please 的通用发版流程。
  当用户说"发版"时触发。处理源分支→main 合并后 release-please 自动创建发版分支、
  prepareRelease、本地 CI 模拟验证、用户二次确认后最终合并发版。
  支持 dev→main、hot-fix→main 等场景。
---

# release-please 发版流程

## 概述

使用 Google release-please 自动管理版本号。机器人读取 main 分支 git 历史中的
conventional commits 自动决定版本号（major/minor/patch）。**绝对不要手动指定版本号。**

## 为什么最后一步极其危险

- **npm 版本号不可重发**：同版本号一旦发布，即使删除 npm 包该版本号也永久占用
- **release-please 基于 git tag 判断**：跳过或发错的版本号永远空缺，无法填补
- **发错版本只能接受**：比如误升 major，只能继续往下发，不能回退
- **CHANGELOG 一旦推到 main 就写入历史**：修正需要 force push main，极度危险
- **合并发版分支到 main = 按下发射按钮**：CI 自动触发 npm publish，不可撤销

## 场景 A：日常发版（dev → main）

1. 用户说"发版"
2. 合并 dev 到 main：
   ```bash
   git checkout main
   git merge dev --no-edit
   git push origin main
   ```
3. release-please CI 检测到 main 更新，自动创建发版分支：
   `release-please--branches--main--components--<package-name>`
   ⚠️ **发版分支不是立即创建的** — release-please CI 需要时间检测 main
   的变更并生成分支，通常需要 30 秒到 2 分钟，具体取决于 CI 的轮询间隔。
4. **轮询等待发版分支出现，然后切换**：
   ```bash
   # 循环 fetch 直到发版分支出现（最多等待 120 秒）
   for i in $(seq 1 24); do
     git fetch origin
     BRANCH=$(git branch -r | grep 'origin/release-please--branches--main' | head -1 | sed 's|.*origin/||')
     if [ -n "$BRANCH" ]; then
       echo "found: $BRANCH"
       git checkout "$BRANCH"
       break
     fi
     echo "waiting for release-please branch... ($((i * 5))s)"
     sleep 5
   done
   if [ -z "$BRANCH" ]; then
     echo "ERROR: release-please branch not found after 120s, check CI status"
     exit 1
   fi
   ```
5. 运行 prepareRelease：
   ```bash
   pnpm prepareRelease
   ```
6. 提交（版本号由 release-please 自动决定，**禁止手动指定**）：
   ```bash
   git add -A
   git commit -m "chore(main): release X.Y.Z"
   ```
   ⚠️ **此时不要 push**

7. **本地 CI 模拟**（push 前验证一切正常）：
   ```bash
   pnpm install && pnpm run build && pnpm run test
   ```
   - 构建失败 → 修好再继续
   - 测试失败 → 修好再继续
   - 全部通过 → 进入下一步

8. **版本号二次验证**（push 前最后检查）：
   ```bash
   cat .release-please-manifest.json   # 版本号是否正确，检查 bump 类型是否合理
   cat CHANGELOG.md | head -10         # changelog 内容是否正确
   git log --oneline -3                # 提交历史是否正确
   ```
   特别注意：全是 fix 提交不应升 major，全是 feat 不应只升 patch

9. **报告用户 review**，输出以下信息：
   - 版本号
   - 构建结果（通过/失败）
   - 测试结果（通过/失败）
   - CHANGELOG 预览
   - "以上确认无误后，告诉我可以 push 和合并"

10. 用户确认后，push 发版分支：
    ```bash
    git push origin <release-please-branch-name>
    ```

11. ⚠️ **最终合并由用户亲自操作**：合并发版分支到 main = 触发 npm publish。
    我只能提醒你 review，你**自己点合并按钮**。
    一旦合并，版本号永久生效，不可回退、不可跳过、不可重用。

12. 合并完成后，手动删除发版分支（bot 不会自动删除）：
    ```bash
    git branch -d <release-please-branch-name>
    git push origin --delete <release-please-branch-name>
    ```

## 场景 B：紧急修复发版（hot-fix → main）

流程同场景 A，把 dev 换成 hot-fix 分支即可。也是一次性的。

## 场景 C：其他分支 → main

流程同场景 A，替换源分支名称。

## 关键规则

- **绝对不要手动指定版本号** — release-please 自动处理
- **绝对不要在用户确认前合并到 main** — 合并即发版
- **本地 CI 模拟是必须的** — 不通过不能 push
- **版本号验证是必须的** — 检查 bump 类型是否匹配提交内容（如全是 fix 不应升 major）
- `pnpm prepareRelease` 会执行：
  - `pnpm syncVersion` — 同步根 package.json 版本号到所有子包
  - `pnpm parseChangelog` — 解析 CHANGELOG.md
- Conventional commits 决定版本号类型：
  - `fix:` → patch（x.y.Z）
  - `feat:` → minor（x.Y.0）
  - `feat!:` 或 `BREAKING CHANGE:` → major（X.0.0）

## 常见坑

- **release-please 误升主版本**：main 提交历史中有残留的 `BREAKING CHANGE` footer，会导致误升 major 版本。用 `git log` 检查所有未被 release 的提交 body 是否不应含 breaking change
- **CI 里 `packageManager` 字段控制 pnpm 版本**：不要在 CI workflow 里硬编码 `version:`
- **pnpm 10+ 封锁 lifecycle scripts**：确保 `package.json` 里有 `pnpm.onlyBuiltDependencies`
- **vite-plugin-static-copy 在 Vite 7 下不可靠**：用自定义 `closeBundle` 插件替代
