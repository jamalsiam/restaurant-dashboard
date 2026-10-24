import { describe, expect, it, beforeEach } from 'vitest';
import { StatsService } from './stats.service.js';
import { StorageService } from '../data/storage.service.js';
import { MenuItem } from '../common/types.js';

describe('StatsService', () => {
  let statsService: StatsService;

  const mockItems: MenuItem[] = [
    {
      id: 'ITEM-001',
      name: 'Salad',
      restaurantId: 'REST-01',
      restaurantName: 'Rest 1',
      branchId: 'BR-01',
      branchName: 'Branch 1',
      category: 'Appetizers',
      price: 10.0,
      isAvailable: true,
      updatedAt: '2025-01-01',
    },
    {
      id: 'ITEM-002',
      name: 'Burger',
      restaurantId: 'REST-01',
      restaurantName: 'Rest 1',
      branchId: 'BR-01',
      branchName: 'Branch 1',
      category: 'Mains',
      price: 20.0,
      isAvailable: false,
      updatedAt: '2025-01-01',
    },
    {
      id: 'ITEM-003',
      name: 'Cake',
      restaurantId: 'REST-02',
      restaurantName: 'Rest 2',
      branchId: 'BR-02',
      branchName: 'Branch 2',
      category: 'Desserts',
      price: 15.0,
      isAvailable: true,
      updatedAt: '2025-01-01',
    },
  ];

  beforeEach(() => {
    const mockStorage = {
      getAll: () => mockItems,
      getRestaurants: () => [],
    } as unknown as StorageService;

    statsService = new StatsService(mockStorage);
  });

  it('should calculate global metrics across complete dataset', () => {
    const stats = statsService.getStats();

    expect(stats.totalItems).toBe(3);
    expect(stats.availableItems).toBe(2);
    expect(stats.unavailableItems).toBe(1);
    expect(stats.averagePrice).toBe(15.0); // (10 + 20 + 15) / 3 = 15.0
    expect(stats.categoryDistribution.Appetizers).toBe(1);
    expect(stats.categoryDistribution.Mains).toBe(1);
    expect(stats.categoryDistribution.Desserts).toBe(1);
    expect(stats.categoryDistribution.Beverages).toBe(0);
    expect(stats.categoryDistribution.Sides).toBe(0);
  });
});
