# zhi-siyuan-api

a siyuan-note api including both kernel and client

## Usage

```js
import { SiyuanKernelApi } from "zhi-siyuan-api"

const siyuanConfig = new SiyuanConfig("http://127.0.0.1:6806", "")
const kernelApi = new SiyuanKernelApi(siyuanConfig)
const result = await kernelApi.lsNotebooks()
console.log("result=>", result)
```

## Deps

```
├── zhi-env
├── zhi-log
├── zhi-common
├── zhi-blog-api
```

## Dev

```bash
pnpm dev -F zhi-siyuan-api
```

## Build

```bash
pnpm build -F zhi-siyuan-api
```

## Test

Execute the unit tests via [vitest](https://vitest.dev)

```bash
pnpm test -F zhi-siyuan-api
```

## Publish

```bash
pnpm publish -F zhi-siyuan-api --tag latest
```