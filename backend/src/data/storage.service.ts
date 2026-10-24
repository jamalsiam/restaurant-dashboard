import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { MenuItem, RestaurantMeta } from '../common/types.js';
import { generateMenuItems, RESTAURANTS_DATA } from './dataset-generator.js';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private items: MenuItem[] = [];
  private itemMap: Map<string, MenuItem> = new Map();
  private readonly dataDir = path.resolve(process.cwd(), 'data');
  private readonly filePath = path.join(this.dataDir, 'menu-items.json');
  private writePromise: Promise<void> = Promise.resolve();

  async onModuleInit() {
    await this.initializeData();
  }

  async initializeData(forceReset = false): Promise<void> {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    if (!forceReset && fs.existsSync(this.filePath)) {
      try {
        this.logger.log(`Loading menu items from disk: ${this.filePath}`);
        const content = await fs.promises.readFile(this.filePath, 'utf-8');
        this.items = JSON.parse(content);
        this.rebuildIndex();
        this.logger.log(`Loaded ${this.items.length} items from persistent disk file.`);
        return;
      } catch (err) {
        this.logger.warn(`Failed to read existing data file, regenerating: ${(err as Error).message}`);
      }
    }

    this.logger.log('Generating deterministic dataset of 50,000 items...');
    this.items = generateMenuItems(50000);
    this.rebuildIndex();
    await this.persistToDisk();
    this.logger.log(`Successfully generated and saved ${this.items.length} items to disk.`);
  }

  private rebuildIndex(): void {
    this.itemMap.clear();
    for (const item of this.items) {
      this.itemMap.set(item.id, item);
    }
  }

  getAll(): MenuItem[] {
    return this.items;
  }

  getCount(): number {
    return this.items.length;
  }

  findById(id: string): MenuItem | undefined {
    return this.itemMap.get(id);
  }

  getRestaurants(): RestaurantMeta[] {
    return RESTAURANTS_DATA;
  }

  async updateItem(
    id: string,
    updates: { price?: number; isAvailable?: boolean },
  ): Promise<MenuItem | undefined> {
    const item = this.itemMap.get(id);
    if (!item) {
      return undefined;
    }

    let hasChanges = false;
    if (updates.price !== undefined) {
      const rounded = Math.round(updates.price * 100) / 100;
      if (item.price !== rounded) {
        item.price = rounded;
        hasChanges = true;
      }
    }
    if (updates.isAvailable !== undefined) {
      const boolVal = Boolean(updates.isAvailable);
      if (item.isAvailable !== boolVal) {
        item.isAvailable = boolVal;
        hasChanges = true;
      }
    }

    // Only update timestamp and persist to disk if values actually changed
    if (hasChanges) {
      item.updatedAt = new Date().toISOString();
      await this.queueWrite();
    }
    return { ...item };
  }

  private queueWrite(): Promise<void> {
    this.writePromise = this.writePromise.then(async () => {
      await this.persistToDisk();
    });
    return this.writePromise;
  }

  private async persistToDisk(): Promise<void> {
    const tempPath = `${this.filePath}.tmp`;
    const data = JSON.stringify(this.items);
    await fs.promises.writeFile(tempPath, data, 'utf-8');
    await fs.promises.rename(tempPath, this.filePath);
  }

  async resetDataset(): Promise<number> {
    await this.initializeData(true);
    return this.items.length;
  }
}
