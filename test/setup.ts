/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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

import { afterEach, beforeEach } from "vitest"
import fetch from "cross-fetch"
import { LocalStorage } from "node-localstorage"

import { config } from "@vue/test-utils"
import i18n from "~/locales/index"

// Add `fetch` polyfill.
// https://markus.oberlehner.net/blog/using-mock-service-worker-with-vitest-and-fetch/
global.fetch = fetch
global.localStorage = new LocalStorage("./test/data/polyfill/localStorage")

// lute
require("~/public/lib/lute/lute.min")

// i18n
config.global.plugins = [i18n]

beforeEach(() => {
  console.log("======test is starting...======")
})

afterEach(() => {
  console.log("======test is finished.========")
})
