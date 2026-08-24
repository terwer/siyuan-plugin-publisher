# Halo29 (common_Halo) 调研发现

## 平台与配置口径
- `common_Halo`（`Common_Halo`）是 **Halo API** 平台；`custom_Haloweb`（#28）是网页 Cookie。两套适配器，分别验收。本计划只做 common_Halo。
- `src/adaptors/api/halo/HaloConfig.ts`：`pageType=Html`；`previewUrl=/archives/{slug}`（模板，可改 `allowPreviewUrlChange=true`）；`usernameEnabled=true`；`knowledgeSpaceEnabled=false`；`tagEnabled=true`；`cateEnabled=true`；`categoryType=CategoryType_Multi`；`allowCateChange=true`；`showTokenTip=false`。
- **鉴权 = HTTP Basic**：`HaloApiAdaptor.haloFetch` / `haloFormFetch` 用 `Authorization: Basic base64(username:password)`（`username`+`password`，非 Bearer Token）。V2C = 填 username + password。
- **postid 键**：`getHaloPostidKey(postid)` 从 postid 解析 `{name,slug,year,month,day}`；`getPreviewUrl` 用 previewUrl 模板替换 `{slug}/{name}/{year}/{month}/{day}`。
- **发布链路**：`addPost` 先 `POST /apis/api.console.halo.run/v1alpha1/posts` 建草稿（kind=Post, apiVersion=content.halo.run/v1alpha1），再 `PUT .../posts/{name}/publish` 发布；`editPost`=更新 post+content+再 publish；`deletePost`=`PUT .../posts/{name}/recycle`（进回收站）。
- **Img**：`newMediaObject` 走 `POST /apis/api.console.halo.run/v1alpha1/attachments/upload`（multipart，`haloFormFetch` Basic 鉴权）；配置 `picbedService='bundled'`、`bundledPicbedSupported=true`、`imageStorePath='images'` → 图片直传 Halo attachments（bundled）。

## 配置持久化（dev/public `sy-p-plus-cfg.json` 的 `common_Halo`）
- `home=apiUrl=http://localhost:8092`，`username='terwer'`，`passwordType=0`，`password`=（本地默认口令，不入库），`blogid='test-classification-2rg8ql'`（分类 slug「测试分类」），`blogName='测试分类'`，`apiStatus=true`（陈旧，实例未运行时无意义），`previewUrl='/archives/{slug}'`，`pageType='html'`，`picbedService='bundled'`。
- ⚠️ 这份配置**与实际 halo 实例端口不符**（实例 docker 在 **8090**，配置写 8092），且 password 是占位符。验证前需把 home/apiUrl 改为 8090 并填真实凭证。

## 实例与基础设施（阶段 0 阻塞复盘）
- Halo 实例位置：`/Volumes/workspace/docker/halo2-docker/docker-compose-halo29.yml` → `halohub/halo:2.9`（容器名 `halo`，端口 **8090**, external-url http://localhost:8090/）+ `mysql:8.0.31`（容器名 `halodb`，端口 **3310**）。`haltock 8092` 不存在。
- **镜像未本地缓存**（`docker images` 无 halo/mysql:8）。初始 `docker compose up` 因 registry-1.docker.io 网络不通拉取失败。
- **国内 mirror** `docker.1panel.live`/`dockerproxy.net` 直连可达（200）；但 `docker pull docker.1panel.live/halohub/halo:2.9` 长时间未完成（慢/可能被节流），放弃。
- **hiddify 代理在 127.0.0.1:12334**（用户确认）；经该代理可到 registry-1.docker.io（401=正常）。已写 `~/.docker/daemon.json`（`proxies.http/https-proxy=127.0.0.1:12334`，no-proxy=localhost,127.0.0.1,127.0.0.1:53180），并重启 Docker Desktop（当时无运行容器，安全）。用代理拉 `halohub/halo:2.9` + `mysql:8.0.31`。
- Halo 数据：`halo2/` 有 attachments/indices/keys/logs/plugins/themes（无 application.yaml）；`mysql/` 97M（前实例的 Halo DB，含用户/文章数据）。启动 halo:2.9 会复用该 DB。

## 待定 / 风险
- **Basic 鉴权是否被 Halo 2.9 Console API 接受**：Halo 2.x 官方常用 PAT(Bearer)，而适配器用 Basic `username:password`。需实例起来后实测 `checkAuth()`（`api.checkAuth()` → 配置页「验证」）。若 Basic 不被接受 → 需按 Halo 2.9 实际鉴权（PAT/Bearer）修适配器（这正是验证要发现/修复的）。
- **admin 凭证**：实例数据来自前次运行；若需创建/获取 PAT 或 admin 口令，注意不要写死密钥。common_Halo 配置里的 password 是本地默认口令（不入库），需替换为能被 Halo 2.9 Console API 接受的凭证。

## 鉴权与实例实测（2026-08-24，突破）
- **Halo 2.9 Console API 接受 HTTP Basic**：`Authorization: Basic base64(username:password)`。实测 `admin:<口令>`（本地测试实例默认口令，值不写入本 git-tracked 计划）→ `/apis/api.console.halo.run/v1alpha1/users` 返回 **200**。→ 适配器的 `haloFetch` Basic 鉴权**可用**，无需改适配器。
- **正确用户名 = `admin`**（`/registry/users/admin`，displayName=Administrator）；存储配置里 username=`terwer` 是错的，应改 `admin`。
- 实例：`halohub/halo:2.9` + `mysql:8.0.31` 经 `dockerproxy.net` mirror 拉取并 retag 后 `compose -f docker-compose-halo29.yml up -d` 启动；`halo` 容器 8090 ready（/actuator/health/readiness HTTP 200），`halodb` 3310 healthy。数据为先前已初始化实例（427 条 extensions，含 posts/categories/snapshots）。
- **test 工作空间 common_Halo 未配置**（全空）→ 宿主上需从零填写：home/apiUrl=`http://localhost:8090`、username=`admin`、password=默认口令、选择分类。
- 镜像通路（供复用）：Docker Desktop 忽略 daemon.json 的 proxy/mirror；**把 mirror 作为 registry 全名** `docker pull dockerproxy.net/halohub/halo:2.9` + `docker tag` 可行（Desktop 透明代理→宿主机→mirror 可达）。
- `validatePublish()` 对 Halo 走基类返回 `{canPublish:true}`（无真实 API 调用）→ V2C「验证」的 `canPublish` 主要由 `dynCfg.isAuth` 决定；但 **Pub/Upd/Del 的 addPost/editPost 会真实打 Halo API**（Basic 鉴权），所以 Creds 必须真实有效，否则发布失败。
