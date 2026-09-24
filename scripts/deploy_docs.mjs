/**
 * 把文档站点发布到 GitHub Pages（gh-pages 分支），本地与 CI 共用同一套逻辑。
 *
 * 用法：
 *   pnpm docs:deploy              # 构建并推送
 *   pnpm docs:deploy --dry-run    # 只构建 + 生成提交，不推送
 *
 * 做的事：
 *   1. 构建站点（vitepress build docs）；
 *   2. 写入 .nojekyll（否则 Jekyll 会忽略以下划线开头的资源）；
 *   3. 在临时目录建一个孤立的 gh-pages 提交；
 *   4. 推送到远端（本地用 origin，CI 可用环境变量指定带凭据的地址）。
 *
 * 不污染任何现有分支的历史。GitHub Pages 的 Source 指向本分支根目录，
 * 推送后由 Pages 自动重建。
 *
 * CI 覆盖项：
 *   DOCS_DEPLOY_REMOTE  推送目标地址（默认取 origin）
 */
import { execFileSync } from "node:child_process"
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const dryRun = process.argv.includes("--dry-run")

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: "inherit", ...opts })
const capture = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: "utf8", ...opts }).trim()

const DIST = resolve("docs/.vitepress/dist")

console.log("== 1/4 构建站点 ==")
run("pnpm", ["docs:build"], { shell: true })

if (!existsSync(join(DIST, "index.html"))) {
  console.error("构建产物缺少 index.html，中止")
  process.exit(1)
}

// Jekyll 会忽略下划线开头的资源，VitePress 的 assets 依赖这个标记
writeFileSync(join(DIST, ".nojekyll"), "")

console.log("== 2/4 生成 gh-pages 提交 ==")
const staging = mkdtempSync(join(tmpdir(), "docs-ghpages-"))
cpSync(DIST, staging, { recursive: true })

const git = (args, opts = {}) => capture("git", args, { cwd: staging, ...opts })
git(["init", "-q"])
git(["checkout", "-q", "-b", "gh-pages"])

// 身份：优先用仓库配置，CI 里由工作流通过环境变量提供
const name = process.env.DOCS_DEPLOY_NAME || capture("git", ["config", "user.name"]) || "github-actions[bot]"
const email =
  process.env.DOCS_DEPLOY_EMAIL || capture("git", ["config", "user.email"]) || "github-actions[bot]@users.noreply.github.com"
git(["config", "user.name", name])
git(["config", "user.email", email])
git(["add", "-A"])
git(["commit", "-q", "-m", "docs: publish the documentation site"])

const fileCount = git(["ls-files"]).split("\n").filter(Boolean).length
console.log(`  ${fileCount} 个文件，提交 ${git(["rev-parse", "--short", "HEAD"])}`)

const remote = process.env.DOCS_DEPLOY_REMOTE || capture("git", ["remote", "get-url", "origin"])

if (dryRun) {
  console.log("== 3/4 跳过推送（--dry-run）==")
  console.log(`  目标: ${remote}`)
} else {
  console.log("== 3/4 推送到 gh-pages ==")
  git(["remote", "add", "origin", remote])
  run("git", ["push", "-f", "origin", "gh-pages"], { cwd: staging })
}

console.log("== 4/4 清理 ==")
rmSync(staging, { recursive: true, force: true })

if (dryRun) {
  console.log("\n预演完成，未推送。")
} else {
  console.log("\n完成。GitHub Pages 会在约半分钟后重建站点。")
  console.log("站点地址见 docs/.vitepress/site.mts 的 SITE_ORIGIN + SITE_BASE。")
}