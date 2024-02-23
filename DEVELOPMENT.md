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
# siyuan plugin
pnpm makeLink -p siyuan
pnpm dev -p siyuan

# siyuan plugin 
# pnpm makeLink -p widget
# pnpm dev -p widget -t 

# chrome extension

# firefox extension

# nginx
pnpm dev -p nginx -d nginx
```

## Build

```bash
pnpm package
```

artifacts structure

```
├── build
  ├── package-widget.zip
  ├── package.zip
  ├── siyuan-plugin-publisher-1.19.1.zip
  ├── sy-post-publisher-chrome-1.19.1.zip
  ├── sy-post-publisher-edge-1.19.1.zip
  ├── sy-post-publisher-firefox-1.19.1.zip
  └── sy-post-publisher-widget-1.19.1.zip
```

## Sync to legacy widget repo

```bash
pnpm syncWidgetRepo
```