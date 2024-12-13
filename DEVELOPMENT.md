# Development

## Prerequisites

```bash
brew install n
sudo n 18
brew install corepack
corepack enable pnpm
corepack use pnpm@9.15.0

pnpm install
```

## Development

serve

```bash
pip install --upgrade setuptools
pnpm serve
```

dev

```bash
pnpm dev -p siyuan
# siyuan plugin
# -d 默认 dist
# -t 默认 plugin
pnpm makeLink -p siyuan

# -d 默认 widget
pnpm dev -p widget
# siyuan widget 
pnpm makeLink -p widget -d widget -t widget

# chrome extension
# -d 默认 chrome，实际地址是：extension/extension
pnpm dev -p chrome

# firefox extension
# -d 默认 firefox，实际地址是：extension/firefox
pnpm dev -p firefox

# nginx
# -d 默认 nginx
pnpm dev -p nginx
# ================================================
# serve nginx
cd ./nginx
# npm i -g serve
serve -l 9000 -C
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
  ├── package-widget.zip
  ├── siyuan-plugin-publisher-1.23.5.zip
  ├── siyuan-publisher-nginx-1.23.5
  ├── sy-post-publisher-chrome-1.23.5.zip
  ├── sy-post-publisher-firefox-1.23.5.zip
  └── sy-post-publisher-widget-1.23.5.zip
```

Note: vercel is also supported via `pnpm vercelBuild`

## Sync to legacy widget repo

```bash
pnpm syncWidgetRepo
```