import { PlatformAdapter, PlatformConfig, PublishOptions, PublishResult } from '../index';

export class PlatformService {
  private adapters: Map<string, PlatformAdapter> = new Map();
  private activeAdapter?: PlatformAdapter;

  async registerAdapter(adapter: PlatformAdapter): Promise<void> {
    if (this.adapters.has(adapter.name)) {
      throw new Error(`Platform adapter ${adapter.name} is already registered`);
    }
    this.adapters.set(adapter.name, adapter);
  }

  async unregisterAdapter(name: string): Promise<void> {
    const adapter = this.adapters.get(name);
    if (!adapter) {
      throw new Error(`Platform adapter ${name} is not registered`);
    }

    if (this.activeAdapter === adapter) {
      await this.disconnect();
    }
    this.adapters.delete(name);
  }

  async connect(name: string, config: PlatformConfig): Promise<void> {
    const adapter = this.adapters.get(name);
    if (!adapter) {
      throw new Error(`Platform adapter ${name} is not registered`);
    }

    if (this.activeAdapter) {
      await this.disconnect();
    }

    await adapter.connect(config);
    this.activeAdapter = adapter;
  }

  async disconnect(): Promise<void> {
    if (this.activeAdapter) {
      await this.activeAdapter.disconnect();
      this.activeAdapter = undefined;
    }
  }

  async publish(content: string, options: PublishOptions): Promise<PublishResult> {
    if (!this.activeAdapter) {
      throw new Error('No active platform adapter');
    }
    return await this.activeAdapter.publish(content, options);
  }

  getActiveAdapter(): PlatformAdapter | undefined {
    return this.activeAdapter;
  }

  getAllAdapters(): PlatformAdapter[] {
    return Array.from(this.adapters.values());
  }
} 