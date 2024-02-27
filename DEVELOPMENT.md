# Development

## Prerequisites

```bash
pnpm install
```

## Development

serve

```bash
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
pnpm package
```

artifacts structure

```
├── build
  ├── package.zip
  ├── package-widget.zip
  ├── siyuan-plugin-publisher-1.19.1.zip
  ├── siyuan-publisher-nginx-1.19.1
  ├── sy-post-publisher-chrome-1.19.1.zip
  ├── sy-post-publisher-firefox-1.19.1.zip
  └── sy-post-publisher-widget-1.19.1.zip
```

Note: vercel is also supported via `pnpm vercelBuild`

## Sync to legacy widget repo

```bash
pnpm syncWidgetRepo
```