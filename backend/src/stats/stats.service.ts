import { Injectable } from '@nestjs/common';
import { StorageService } from '../data/storage.service.js';
import { DashboardStats, MenuCategory } from '../common/types.js';

@Injectable()
export class StatsService {
  constructor(private readonly storageService: StorageService) {}

  getStats(): DashboardStats {
    const items = this.storageService.getAll();
    const totalItems = items.length;

    let availableCount = 0;
    let totalPrice = 0;
    const categoryDistribution: Record<MenuCategory, number> = {
      Appetizers: 0,
      Mains: 0,
      Desserts: 0,
      Beverages: 0,
      Sides: 0,
    };

    for (let i = 0; i < totalItems; i++) {
      const item = items[i];
      if (item.isAvailable) {
        availableCount++;
      }
      totalPrice += item.price;
      if (categoryDistribution[item.category] !== undefined) {
        categoryDistribution[item.category]++;
      }
    }

    const unavailableItems = totalItems - availableCount;
    const averagePrice = totalItems > 0 ? Math.round((totalPrice / totalItems) * 100) / 100 : 0;

    return {
      totalItems,
      availableItems: availableCount,
      unavailableItems,
      averagePrice,
      categoryDistribution,
      restaurants: this.storageService.getRestaurants(),
      lastCalculatedAt: new Date().toISOString(),
    };
  }
}
