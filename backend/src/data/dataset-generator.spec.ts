import { describe, expect, it } from 'vitest';
import { generateMenuItems, RESTAURANTS_DATA } from './dataset-generator.js';

describe('DatasetGenerator', () => {
  it('should generate at least 50,000 menu items', () => {
    const items = generateMenuItems(50000);
    expect(items.length).toBe(50000);
  });

  it('should produce identical datasets given the same seed (deterministic)', () => {
    const run1 = generateMenuItems(100, 42);
    const run2 = generateMenuItems(100, 42);
    expect(run1).toEqual(run2);
  });

  it('should generate valid prices and assigned categories', () => {
    const items = generateMenuItems(1000);
    const validCategories = ['Appetizers', 'Mains', 'Desserts', 'Beverages', 'Sides'];

    for (const item of items) {
      expect(validCategories).toContain(item.category);
      expect(item.price).toBeGreaterThan(0);
      expect(Number.isFinite(item.price)).toBe(true);
      expect(typeof item.isAvailable).toBe('boolean');
      expect(item.id).toMatch(/^ITEM-\d{6}$/);
      expect(item.name.length).toBeGreaterThan(3);
    }
  });

  it('should maintain consistent restaurant and branch relationships', () => {
    const items = generateMenuItems(500);
    const restaurantBranchMap = new Map<string, Set<string>>();

    for (const r of RESTAURANTS_DATA) {
      restaurantBranchMap.set(r.id, new Set(r.branches.map((b) => b.id)));
    }

    for (const item of items) {
      const allowedBranches = restaurantBranchMap.get(item.restaurantId);
      expect(allowedBranches).toBeDefined();
      expect(allowedBranches!.has(item.branchId)).toBe(true);
    }
  });
});
