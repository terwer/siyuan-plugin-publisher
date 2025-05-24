# SiYuan Publisher Development Guide

## Architecture Overview

SiYuan Publisher adopts a modular architecture and centralizes all shared type definitions in a dedicated `common` package. This design effectively avoids circular dependencies and improves maintainability.

### Directory Structure

```
packages/
  common/                # Shared type definitions (type/interface/enum only)
  core/                  # Core business logic
  plugin-system/         # Plugin management and loading
  platform-adapters/     # Third-party platform adapters
  main-app/              # Main application
  ui/                    # Frontend UI components
```

## Core Components and Call Chain

### 1. Plugin System Initialization Flow

```mermaid
sequenceDiagram
    actor A as App
    actor B as PS
    actor C as PAR
    actor D as PM
    actor E as PAM

    A->>B: Initialize Plugin System
    B->>C: Get Built-in Adapters
    C->>C: Register Built-in Adapters
    C-->>B: Return Adapter List
    B->>D: Register Plugins
    B->>E: Update Adapter List
    E-->>A: Return Available Platforms
```

### 2. Platform Adapter Registration Mechanism

```mermaid
graph TD
    A[Default Platform Adapter Registry] --> B[WordPress Adapter]
    A --> C[GitHub Adapter]
    B --> D[Plugin Manager]
    C --> D
    D --> E[Platform Adapter Manager]
    E --> F[UI Components]
```

### 3. Publishing Process

```mermaid
sequenceDiagram
    actor A as User
    actor B as UI
    actor C as PS
    actor D as PA
    actor E as Platform

    A->>B: Select Platform
    B->>C: Get Platform Config
    C-->>B: Return Config Component
    A->>B: Fill Config
    B->>C: Test Connection
    C->>D: Validate Config
    D->>E: Test Connection
    E-->>D: Return Result
    D-->>C: Return Result
    C-->>B: Show Result
    A->>B: Publish Content
    B->>C: Send Publish Request
    C->>D: Process Publish
    D->>E: Publish Content
    E-->>D: Return Result
    D-->>C: Return Result
    C-->>B: Show Result
```

## Detailed Component Description

### 1. Plugin System

The plugin system is the core of the application, responsible for managing all platform adapters and plugins.

#### Main Components:

- **Plugin Manager**: Manages plugin lifecycle
  ```typescript
  class PluginManager {
    registerPlugin(plugin: Plugin): Promise<void>
    unloadPlugin(id: string): Promise<void>
    getPlugin(id: string): Plugin | undefined
    getAllPlugins(): Plugin[]
  }
  ```

- **Platform Adapter Manager**: Manages platform adapters
  ```typescript
  class PlatformAdapterManager {
    getAdapter(id: string): PlatformAdapter | undefined
    getAllAdapters(): PlatformAdapter[]
    connectAdapter(id: string, config: any): Promise<void>
    disconnectAdapter(id: string): Promise<void>
  }
  ```

### 2. Platform Adapters

Platform adapters implement integration with specific platforms.

#### Built-in Adapters:

- **WordPress Adapter**
  ```typescript
  class WordPressAdapter implements PlatformAdapter {
    id = "wordpress"
    type = "wordpress"
    async connect(config: WordPressConfig): Promise<void>
    async publish(post: Post, options: PublishOptions): Promise<PublishResult>
  }
  ```

- **GitHub Adapter**
  ```typescript
  class GitHubAdapter implements PlatformAdapter {
    id = "github"
    type = "github"
    async connect(config: GitHubConfig): Promise<void>
    async publish(post: Post, options: PublishOptions): Promise<PublishResult>
  }
  ```

#### External Adapters:

External platform adapters can be dynamically loaded through the plugin system, supporting installation from NPM or local loading. For detailed development guidelines and loading mechanisms, please refer to the [External Plugin Development](#external-plugin-development) section.

Key Features:
- Support dynamic loading and unloading
- Can be developed and published independently
- Uses the same interface as built-in adapters
- Can extend support for new platforms

### 3. Main App

The main application is built with Vue 3 and provides the user interface and interaction logic.

#### Main Components:

- **Publish.vue**: Publishing page
  ```vue
  <template>
    <div class="publish">
      <!-- Platform Selection -->
      <select v-model="selectedPlatform">
        <option v-for="platform in availablePlatforms" :key="platform.id" :value="platform.id">
          {{ platform.name }}
        </option>
      </select>

      <!-- Platform Configuration -->
      <component 
        :is="platformConfigComponent" 
        v-model:config="platformConfig" 
        @test="testConnection"
      />
    </div>
  </template>
  ```

## Configuration Process

### 1. Platform Configuration

```mermaid
graph TD
    A[Select Platform] --> B[Load Config Component]
    B --> C[Fill Config]
    C --> D[Test Connection]
    D --> E{Connection Success?}
    E -->|Yes| F[Save Config]
    E -->|No| G[Show Error]
    G --> C
```

### 2. Publishing Configuration

```mermaid
graph TD
    A[Select Platform] --> B[Fill Article Info]
    B --> C[Select Publish Status]
    C --> D[Publish Article]
    D --> E{Publish Success?}
    E -->|Yes| F[Show Success Info]
    E -->|No| G[Show Error]
    G --> B
```

## Error Handling

### Error Types

```typescript
enum ErrorType {
  PLATFORM_CONNECTION_FAILED = "PLATFORM_CONNECTION_FAILED",
  PLATFORM_CONFIG_INVALID = "PLATFORM_CONFIG_INVALID",
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  INVALID_CONFIG = "INVALID_CONFIG",
  PUBLISH_FAILED = "PUBLISH_FAILED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}
```

### Error Handling Process

```mermaid
sequenceDiagram
    actor A as UI
    actor B as PS
    actor C as PA
    actor D as Error

    A->>B: Execute Operation
    B->>C: Call Adapter
    C->>D: Error Occurs
    D->>C: Convert Error Type
    C-->>B: Return Error
    B-->>A: Show Error Message
```

## Development Guidelines

### 1. Adding New Platform Adapters

1. Create new adapter in `platform-adapters` package
2. Implement `PlatformAdapter` interface
3. Register adapter in `DefaultPlatformAdapterRegistry`
4. Create corresponding configuration component

### 2. Modifying Existing Adapters

1. Find target adapter in `platform-adapters` package
2. Modify adapter implementation
3. Update configuration component
4. Test adapter functionality

### 3. External Plugin Loading

1. **Plugin Directory Structure**
   ```
   plugins/
   ├── my-platform-plugin/
   │   ├── package.json
   │   ├── src/
   │   │   ├── index.ts
   │   │   ├── adapter.ts
   │   │   └── config.vue
   │   └── dist/
   └── other-plugin/
   ```

2. **Plugin Loading Process**
   ```typescript
   class ExternalPluginLoader {
     async loadPlugin(path: string): Promise<ExternalPlugin> {
       // 1. Load plugin configuration
       const manifest = await this.loadManifest(path);
       
       // 2. Validate plugin type
       if (manifest.type !== "platform-adapter") {
         throw new Error("Unsupported plugin type");
       }
       
       // 3. Load plugin code
       const plugin = await import(manifest.entry);
       
       // 4. Initialize plugin
       await plugin.initialize();
       
       return plugin;
     }
   }
   ```

3. **Plugin Configuration Example**
   ```json
   {
     "name": "my-platform-plugin",
     "version": "1.0.0",
     "main": "dist/index.js",
     "siyuan-publisher": {
       "type": "platform-adapter",
       "platform": "my-platform",
       "entry": "./dist/index.js",
       "dependencies": {
         "@siyuan-publisher/common": "^1.0.0"
       }
     }
   }
   ```

4. **Plugin Interface Definition**
   ```typescript
   interface ExternalPlugin {
     id: string;
     name: string;
     version: string;
     type: "platform-adapter";
     platform: string;
     adapter: PlatformAdapter;
     configComponent?: Component;
     initialize(): Promise<void>;
     unload(): Promise<void>;
   }
   ```

5. **Plugin Loading Mechanism**
   - Scan plugin directory on application startup
   - Validate plugin configuration and dependencies
   - Dynamically load plugin code
   - Initialize plugin and register with system
   - Update UI to show available plugins

6. **Plugin Development Notes**
   - Ensure correct plugin configuration
   - Implement required interface methods
   - Handle dependencies
   - Provide error handling
   - Support dynamic loading and unloading

7. **Debugging Tips**
   - Use Vue DevTools to debug UI components
   - Use browser console to check network requests
   - Check plugin system logs
   - Verify platform adapter configuration

## Best Practices

1. **Type Safety**
   - Always use TypeScript types
   - Avoid using `any` type
   - Use interfaces to define data structures

2. **Error Handling**
   - Use unified error types
   - Provide detailed error messages
   - Implement appropriate error recovery mechanisms

3. **Configuration Management**
   - Validate all configuration inputs
   - Provide default values
   - Save user configurations

4. **Testing**
   - Write unit tests
   - Test error scenarios
   - Verify platform integration

## Common Issues

1. **Platform Adapter Not Showing**
   - Check adapter registration
   - Verify configuration component
   - Check console errors

2. **Configuration Save Failed**
   - Check configuration validation
   - Verify storage mechanism
   - Check error logs

3. **Publishing Failed**
   - Check platform connection
   - Verify publish parameters
   - Check platform error messages

## Plugin System Architecture

### Plugin Types

1. **Built-in Platform Adapters**
   - Pre-installed with the application
   - Implemented in `packages/platform-adapters`
   - Automatically registered on startup
   - Examples: WordPress, GitHub adapters

2. **External Plugins**
   - Dynamically loaded at runtime
   - Can be installed from NPM or local files
   - Must implement required interfaces
   - Can extend functionality or add new platforms

### Plugin Loading Process

1. **Built-in Adapters**
   ```
   Application Start
   ├── Plugin System Initialization
   │   └── Register Built-in Adapters
   │       ├── WordPress Adapter
   │       └── GitHub Adapter
   └── Initialize Adapters
       └── Update UI State
   ```

2. **External Plugins**
   ```
   Plugin Loading Request
   ├── Validate Plugin Type
   ├── Load Plugin Configuration
   ├── Initialize Plugin
   │   ├── Check Dependencies
   │   └── Register with System
   └── Update UI State
   ```

### External Plugin Development

1. **Plugin Structure**
   ```
   my-platform-plugin/
   ├── package.json        # Plugin configuration
   ├── src/
   │   ├── index.ts       # Entry file
   │   ├── adapter.ts     # Platform adapter implementation
   │   └── config.vue     # Configuration component
   └── dist/              # Build output
   ```

2. **Plugin Configuration**
   ```json
   {
     "name": "my-platform-plugin",
     "version": "1.0.0",
     "main": "dist/index.js",
     "siyuan-publisher": {
       "type": "platform-adapter",
       "platform": "my-platform",
       "entry": "./dist/index.js"
     }
   }
   ```

3. **Plugin Interface**
   ```typescript
   interface ExternalPlugin {
     id: string;
     name: string;
     version: string;
     type: "platform-adapter";
     platform: string;
     adapter: PlatformAdapter;
     configComponent?: Component;
   }
   ```

4. **Plugin Loader**
   ```typescript
   class ExternalPluginLoader {
     async loadPlugin(path: string): Promise<ExternalPlugin> {
       // 1. Load plugin configuration
       const manifest = await this.loadManifest(path);
       
       // 2. Validate plugin type
       if (manifest.type !== "platform-adapter") {
         throw new Error("Unsupported plugin type");
       }
       
       // 3. Load plugin code
       const plugin = await import(manifest.entry);
       
       // 4. Initialize plugin
       await plugin.initialize();
       
       return plugin;
     }
   }
   ```

### Plugin Packaging and Publishing

1. **Build Configuration**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       lib: {
         entry: "src/index.ts",
         formats: ["es"],
         fileName: "index"
       },
       rollupOptions: {
         external: ["@siyuan-publisher/common"]
       }
     }
   });
   ```

2. **Publishing to NPM**
   ```bash
   # 1. Build plugin
   npm run build
   
   # 2. Publish to NPM
   npm publish
   ```

3. **Local Installation**
   ```bash
   # 1. Build plugin
   npm run build
   
   # 2. Copy to plugins directory
   cp -r dist/ /path/to/plugins/my-platform-plugin/
   ```

### Plugin Loading Mechanism

```mermaid
sequenceDiagram
    actor A as App
    actor B as PS
    actor C as EL
    actor D as Plugin

    A->>B: Initialize Plugin System
    B->>C: Scan Plugin Directory
    C->>C: Read Plugin Config
    C->>D: Load Plugin Code
    D-->>C: Return Plugin Instance
    C-->>B: Register Plugin
    B-->>A: Update Available Plugins
```

## UI Development Guidelines

### 1. Style System

#### Directory Structure
```
src/
├── styles/
│   ├── base/              # 基础样式
│   │   ├── variables.styl # 变量定义
│   │   ├── mixins.styl    # 混入函数
│   │   └── reset.styl     # 样式重置
│   ├── components/        # 组件样式
│   │   ├── button.styl
│   │   └── ...
│   └── global.styl        # 全局样式
```

#### Style Rules
1. **顶层容器**
   - 所有组件必须使用 `#publisherApp` 作为顶层容器
   - 禁止直接使用 CSS 选择器

2. **命名规范**
   - 组件类名使用 `pt-` 前缀
   - 遵循 BEM 命名规范
   - 示例：`pt-btn`、`pt-btn--primary`、`pt-btn__icon`

3. **样式实现**
   - 使用 Stylus 简易语法
   - 禁止使用其他 CSS 预处理器
   - 禁止使用内联样式
   - 禁止使用第三方 UI 组件库

4. **变量使用**
   - 所有颜色、尺寸、间距等必须使用变量
   - 变量定义在 `variables.styl` 中
   - 禁止使用硬编码值

5. **组件开发**
   - 严格遵循 Ant Design 设计规范
   - 组件样式必须模块化
   - 组件样式必须可配置
   - 组件样式必须支持主题定制

### 2. Component Development

#### Basic Rules
1. **组件结构**
   ```vue
   <template>
     <div id="publisherApp">
       <div class="pt-component">
         <!-- 组件内容 -->
       </div>
     </div>
   </template>
   ```

2. **样式导入**
   ```vue
   <style lang="stylus">
   @import '../styles/components/component.styl'
   </style>
   ```

3. **类型定义**
   ```typescript
   interface ComponentProps {
     // 组件属性定义
   }
   ```

#### Component Types
1. **基础组件**
   - Button
   - Input
   - Select
   - Switch
   - Checkbox
   - Radio

2. **布局组件**
   - Grid
   - Layout
   - Space
   - Divider

3. **数据展示**
   - Table
   - List
   - Card
   - Tree

4. **反馈组件**
   - Modal
   - Drawer
   - Message
   - Notification

### 3. Theme System

#### Theme Variables
```stylus
// 主题色
$primary-color = #1677ff
$success-color = #52c41a
$warning-color = #faad14
$error-color = #ff4d4f

// 文字颜色
$heading-color = rgba(0, 0, 0, 0.88)
$text-color = rgba(0, 0, 0, 0.65)
$text-color-secondary = rgba(0, 0, 0, 0.45)
$disabled-color = rgba(0, 0, 0, 0.25)

// 边框和圆角
$border-radius-base = 4px
$border-color-base = #d9d9d9
$border-color-split = #f0f0f0

// 阴影
$box-shadow-base = 0 2px 8px rgba(0, 0, 0, 0.15)
```

#### Theme Customization
1. **变量覆盖**
   - 通过覆盖 `variables.styl` 中的变量实现主题定制
   - 支持动态主题切换

2. **暗色主题**
   - 支持暗色主题
   - 使用 CSS 变量实现主题切换

### 4. Best Practices

1. **性能优化**
   - 使用 CSS 变量实现动态样式
   - 避免过度嵌套选择器
   - 合理使用 CSS 选择器

2. **可维护性**
   - 保持样式文件结构清晰
   - 使用有意义的变量名
   - 添加必要的注释

3. **可扩展性**
   - 组件样式必须可配置
   - 支持主题定制
   - 支持样式覆盖

4. **兼容性**
   - 支持主流浏览器
   - 使用 CSS 前缀
   - 提供降级方案

## Common Issues

1. **Platform Adapter Not Showing**
   - Check adapter registration
   - Verify configuration component
   - Check console errors

2. **Configuration Save Failed**
   - Check configuration validation
   - Verify storage mechanism
   - Check error logs

3. **Publishing Failed**
   - Check platform connection
   - Verify publish parameters
   - Check platform error messages

## Plugin System Architecture

### Plugin Types

1. **Built-in Platform Adapters**
   - Pre-installed with the application
   - Implemented in `packages/platform-adapters`
   - Automatically registered on startup
   - Examples: WordPress, GitHub adapters

2. **External Plugins**
   - Dynamically loaded at runtime
   - Can be installed from NPM or local files
   - Must implement required interfaces
   - Can extend functionality or add new platforms

### Plugin Loading Process

1. **Built-in Adapters**
   ```
   Application Start
   ├── Plugin System Initialization
   │   └── Register Built-in Adapters
   │       ├── WordPress Adapter
   │       └── GitHub Adapter
   └── Initialize Adapters
       └── Update UI State
   ```

2. **External Plugins**
   ```
   Plugin Loading Request
   ├── Validate Plugin Type
   ├── Load Plugin Configuration
   ├── Initialize Plugin
   │   ├── Check Dependencies
   │   └── Register with System
   └── Update UI State
   ```

### External Plugin Development

1. **Plugin Structure**
   ```
   my-platform-plugin/
   ├── package.json        # Plugin configuration
   ├── src/
   │   ├── index.ts       # Entry file
   │   ├── adapter.ts     # Platform adapter implementation
   │   └── config.vue     # Configuration component
   └── dist/              # Build output
   ```

2. **Plugin Configuration**
   ```json
   {
     "name": "my-platform-plugin",
     "version": "1.0.0",
     "main": "dist/index.js",
     "siyuan-publisher": {
       "type": "platform-adapter",
       "platform": "my-platform",
       "entry": "./dist/index.js"
     }
   }
   ```

3. **Plugin Interface**
   ```typescript
   interface ExternalPlugin {
     id: string;
     name: string;
     version: string;
     type: "platform-adapter";
     platform: string;
     adapter: PlatformAdapter;
     configComponent?: Component;
   }
   ```

4. **Plugin Loader**
   ```typescript
   class ExternalPluginLoader {
     async loadPlugin(path: string): Promise<ExternalPlugin> {
       // 1. Load plugin configuration
       const manifest = await this.loadManifest(path);
       
       // 2. Validate plugin type
       if (manifest.type !== "platform-adapter") {
         throw new Error("Unsupported plugin type");
       }
       
       // 3. Load plugin code
       const plugin = await import(manifest.entry);
       
       // 4. Initialize plugin
       await plugin.initialize();
       
       return plugin;
     }
   }
   ```

### Plugin Packaging and Publishing

1. **Build Configuration**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       lib: {
         entry: "src/index.ts",
         formats: ["es"],
         fileName: "index"
       },
       rollupOptions: {
         external: ["@siyuan-publisher/common"]
       }
     }
   });
   ```

2. **Publishing to NPM**
   ```bash
   # 1. Build plugin
   npm run build
   
   # 2. Publish to NPM
   npm publish
   ```

3. **Local Installation**
   ```bash
   # 1. Build plugin
   npm run build
   
   # 2. Copy to plugins directory
   cp -r dist/ /path/to/plugins/my-platform-plugin/
   ```

### Plugin Loading Mechanism

```mermaid
sequenceDiagram
    actor A as App
    actor B as PS
    actor C as EL
    actor D as Plugin

    A->>B: Initialize Plugin System
    B->>C: Scan Plugin Directory
    C->>C: Read Plugin Config
    C->>D: Load Plugin Code
    D-->>C: Return Plugin Instance
    C-->>B: Register Plugin
    B-->>A: Update Available Plugins
``` 