import { describe, expect, it, beforeEach } from 'vitest';
import { ItemsService } from './items.service.js';
import { StorageService } from '../data/storage.service.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MenuItem } from '../common/types.js';

describe('ItemsService', () => {
  let itemsService: ItemsService;
  let storageService: StorageService;

  const mockItems: MenuItem[] = [
    {
      id: 'ITEM-000001',
      name: 'Crispy Truffle Fries',
      restaurantId: 'REST-01',
      restaurantName: 'Saffron & Spice',
      branchId: 'BR-01-1',
      branchName: 'Downtown Financial',
      category: 'Sides',
      price: 12.5,
      isAvailable: true,
      updatedAt: '2025-01-01T10:00:00.000Z',
    },
    {
      id: 'ITEM-000002',
      name: 'Wagyu Ribeye Steak',
      restaurantId: 'REST-01',
      restaurantName: 'Saffron & Spice',
      branchId: 'BR-01-2',
      branchName: 'Marina Waterfront',
      category: 'Mains',
      price: 65.0,
      isAvailable: false,
      updatedAt: '2025-01-02T12:00:00.000Z',
    },
    {
      id: 'ITEM-000003',
      name: 'Smoked Salmon Carpaccio',
      restaurantId: 'REST-02',
      restaurantName: 'Bella Italia',
      branchId: 'BR-02-1',
      branchName: 'Little Italy Square',
      category: 'Appetizers',
      price: 18.0,
      isAvailable: true,
      updatedAt: '2025-01-03T14:00:00.000Z',
    },
    {
      id: 'ITEM-000004',
      name: 'Artisan Tiramisu',
      restaurantId: 'REST-02',
      restaurantName: 'Bella Italia',
      branchId: 'BR-02-1',
      branchName: 'Little Italy Square',
      category: 'Desserts',
      price: 9.5,
      isAvailable: true,
      updatedAt: '2025-01-04T16:00:00.000Z',
    },
    {
      id: 'ITEM-000005',
      name: 'Cold Brew Coffee',
      restaurantId: 'REST-03',
      restaurantName: 'Tokyo Blossom',
      branchId: 'BR-03-1',
      branchName: 'Midtown Tower',
      category: 'Beverages',
      price: 5.5,
      isAvailable: true,
      updatedAt: '2025-01-05T18:00:00.000Z',
    },
  ];

  beforeEach(() => {
    storageService = {
      getAll: () => mockItems,
      findById: (id: string) => mockItems.find((i) => i.id === id),
      updateItem: async (id: string, updates: any) => {
        const item = mockItems.find((i) => i.id === id);
        if (!item) return undefined;
        if (updates.price !== undefined) item.price = updates.price;
        if (updates.isAvailable !== undefined) item.isAvailable = updates.isAvailable;
        item.updatedAt = new Date().toISOString();
        return { ...item };
      },
    } as any;

    itemsService = new ItemsService(storageService);
  });

  describe('Pagination & Default Query', () => {
    it('should paginate items with default page size and metadata', () => {
      const res = itemsService.query({ page: 1, pageSize: 2 });
      expect(res.data.length).toBe(2);
      expect(res.total).toBe(5);
      expect(res.page).toBe(1);
      expect(res.pageSize).toBe(2);
      expect(res.totalPages).toBe(3);
    });

    it('should return next slice for page 2', () => {
      const res = itemsService.query({ page: 2, pageSize: 2 });
      expect(res.data.length).toBe(2);
      expect(res.page).toBe(2);
    });
  });

  describe('Combined Filtering & Price Range Validation', () => {
    it('should filter by search term', () => {
      const res = itemsService.query({ page: 1, pageSize: 10, search: 'steak' });
      expect(res.total).toBe(1);
      expect(res.data[0].name).toContain('Steak');
    });

    it('should combine category, availability, and price bounds', () => {
      const res = itemsService.query({
        page: 1,
        pageSize: 10,
        category: 'Sides',
        availability: 'true',
        minPrice: 10,
        maxPrice: 20,
      });
      expect(res.total).toBe(1);
      expect(res.data[0].id).toBe('ITEM-000001');
    });

    it('should filter by restaurantId and branchId', () => {
      const res = itemsService.query({
        page: 1,
        pageSize: 10,
        restaurantId: 'REST-01',
        branchId: 'BR-01-2',
      });
      expect(res.total).toBe(1);
      expect(res.data[0].id).toBe('ITEM-000002');
    });

    it('should throw BadRequestException when minPrice > maxPrice', () => {
      expect(() =>
        itemsService.query({
          minPrice: 50,
          maxPrice: 20,
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('Sorting', () => {
    it('should sort by price ASC and DESC', () => {
      const asc = itemsService.query({ page: 1, pageSize: 5, sortBy: 'price', sortOrder: 'ASC' });
      expect(asc.data[0].price).toBe(5.5);
      expect(asc.data[asc.data.length - 1].price).toBe(65.0);

      const desc = itemsService.query({ page: 1, pageSize: 5, sortBy: 'price', sortOrder: 'DESC' });
      expect(desc.data[0].price).toBe(65.0);
      expect(desc.data[desc.data.length - 1].price).toBe(5.5);
    });

    it('should sort by updatedAt using direct string comparison', () => {
      const asc = itemsService.query({ page: 1, pageSize: 5, sortBy: 'updatedAt', sortOrder: 'ASC' });
      expect(asc.data[0].id).toBe('ITEM-000001');
      expect(asc.data[asc.data.length - 1].id).toBe('ITEM-000005');

      const desc = itemsService.query({ page: 1, pageSize: 5, sortBy: 'updatedAt', sortOrder: 'DESC' });
      expect(desc.data[0].id).toBe('ITEM-000005');
      expect(desc.data[desc.data.length - 1].id).toBe('ITEM-000001');
    });
  });

  describe('GetById and Update', () => {
    it('should return item when ID exists', () => {
      const item = itemsService.getById('ITEM-000001');
      expect(item.id).toBe('ITEM-000001');
    });

    it('should throw NotFoundException when ID does not exist', () => {
      expect(() => itemsService.getById('ITEM-999999')).toThrow(NotFoundException);
    });

    it('should update price and availability and persist changes', async () => {
      const updated = await itemsService.update('ITEM-000001', {
        price: 15.75,
        isAvailable: false,
      });
      expect(updated.price).toBe(15.75);
      expect(updated.isAvailable).toBe(false);
    });

    it('should throw BadRequestException when update payload is empty', async () => {
      await expect(itemsService.update('ITEM-000001', {})).rejects.toThrow(BadRequestException);
    });
  });
});
