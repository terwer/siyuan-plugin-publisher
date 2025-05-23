# SiYuan Publisher Development Guide

## Architecture Overview

The SiYuan Publisher is built with a modular architecture that separates concerns and promotes maintainability. Here's a detailed breakdown of the system:

### Core Components

1. **Main App (`packages/main-app`)**
   - Entry point of the application
   - Handles UI rendering and user interactions
   - Manages platform selection and configuration
   - Coordinates between different modules

2. **Core Module (`packages/core`)**
   - Provides fundamental services and types
   - Manages the publishing workflow
   - Defines core interfaces and types
   - Handles platform adapter registration

3. **Plugin System (`packages/plugin-system`)**
   - Manages plugin lifecycle
   - Handles dynamic loading of platform adapters
   - Provides plugin dependency resolution
   - Maintains plugin registry

4. **Platform Adapters (`packages/platform-adapters`)**
   - Implements platform-specific logic
   - Loaded dynamically as plugins
   - Provides unified interface for different platforms
   - Handles platform-specific configurations

### Call Chain

```mermaid
graph TD
    A[Main App] --> B[Plugin System]
    A --> C[Publisher Service]
    B --> D[Platform Adapters]
    C --> D
    D --> E[WordPress Adapter]
    D --> F[Other Adapters]
```

### Detailed Flow

1. **Initialization**
   ```
   Main App
   ├── Loads Plugin System
   │   └── Discovers available platform adapters
   └── Initializes Publisher Service
       └── Registers platform adapters
   ```

2. **Platform Selection**
   ```
   Main App
   ├── User selects platform
   ├── Loads platform configuration component
   └── Displays platform-specific settings
   ```

3. **Connection Testing**
   ```
   Main App
   ├── User configures platform settings
   ├── Triggers connection test
   ├── Publisher Service
   │   └── Gets platform adapter
   └── Platform Adapter
       └── Tests connection with platform
   ```

4. **Publishing Process**
   ```
   Main App
   ├── User prepares post content
   ├── Triggers publish action
   ├── Publisher Service
   │   ├── Validates post data
   │   └── Gets platform adapter
   └── Platform Adapter
       ├── Transforms post data
       └── Publishes to platform
   ```

### Key Interfaces

1. **Publisher Interface**
   ```typescript
   interface Publisher {
     publish(post: Post): Promise<PublishResult>;
   }
   ```

2. **Platform Adapter Interface**
   ```typescript
   interface PlatformAdapter {
     testConnection(config: PlatformConfig): Promise<boolean>;
     publish(post: Post): Promise<PublishResult>;
   }
   ```

3. **Plugin Interface**
   ```typescript
   interface Plugin {
     id: string;
     name: string;
     version: string;
     initialize(): Promise<void>;
   }
   ```

### Development Guidelines

1. **Adding New Platforms**
   - Create new adapter in `platform-adapters`
   - Implement required interfaces
   - Register adapter in plugin system
   - Create platform configuration component

2. **Modifying Core Logic**
   - Update interfaces in `core` module
   - Maintain backward compatibility
   - Update affected adapters
   - Test all platform integrations

3. **Extending UI**
   - Follow existing component patterns
   - Use provided composables
   - Maintain consistent styling
   - Add appropriate error handling

### Testing Strategy

1. **Unit Tests**
   - Test individual components
   - Mock dependencies
   - Verify interface compliance

2. **Integration Tests**
   - Test module interactions
   - Verify plugin loading
   - Check platform adapters

3. **End-to-End Tests**
   - Test complete publishing flow
   - Verify platform integration
   - Check error handling

### Error Handling

1. **UI Layer**
   - Display user-friendly messages
   - Provide retry options
   - Log errors for debugging

2. **Service Layer**
   - Handle platform-specific errors
   - Provide detailed error information
   - Implement retry mechanisms

3. **Plugin System**
   - Handle loading failures
   - Manage dependency conflicts
   - Provide fallback options 