/*
 * MIT License
 *
 * Copyright (c) 2023. Terwer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const path = require("path")
const minimist = require("minimist")
const stylePlugin = require("esbuild-style-plugin")
const { copy } = require("esbuild-plugin-copy")

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w || false
const isServe = args.serve || args.s || false

let baseDir
if (isWatch || isServe) {
  baseDir = "/Users/terwer/Documents/mydocs/SiYuanWorkspace/test/data/plugins/siyuan-plugin-publisher"
  // baseDir = "/Users/terwer/Documents/mydocs/SiYuanWorkspace/public/data/plugins/siyuan-plugin-publisher"
} else {
  baseDir = "./"
}
const distDir = isWatch || isServe ? baseDir : path.join(baseDir, "dist")

module.exports = {
  esbuildConfig: {
    entryPoints: ["siyuan/index.ts"],
    outfile: path.join(distDir, "index.js"),
    bundle: true,
    format: "cjs",
    external: ["siyuan"],
    define: { "process.env.DEV_MODE": `"${isWatch}"` },
    plugins: [
      stylePlugin(),

      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: "cwd",
        assets: [
          // copy folder
          {
            from: "./siyuan/i18n/*",
            to: [path.join(distDir, "i18n")],
          },
          // copy one file
          {
            from: ["./README.md"],
            to: [path.join(distDir, "/README.md")],
          },
          {
            from: ["./README_zh_CN.md"],
            to: [path.join(distDir, "/README_zh_CN.md")],
          },
          {
            from: ["./preview.png"],
            to: [path.join(distDir, "/preview.png")],
          },
          {
            from: ["./icon.png"],
            to: [path.join(distDir, "/icon.png")],
          },
          {
            from: ["./plugin.json"],
            to: [path.join(distDir, "/plugin.json")],
          },
        ],
        watch: true,
      }),
    ],
  },
}
