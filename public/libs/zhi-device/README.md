# zhi-device

auto check environment whether in browser, browser extension, electron, node and more

## Usage

```ts
import { DeviceDetection, BrowserUtil, DeviceTypeEnum } from "zhi-device"

console.log("isInBrowser=>", BrowserUtil.isInBrowser)

const deviceType: DeviceTypeEnum = DeviceDetection.getDevice()
console.log("deviceType=>", deviceType)

// supported platforms
// Mobile
// Siyuan_Widget
// Siyuan_NewWindow
// Siyuan_MainWindow
// Chrome_Extension
// Chrome_Browser
// Node
```

## Deps

```
## Congregations! zhi-device need no deps, it is just pure js code 🎉
```

## Dev

```bash
pnpm dev -F zhi-device
```

## Build

```bash
pnpm build -F zhi-device
```

## Api

```bash
pnpm doc -F zhi-device
pnpm md -F zhi-device
```

## Test

Execute the unit tests via [vitest](https://vitest.dev)

```bash
pnpm test -F zhi-device
```

## Publish

```bash
pnpm publish -F zhi-device --tag=latest
```