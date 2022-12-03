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
require("~/public/lib/lute.min")

// i18n
config.global.plugins = [i18n]

beforeEach(() => {
  console.log("======test is starting...======")
})

afterEach(() => {
  console.log("======test is finished.========")
})
