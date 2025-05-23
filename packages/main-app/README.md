# @siyuan-publisher/main-app

Main application for SiYuan Publisher.

[中文文档](./README_zh_CN.md)

## Features

- Modern Vue 3 application
- Responsive design
- Plugin management interface
- Platform configuration
- Content publishing workflow

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── views/         # Page components
  ├── composables/   # Vue composables
  ├── assets/        # Static assets
  ├── App.vue        # Root component
  └── main.ts        # Application entry
```

## Building

The application is built using Vite. The build process:

1. Compiles TypeScript
2. Bundles Vue components
3. Processes assets
4. Generates production build

## Development

The development server includes:

- Hot Module Replacement (HMR)
- TypeScript support
- Vue DevTools integration
- Error overlay

## License

MIT 