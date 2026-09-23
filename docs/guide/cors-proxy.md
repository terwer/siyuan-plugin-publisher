# CORS 代理配置

部分平台在浏览器环境下受同源策略限制，需要经过一个中间服务器（CORS 代理）转发请求。

## 为什么需要

思源的运行环境分两类：

| 环境 | 是否有 CORS 限制 |
|---|---|
| **Node 环境**（桌面端 Electron）：Windows、Linux、macOS | 无限制 |
| **纯浏览器环境**：Docker 版、Android、iOS、浏览器访问 | **有限制** |

浏览器有 CORS 限制是 Web 标准的要求，为了安全。插件有些平台的部分接口会触碰到它，于是需要一层代理：先把请求发给中间服务器（后端环境，本身不受 CORS 限制），由它转发并把结果返回。

::: warning Docker 版与浏览器访问必须配置
受 CORS 策略限制，**Docker 版本**以及 Android、iOS、浏览器等环境**必须设置 CORS 代理**，否则大部分平台无法使用。桌面端通常不需要。
:::

## 新代理支持什么

插件 1.20.0 起使用的新版代理支持：

- 全局跨域请求
- 绕过浏览器限制的请求头（如 `origin`、`referer`）
- 请求体支持 FormData 等二进制格式

::: tip 需要 FormData 的场景
图片上传依赖 FormData，因此**必须**用新版代理。旧代理（1.20.0 之前）只能传字符串，无法解决图片上传，Telegraph 这类平台也走不通。
:::

## 部署方式一：Cloudflare Workers（推荐）

只需要一个自己的域名。

1. 注册并登录 [Cloudflare](https://www.cloudflare-cn.com/)。
2. 解压部署包，安装依赖：

   ```bash
   npm i -g pnpm
   pnpm install
   ```

3. 部署：

   ```bash
   pnpm deploy
   ```

   过程中会要求登录 Cloudflare 账号。

4. 在 **Dashboard → Workers 和 Pages** 里找到刚创建的 Worker：

   ![在 Workers 和 Pages 里找到创建的 Worker](/images/shots/cors-workers.webp)

5. 进入该项目，切到**触发器**页签，添加自定义域，指向你自己的域名（注意配置 CNAME 解析）：

   ![在触发器页签添加自定义域](/images/shots/cors-triggers.webp)

6. 等待生效后，把该域名填进插件的「跨域代理地址」。

## 部署方式二：自有服务器

需要自备 Node 环境：

```bash
npm i -g pnpm
pnpm install
node index.js
```

启动后把服务地址填进插件的「跨域代理地址」。

## 填写位置

- 平台级：设置 → 账号设置 → 对应平台的配置页 → **跨域代理地址**
- 全局：设置 → 偏好设置

## 常见问题

### 填了代理地址仍然失败

1. 先在浏览器直接打开代理地址，确认服务本身可访问。
2. 确认地址**带协议**（`https://` 或 `http://`）且**不含末尾斜杠**。
3. 代理部署在本机时，注意 Docker 版思源里的 `localhost` 指向容器自身，需要改用宿主机地址。

### 可以用公共代理吗

不建议。公共代理能看到你发出的全部请求内容，包括平台凭据。请使用自己部署或可信来源的代理。

### 桌面端也需要吗

通常不需要。桌面端是 Node 环境，没有 CORS 限制。个别平台因自身策略需要走代理时，插件会在配置页提示。