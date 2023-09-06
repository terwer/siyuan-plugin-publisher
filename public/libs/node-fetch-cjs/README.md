# Node Fetch CJS

This package is a wrapper for [Node Fetch v3](https://github.com/node-fetch/node-fetch) for commonjs environments.

## Motivation

Since v3, `node-fetch` only provides an `ESM` version of the package.

While this choice is a good choice for the future, it is impacting a lot of codebases built on `commonjs` environment. Some of them could update their code to import `node-fetch` using native `import()` but many could not. This is especially true for `TypeScript` users who cannot mix `commonjs` and `ESM` imports in their projects.

This module bundles `node-fetch` using [esbuild](https://esbuild.github.io) and apply some custom transformations to make sure it works in `commonjs` environments.

**If you are able to migrate to the official v3 release of node-fetch, we highly recommend to use the official node-fetch. This package is built to help users who could not migrate easily.**

*This repository is automatically updated when a new version of node-fetch is released*

## Installation

```bash
$ npm install node-fetch-cjs
```

## Usage

Destructuring export (recommended):
```javascript
const { default: fetch, Headers } = require("node-fetch-cjs");

fetch(/* ... */).then(/* ... */);

const headers = new Headers();
```

Legacy export:
```javascript
const fetch = require("node-fetch-cjs");

fetch.default(/* ... */).then(/* ... */);

const headers = new fetch.Headers();
```

## Full documentation

Full documentation is available on the [node-fetch](https://github.com/node-fetch/node-fetch) repository.

## Differences

In order to be fully CJS compatible, we had to bundle dependencies from `node-fetch` directly into this package.
This means that both `fetch-blob` and `formdata-polyfill` are bundled.

For your convenience, these dependencies are exported to allow you to use them in your code:

```javascript
const { Blob, FormData } = require("node-fetch-cjs");

const blob = new Blob(["content"], { type: "text/plain" });
const text = await blob.text();

const data = new FormData();
data.append("key", "value");
```

## TypeScript

Types are bundled with `node-fetch-cjs`, so you don't need to install any additional packages.

## Acknowledgement

Thanks to [node-fetch/node-fetch](https://github.com/node-fetch/node-fetch) for their work to allow all of us to use `fetch` in Node.JS environments.

## License

[MIT](LICENSE)
