import {afterAll, afterEach, beforeAll} from 'vitest';
import fetch from 'cross-fetch';
// @ts-ignore
import {LocalStorage} from "node-localstorage";

// Add `fetch` polyfill.
// https://markus.oberlehner.net/blog/using-mock-service-worker-with-vitest-and-fetch/
global.fetch = fetch;
global.localStorage = new LocalStorage('./test/data/polyfill/localStorage');

beforeAll(() => {
    console.log("vitest beforeAll")
})

afterAll(() => {
    console.log("vitest afterAll")
});

afterEach(() => {
    console.log("vitest afterEach")
});