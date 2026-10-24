import { TestBed } from '@angular/core/testing';
import { MenuStateService } from './menu-state.service';
import { ApiService } from '../../core/services/api.service';
import { DashboardStateService } from '../dashboard/dashboard-state.service';
import { Subject, of, throwError } from 'rxjs';
import { MenuItem, PaginatedResult } from '../../core/models/menu.model';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('MenuStateService (Senior Concurrency & State Suite)', () => {
  let service: MenuStateService;
  let apiServiceMock: {
    getItems: ReturnType<typeof vi.fn>;
    patchItem: ReturnType<typeof vi.fn>;
    getStats: ReturnType<typeof vi.fn>;
  };
  let dashboardStateMock: {
    refresh: ReturnType<typeof vi.fn>;
    loadStats: ReturnType<typeof vi.fn>;
    stats: ReturnType<typeof vi.fn>;
  };

  const sampleItems: MenuItem[] = [
    {
      id: 'ITEM-000001',
      name: 'Truffle Risotto',
      restaurantId: 'REST-01',
      restaurantName: 'Saffron & Spice',
      branchId: 'BR-01-1',
      branchName: 'Downtown Financial',
      category: 'Mains',
      price: 24.5,
      isAvailable: true,
      updatedAt: '2025-01-01T12:00:00Z',
    },
    {
      id: 'ITEM-000002',
      name: 'Ribeye Steak',
      restaurantId: 'REST-01',
      restaurantName: 'Saffron & Spice',
      branchId: 'BR-01-2',
      branchName: 'Marina',
      category: 'Mains',
      price: 55.0,
      isAvailable: false,
      updatedAt: '2025-01-02T14:00:00Z',
    },
  ];

  beforeEach(() => {
    apiServiceMock = {
      getItems: vi.fn().mockReturnValue(
        of<PaginatedResult<MenuItem>>({
          data: sampleItems,
          total: 2,
          page: 1,
          pageSize: 25,
          totalPages: 1,
        }),
      ),
      patchItem: vi.fn(),
      getStats: vi.fn().mockReturnValue(
        of({
          totalItems: 50000,
          availableItems: 42000,
          unavailableItems: 8000,
          averagePrice: 22.5,
          categoryDistribution: {
            Appetizers: 10000,
            Mains: 10000,
            Desserts: 10000,
            Beverages: 10000,
            Sides: 10000,
          },
          restaurants: [
            {
              id: 'REST-01',
              name: 'Saffron & Spice',
              branches: [{ id: 'BR-01-1', name: 'Downtown', restaurantId: 'REST-01' }],
            },
          ],
          lastCalculatedAt: new Date().toISOString(),
        }),
      ),
    };

    dashboardStateMock = {
      refresh: vi.fn(),
      loadStats: vi.fn(),
      stats: vi.fn().mockReturnValue({
        totalItems: 50000,
        availableItems: 42000,
        unavailableItems: 8000,
        averagePrice: 22.5,
        categoryDistribution: {} as any,
        restaurants: [
          {
            id: 'REST-01',
            name: 'Saffron & Spice',
            branches: [{ id: 'BR-01-1', name: 'Downtown', restaurantId: 'REST-01' }],
          },
        ],
        lastCalculatedAt: new Date().toISOString(),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        MenuStateService,
        { provide: ApiService, useValue: apiServiceMock },
        { provide: DashboardStateService, useValue: dashboardStateMock },
      ],
    });

    service = TestBed.inject(MenuStateService);
  });

  // TEST 1: Combined Filtering and Server-Side Pagination
  it('Test 1: Combined filtering and pagination update query snapshot and invoke API', () => {
    service.setRestaurant('REST-01');
    service.setCategory('Mains');
    service.setPriceRange(20, 60);
    service.total.set(100);
    service.setPage(2);

    const snapshot = service.currentFilterSnapshot();
    expect(snapshot.restaurantId).toBe('REST-01');
    expect(snapshot.category).toBe('Mains');
    expect(snapshot.minPrice).toBe(20);
    expect(snapshot.maxPrice).toBe(60);
    expect(snapshot.page).toBe(2);

    expect(apiServiceMock.getItems).toHaveBeenCalled();
  });

  // TEST 2: State Updates After Successful Edit
  it('Test 2: Successful item mutation updates table state, synchronizes KPIs, and dispatches query', async () => {
    service.items.set([...sampleItems]);

    const updatedConfirmed: MenuItem = {
      ...sampleItems[0],
      price: 32.0,
      isAvailable: false,
      updatedAt: '2025-01-05T10:00:00Z',
    };

    apiServiceMock.patchItem.mockReturnValue(of(updatedConfirmed));
    apiServiceMock.getItems.mockReturnValue(
      of<PaginatedResult<MenuItem>>({
        data: [updatedConfirmed, sampleItems[1]],
        total: 2,
        page: 1,
        pageSize: 25,
        totalPages: 1,
      }),
    );

    const result = await service.updateItem('ITEM-000001', {
      price: 32.0,
      isAvailable: false,
    });

    expect(result).toBe(true);

    // Verify local item updated with server confirmation
    const itemInTable = service.items().find((i) => i.id === 'ITEM-000001');
    expect(itemInTable?.price).toBe(32.0);
    expect(itemInTable?.isAvailable).toBe(false);

    // Verify Dashboard state refresh was triggered and query was re-dispatched
    expect(dashboardStateMock.refresh).toHaveBeenCalled();
    expect(apiServiceMock.getItems).toHaveBeenCalled();
    expect(service.successMessage()).toContain('Truffle Risotto');
  });

  // TEST 3: Stale Request Handling with switchMap Concurrency
  it('Test 3: Concurrency switchMap drops slow in-flight queries and prevents stale overwrite', () => {
    const req1$ = new Subject<PaginatedResult<MenuItem>>();
    const req2$ = new Subject<PaginatedResult<MenuItem>>();

    let callCount = 0;
    apiServiceMock.getItems.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? req1$ : req2$;
    });

    // Fire query 1 (e.g. search for "pizza")
    service.search.set('pizza');
    service.dispatchQuery();

    // Rapidly fire query 2 before query 1 finishes (e.g. search for "burger")
    service.search.set('burger');
    service.dispatchQuery();

    // Query 2 (newer) finishes first with "Burger"
    const burgerResult: PaginatedResult<MenuItem> = {
      data: [{ ...sampleItems[0], name: 'Burger' }],
      total: 1,
      page: 1,
      pageSize: 25,
      totalPages: 1,
    };
    req2$.next(burgerResult);
    req2$.complete();

    expect(service.items()[0].name).toBe('Burger');

    // Stale Query 1 finishes later with "Pizza"
    const stalePizzaResult: PaginatedResult<MenuItem> = {
      data: [{ ...sampleItems[0], name: 'Pizza' }],
      total: 1,
      page: 1,
      pageSize: 25,
      totalPages: 1,
    };
    req1$.next(stalePizzaResult);
    req1$.complete();

    // switchMap must have canceled Query 1; state MUST still be "Burger"!
    expect(service.items()[0].name).toBe('Burger');
  });

  // TEST 4: API Error Handling & Recovery
  it('Test 4: API failure sets error state and handles failure safely', () => {
    apiServiceMock.getItems.mockReturnValue(
      throwError(() => ({
        error: { message: 'Internal Server Error' },
      })),
    );

    service.dispatchQuery();

    expect(service.error()).toBe('Internal Server Error');
    expect(service.loading()).toBe(false);
    expect(service.items().length).toBe(0);
  });

  // TEST 5: Sorting Changes Reset Pagination to Page 1
  it('Test 5: Changing sort column or direction resets current page to 1', () => {
    apiServiceMock.getItems.mockReturnValue(
      of<PaginatedResult<MenuItem>>({
        data: sampleItems,
        total: 500,
        page: 1,
        pageSize: 25,
        totalPages: 20,
      }),
    );

    service.total.set(500);
    service.setPage(4);
    expect(service.page()).toBe(4);

    service.setSorting('price');
    expect(service.sortBy()).toBe('price');
    expect(service.page()).toBe(1);

    service.setPage(3);
    expect(service.page()).toBe(3);

    service.setSorting('price'); // Toggle sort order
    expect(service.sortOrder()).toBe('DESC');
    expect(service.page()).toBe(1);
  });

  // TEST 6: Immediate Clear Search
  it('Test 6: clearSearch synchronously resets search string, resets page to 1, and queries', () => {
    service.search.set('Pasta');
    service.total.set(100);
    service.setPage(3);

    service.clearSearch();

    expect(service.search()).toBe('');
    expect(service.page()).toBe(1);
    expect(apiServiceMock.getItems).toHaveBeenCalled();
  });
});
