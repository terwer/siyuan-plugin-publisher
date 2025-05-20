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

### 开发模式

```bash
pnpm makeLink
pnpm dev -F siyuan-plugin-publisher
pnpm dev -F @terwer/share-pro-app
```

## 单元测试

```bash
pnpm test -F siyuan-plugin-publisher
```

## 构建

```bash
pnpm build
```


## 打包

```bash
pnpm package
```


### 打包结构

```
├── build
  ├── package.zip
  ├── siyuan-plugin-blog-5.4.0.zip
```
