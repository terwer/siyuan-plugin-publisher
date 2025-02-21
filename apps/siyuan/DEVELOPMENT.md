# Development

## Prerequisites

```bash
pnpm install
```

## Using aliyun private image repo

```bash
docker pull node:18-alpine
docker images
docker tag a1f1d32cdee7 registry.cn-shenzhen.aliyuncs.com/terwer/dm:node-18-alpine
docker login --username=terwer@aliyun.com registry.cn-shenzhen.aliyuncs.com
docker push registry.cn-shenzhen.aliyuncs.com/terwer/dm:node-18-alpine
```

## Development

serve

```bash
pnpm dev -F siyuan-blog
pnpm dev -F @terwer/share-pro-app

# available links for serve test
# http://localhost:4000/share?id=20240408194841-jmgbco2&origin=http://192.168.3.3:6806&isSsr=false
#
# http://localhost:4000
# http://localhost:4000/s/20240408194841-jmgbco2
```

dev

```bash
pnpm makeLink
pnpm build -F siyuan-blog -- --watch
pnpm dev -F @terwer/share-pro-app
```

## Build

```bash
pnpm build
```

## Package

```bash
pnpm package
```

artifacts structure

```
├── build
  ├── package.zip
  ├── siyuan-plugin-blog-5.4.0.zip
```