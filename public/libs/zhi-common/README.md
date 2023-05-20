# zhi-common

a collection of util tools

## Usage

```ts
import { zhiCommon } from "zhi-common"

const dateUtil = zhiCommon.dateUtil
const now = dateUtil.nowDateZh()
console.log("now=>", now)
```

## Deps

```
├── zhi-device
├── zhi-env
├── zhi-log
├── lute
├── showdown
├── compare-versions
├── ajv
```

## Dev

```bash
pnpm dev -F zhi-common
```

## Build

```bash
pnpm build -F zhi-common
```

## Test

Execute the unit tests via [vitest](https://vitest.dev)

```bash
pnpm test -F zhi-common
```

## Publish

```bash
pnpm publish -F zhi-common --tag latest
```