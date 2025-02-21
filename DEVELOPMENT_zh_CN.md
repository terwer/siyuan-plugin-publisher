# 开发指南

## 准备工作

```bash
pnpm install
```


## 使用阿里云私有镜像仓库

```bash
docker pull node:18-alpine
docker images
docker tag a1f1d32cdee7 registry.cn-shenzhen.aliyuncs.com/terwer/dm:node-18-alpine
docker login --username=terwer@aliyun.com registry.cn-shenzhen.aliyuncs.com
docker push registry.cn-shenzhen.aliyuncs.com/terwer/dm:node-18-alpine
```


## 开发

### 启动开发服务器

```bash
pnpm build -F @terwer/publisher-app -- --from siyuan
pnpm build -F siyuan-plugin-publisher
pnpm makeLink
pnpm build -F siyuan-plugin-publisher -- --watch

# http://localhost:6806/plugins/siyuan-blog/app/#/s/20241217142133-o580ytq
# http://localhost:6806/plugins/siyuan-blog/app/#/s/20241217142133-o580ytq?lang=en_US
```

### 构建和链接

```bash
pnpm makeLink
pnpm build -F @terwer/publisher-app -- --from siyuan
pnpm build -F siyuan-plugin-publisher -- --watch
```


## 构建

### 为思源笔记构建

```bash
pnpm build -F @terwer/publisher-app -- --from siyuan
```


### 为 Node.js 构建

```bash
pnpm build -F @terwer/publisher-app -- --from node
# 对于根路径 /
node ./dist/node/server/index.mjs
# 自定义前缀，例如：/publisher
NUXT_APP_BASE_URL=publisher node ./dist/node/server/index.mjs
```


### 为 Vercel 构建

```bash
# 根目录：apps/app
# 构建命令
pnpm vercelBuild
```


### 为 Cloudflare 构建

```bash
# 根目录：apps/app
# 构建命令
pnpm cloudflareBuild
```


## 打包

```bash
pnpm package
```


### 打包后的文件结构

```
├── build
  ├── package.zip
  ├── siyuan-plugin-publisher-2.0.0.zip
```