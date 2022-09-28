# sy-post-publisher

Publish siyuan article to supported open platforms

At present, it supports vuepress and two open API standard blog platforms, <code>metaweblog api</code> and <code>
xmlrpc</code> remote call API based on <code>wordpress</code>

Also provide a [common API adaptor](https://github.com/terwer/src-sy-post-publisher/blob/main/src/lib/api.ts) , make
every plantform posiable.

**[Click to see Help doc]()**

**[Click to see config video]()**

## Updates

[Click here to view development progress](https://github.com/users/terwer/projects/1/views/1)

- 0.0.3 key fatures

- [X] #1

[Full changelog](Changelog-en-US.md)

## Support plantforms

* [X] Vuepress

* [X] Cnblog

* [X] Liandi

* [X] Yueque

* [X] Wordpress

* [X] Metaweblog API

## Tool Version

Vue 3 + TypeScript + Vite

| Tool   | Version  |
|--------|----------|
| node   | v16.16.0 |
| yarn   | 1.22.19  |
| vercel | 28.0.1   |
| pm2    | 5.2.0    |

## Environment

**Set up environment variables**

Copy the .env.local.example file in this directory to .env.local (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and set SIYUAN_API_URL to be the URL to your siyuan-note endpoint. For
example: http://127.0.0.1:6806.

Your `.env.local` file should look like this:

```properties
# log level
VITE_LOG_INFO_ENABLED=false
# siyuan api
VITE_SIYUAN_API_URL=http://127.0.0.1:6806
VITE_SIYUAN_CONFIG_TOKEN=
# middlware to support cors, optional
# VITE_MIDDLEWARE_URL=
```

You can also set `.env.development.local`, `.env.production.local`, `.env.test.local` for different modes

See also [Vite .env docs](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)

## Devlopment

setup

```bash
npm i -g yarn
npm i -g vercel
```

dev

```bash
# yarn create vite
yarn
yarn vdev
```

## Deploy

### Build for siyuan widget

```bash
yarn w
```

### Build for chrome extension

```bash
yarn e
```

### Run with pm2

setup

```bash
npm i -g yarn
npm i -g vercel
npm i -g pm2
```

start

```bash
yarn pm2
```

stop

```bash
yarn pm2s
```