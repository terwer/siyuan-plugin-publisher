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

### 启动服务

```bash
pnpm dev -F siyuan-blog
pnpm dev -F @terwer/share-pro-app
```


#### 可用的测试链接

- [http://localhost:4000/share?id=20240408194841-jmgbco2&origin=http://192.168.3.3:6806&isSsr=false](http://localhost:4000/share?id=20240408194841-jmgbco2&origin=http://192.168.3.3:6806&isSsr=false)
- [http://localhost:4000](http://localhost:4000)
- [http://localhost:4000/s/20240408194841-jmgbco2](http://localhost:4000/s/20240408194841-jmgbco2)

### 开发模式

```bash
pnpm makeLink
pnpm build -F siyuan-blog -- --watch
pnpm dev -F @terwer/share-pro-app
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
