import { describe, expect, it } from 'vitest';
import { StorageService } from './storage.service.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('StorageService Persistence', () => {
  const dataDir = path.resolve(process.cwd(), 'data');
  const filePath = path.join(dataDir, 'menu-items.json');

  it('should initialize and produce 50,000 items', async () => {
    const storage = new StorageService();
    await storage.initializeData(false);

    expect(storage.getCount()).toBe(50000);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should persist updates and survive service re-initialization', async () => {
    const storage1 = new StorageService();
    await storage1.initializeData(false);

    const firstItem = storage1.getAll()[0];
    const newPrice = 99.45;

    // Update item
    const updated = await storage1.updateItem(firstItem.id, {
      price: newPrice,
      isAvailable: false,
    });

    expect(updated).toBeDefined();
    expect(updated!.price).toBe(newPrice);
    expect(updated!.isAvailable).toBe(false);

    // Simulate server restart: create brand new StorageService instance loading from disk
    const storage2 = new StorageService();
    await storage2.initializeData(false);

    const reloadedItem = storage2.findById(firstItem.id);
    expect(reloadedItem).toBeDefined();
    expect(reloadedItem!.price).toBe(newPrice);
    expect(reloadedItem!.isAvailable).toBe(false);
  });
});
