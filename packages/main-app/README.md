# @siyuan-publisher/main-app

Main application for SiYuan Publisher.

[中文文档](./README_zh_CN.md)

## Features

- Modern Vue 3 application
- Responsive design
- Plugin management interface
- Platform configuration
- Content publishing workflow
- Dual build modes: SPA and SiYuan Plugin

## Development

```bash
# Install dependencies
pnpm install

# Start development server (SPA mode)
pnpm dev

# Build for production (SPA mode)
pnpm build

# Development with watch mode (SiYuan Plugin mode)
pnpm dev:siyuan

# Build for SiYuan Plugin
pnpm build:siyuan

# Preview production build (SPA mode)
pnpm preview
```

## Build Modes

### SPA Mode (Default)
The default build mode creates a standard Single Page Application (SPA) build. This mode is suitable for:
- Development and testing
- Standalone web application deployment
- Integration with other web platforms

### SiYuan Plugin Mode
The plugin mode creates a build specifically for SiYuan plugin integration. This mode:
- Generates CommonJS format output
- Includes necessary plugin files (README, LICENSE, icon, etc.)
- Supports Node.js polyfills for browser environment
- Enables watch mode for development

The plugin mode uses a separate Vite configuration file (`vite.siyuan.config.ts`) to handle plugin-specific build requirements.

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── views/         # Page components
  ├── composables/   # Vue composables
  ├── assets/        # Static assets
  ├── App.vue        # Root component
  ├── index.ts       # Plugin entry (SiYuan Plugin mode)
  └── main.ts        # Application entry (SPA mode)
```

## Building

The application is built using Vite. The build process:

1. Compiles TypeScript
2. Bundles Vue components
3. Processes assets
4. Generates production build

### Build Configuration
- SPA Mode:
  - ES modules output
  - Code splitting with manual chunks
  - Terser minification
  - Source maps enabled

- Plugin Mode:
  - CommonJS output
  - Node.js polyfills
  - Static file copying
  - Conditional minification based on watch mode
  - Custom file naming for plugin compatibility

## Development

The development server includes:

- Hot Module Replacement (HMR)
- TypeScript support
- Vue DevTools integration
- Error overlay

## License

MIT 