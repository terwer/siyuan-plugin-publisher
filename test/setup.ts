import {afterAll, afterEach, beforeAll, beforeEach} from 'vitest';
import fetch from 'cross-fetch';
// @ts-ignore
import {LocalStorage} from "node-localstorage";

// Add `fetch` polyfill.
// https://markus.oberlehner.net/blog/using-mock-service-worker-with-vitest-and-fetch/
global.fetch = fetch;
global.localStorage = new LocalStorage('./test/data/polyfill/localStorage');

// lute
require("../public/lute.min.js")

// i18n
import { config } from "@vue/test-utils"
import i18n from "../src/locales";
config.global.plugins = [i18n]

beforeEach(() => {
    console.log("======test is starting...======")
})

afterEach(() => {
    console.log("======finished.================")
});