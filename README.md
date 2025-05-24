# SiYuan Publisher 🚀

> A plugin-based publishing tool for SiYuan Note that makes publishing to multiple platforms a breeze.

[中文文档](./README_zh_CN.md)

## ✨ Features

- 🔌 **Plugin System** - Extend functionality through a robust plugin architecture
- 🎯 **Multi-platform Publishing** - Publish to various platforms with a unified interface
- 🎨 **Modern UI** - Built with Vue 3 for a smooth user experience
- 🛡️ **Type Safety** - Fully typed with TypeScript for better development experience
- 📦 **Modular Design** - Highly modular architecture for better maintainability
- 🔄 **Hot Reload** - Instant feedback during development
- 📱 **Responsive** - Works seamlessly across different devices

## Quick Start

```bash
# Install dependencies
pnpm install

# Build dependencies (excluding main-app)
pnpm build --filter=\!@siyuan-publisher/main-app

# Start development server (SPA mode)
pnpm dev -F @siyuan-publisher/main-app

# For SiYuan Plugin mode:
# 1. Start SiYuan Note PC client
# 2. Create symlinks for development (will prompt to remove existing plugin if found)
pnpm makeLink
# 3. Start development server
pnpm dev:siyuan -F @siyuan-publisher/main-app
```

## Project Structure

This is a monorepo project using pnpm workspaces. The project is organized as follows:

```
packages/
  ├── core/           # Core functionality and interfaces
  ├── ui/             # Shared UI components
  ├── plugin-system/  # Plugin system implementation
  ├── platform-adapters/ # Platform-specific adapters
  └── main-app/       # Main application
```

## Development

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Development Workflow

1. Install dependencies:
```bash
pnpm install
```

2. Build dependencies:
```bash
# Build all dependencies (excluding main-app)
pnpm build --filter=\!@siyuan-publisher/main-app

# Or build specific dependencies
pnpm build -F @siyuan-publisher/core
pnpm build -F @siyuan-publisher/ui
pnpm build -F @siyuan-publisher/plugin-system
pnpm build -F @siyuan-publisher/platform-adapters
```

3. Start development server:

#### SPA Mode
For standalone web application development:
```bash
pnpm dev -F @siyuan-publisher/main-app
```

#### SiYuan Plugin Mode
For SiYuan plugin development:
```bash
# 1. Start SiYuan Note PC client
# 2. Create symlinks for development (will prompt to remove existing plugin if found)
pnpm makeLink

# 3. Start development server
pnpm dev:siyuan -F @siyuan-publisher/main-app
```

### Build Modes

The main application supports two build modes:

#### SPA Mode (Default)
- Standard web application build
- Suitable for development and testing
- Uses default Vite configuration
- Build command: `pnpm build -F @siyuan-publisher/main-app`

#### SiYuan Plugin Mode
- Builds as a SiYuan plugin
- Includes plugin-specific files and configurations
- Uses separate Vite configuration (`vite.siyuan.config.ts`)
- Requires symlinks for development (`pnpm makeLink`)
- Requires SiYuan Note PC client to be running
- Build command: `pnpm build:siyuan -F @siyuan-publisher/main-app`

### Available Scripts

```bash
# Build all packages (including main-app)
pnpm build

# Build only dependencies (excluding main-app)
pnpm build --filter=\!@siyuan-publisher/main-app

# Build specific packages
pnpm build -F @siyuan-publisher/core
pnpm build -F @siyuan-publisher/ui
pnpm build -F @siyuan-publisher/plugin-system
pnpm build -F @siyuan-publisher/platform-adapters
pnpm build -F @siyuan-publisher/main-app

# Build main-app in SiYuan plugin mode
pnpm build:siyuan -F @siyuan-publisher/main-app

# Create symlinks for development (required for plugin mode)
# Note: Will prompt to remove existing plugin if found
pnpm makeLink

# Run tests
pnpm test

# Run linting
pnpm lint
```

## License

MIT 