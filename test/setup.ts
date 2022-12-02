import { afterEach, beforeEach } from "vitest"
import fetch from "cross-fetch"
// @ts-expect-error
import { LocalStorage } from "node-localstorage"

// i18n
import { config } from "@vue/test-utils"
import i18n from "../src/locales"

// Add `fetch` polyfill.
// https://markus.oberlehner.net/blog/using-mock-service-worker-with-vitest-and-fetch/
global.fetch = fetch
global.localStorage = new LocalStorage("./test/data/polyfill/localStorage")

// lute
require("../public/lute.min.js")
config.global.plugins = [i18n]

beforeEach(() => {
  console.log("======test is starting...======")
})

afterEach(() => {
  console.log("======finished.================")
})
