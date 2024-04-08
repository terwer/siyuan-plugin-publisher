/*
 * Copyright (c) 2023-2024, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

const path = require("path")
const minimist = require("minimist")
const stylePlugin = require("esbuild-style-plugin")
const { copy } = require("esbuild-plugin-copy")

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w || false
const distDir = "./dist"

module.exports = {
  esbuildConfig: {
    entryPoints: ["siyuan/index.ts"],
    outfile: "dist/index.js",
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
