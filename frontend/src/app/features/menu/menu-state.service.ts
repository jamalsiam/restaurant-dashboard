import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, Subscription, catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { DashboardStateService } from '../dashboard/dashboard-state.service';
import {
  MenuItem,
  PaginatedResult,
  QueryFilters,
  RestaurantMeta,
  UpdateItemPayload,
} from '../../core/models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuStateService {
  private readonly apiService = inject(ApiService);
  private readonly dashboardState = inject(DashboardStateService);

  // Core Data Signals
  readonly items = signal<MenuItem[]>([]);
  readonly total = signal<number>(0);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  // Pagination & Sorting Signals
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(25);
  readonly sortBy = signal<'name' | 'price' | 'updatedAt'>('updatedAt');
  readonly sortOrder = signal<'ASC' | 'DESC'>('DESC');

  // Filter Signals
  readonly search = signal<string>('');
  readonly restaurantId = signal<string>('');
  readonly branchId = signal<string>('');
  readonly category = signal<string>('');
  readonly availability = signal<'all' | 'true' | 'false'>('all');
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);

  // Metadata Signals
  readonly restaurants = signal<RestaurantMeta[]>([]);

  // Modal & Selection Signals
  readonly selectedItem = signal<MenuItem | null>(null);
  readonly isEditModalOpen = signal<boolean>(false);
  readonly isUpdating = signal<boolean>(false);
  readonly updateError = signal<string | null>(null);

  // Computed Signals
  readonly totalPages = computed(() => {
    const t = this.total();
    const ps = this.pageSize();
    return Math.max(1, Math.ceil(t / ps));
  });

  readonly availableBranches = computed(() => {
    const rId = this.restaurantId();
    if (!rId) return [];
    const found = this.restaurants().find((r) => r.id === rId);
    return found ? found.branches : [];
  });

  readonly hasActiveFilters = computed(() => {
    return (
      Boolean(this.search().trim()) ||
      Boolean(this.restaurantId()) ||
      Boolean(this.branchId()) ||
      Boolean(this.category()) ||
      this.availability() !== 'all' ||
      this.minPrice() !== null ||
      this.maxPrice() !== null
    );
  });

  readonly currentFilterSnapshot = computed<QueryFilters>(() => ({
    page: this.page(),
    pageSize: this.pageSize(),
    search: this.search(),
    restaurantId: this.restaurantId(),
    branchId: this.branchId(),
    category: this.category(),
    availability: this.availability(),
    minPrice: this.minPrice(),
    maxPrice: this.maxPrice(),
    sortBy: this.sortBy(),
    sortOrder: this.sortOrder(),
  }));

  // RxJS Subjects for Concurrency Control
  private readonly queryTrigger$ = new Subject<QueryFilters>();
  private readonly searchInput$ = new Subject<string>();
  private readonly priceInput$ = new Subject<{ min: number | null; max: number | null }>();
  private querySubscription?: Subscription;
  private searchSubscription?: Subscription;
  private priceSubscription?: Subscription;

  constructor() {
    this.initPipeline();
    this.loadRestaurantMetadata();
  }

  private initPipeline(): void {
    // Debounce search inputs by 300ms before dispatching query
    this.searchSubscription = this.searchInput$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((term) => {
        this.search.set(term);
        this.page.set(1);
        this.dispatchQuery();
      });

    // Debounce numeric price inputs by 300ms to avoid request flooding on keystrokes
    this.priceSubscription = this.priceInput$
      .pipe(debounceTime(500))
      .subscribe(({ min, max }) => {
        this.minPrice.set(min);
        this.maxPrice.set(max);
        this.page.set(1);
        this.dispatchQuery();
      });

    // Concurrency handling with switchMap:
    // Any in-flight HTTP request is canceled when a new query arrives,
    // ensuring stale responses NEVER overwrite newer state!
    this.querySubscription = this.queryTrigger$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((filters) =>
          this.apiService.getItems(filters).pipe(
            catchError((err) => {
              this.error.set(
                err?.error?.message || 'Failed to load menu items from the server.',
              );
              return of<PaginatedResult<MenuItem>>({
                data: [],
                total: 0,
                page: filters.page,
                pageSize: filters.pageSize,
                totalPages: 1,
              });
            }),
          ),
        ),
      )
      .subscribe({
        next: (result) => {
          this.items.set(result.data);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message || 'Unexpected streaming error');
          this.loading.set(false);
        },
      });
  }

  loadRestaurantMetadata(): void {
    const existingStats = this.dashboardState.stats();
    if (existingStats?.restaurants && existingStats.restaurants.length > 0) {
      this.restaurants.set(existingStats.restaurants);
      return;
    }

    this.apiService.getStats().subscribe({
      next: (stats) => {
        if (stats?.restaurants) {
          this.restaurants.set(stats.restaurants);
        }
      },
      error: () => {
        // Handled silently
      },
    });
  }

  dispatchQuery(): void {
    this.queryTrigger$.next(this.currentFilterSnapshot());
  }

  // Filter setters
  onSearchChange(term: string): void {
    this.searchInput$.next(term);
  }

  clearSearch(): void {
    this.search.set('');
    this.page.set(1);
    this.dispatchQuery();
  }

  onPriceChangeDebounced(min: number | null, max: number | null): void {
    this.priceInput$.next({ min, max });
  }

  setRestaurant(restaurantId: string): void {
    this.restaurantId.set(restaurantId);
    // If branch doesn't belong to newly selected restaurant, reset branch
    const validBranch = this.availableBranches().some((b) => b.id === this.branchId());
    if (!validBranch) {
      this.branchId.set('');
    }
    this.page.set(1);
    this.dispatchQuery();
  }

  setBranch(branchId: string): void {
    this.branchId.set(branchId);
    this.page.set(1);
    this.dispatchQuery();
  }

  setCategory(category: string): void {
    this.category.set(category);
    this.page.set(1);
    this.dispatchQuery();
  }

  setAvailability(availability: 'all' | 'true' | 'false'): void {
    this.availability.set(availability);
    this.page.set(1);
    this.dispatchQuery();
  }

  setPriceRange(min: number | null, max: number | null): void {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.page.set(1);
    this.dispatchQuery();
  }

  setSorting(sortBy: 'name' | 'price' | 'updatedAt'): void {
    if (this.sortBy() === sortBy) {
      // Toggle order
      this.sortOrder.set(this.sortOrder() === 'ASC' ? 'DESC' : 'ASC');
    } else {
      this.sortBy.set(sortBy);
      this.sortOrder.set('ASC');
    }
    this.page.set(1);
    this.dispatchQuery();
  }

  setPage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.page.set(newPage);
      this.dispatchQuery();
    }
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
    this.dispatchQuery();
  }

  resetFilters(): void {
    this.search.set('');
    this.restaurantId.set('');
    this.branchId.set('');
    this.category.set('');
    this.availability.set('all');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.sortBy.set('updatedAt');
    this.sortOrder.set('DESC');
    this.page.set(1);
    this.dispatchQuery();
  }

  // Modal & Edit actions
  openEditModal(item: MenuItem): void {
    this.selectedItem.set({ ...item });
    this.updateError.set(null);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedItem.set(null);
    this.updateError.set(null);
  }

  async updateItem(id: string, payload: UpdateItemPayload): Promise<boolean> {
    this.isUpdating.set(true);
    this.updateError.set(null);

    return new Promise((resolve) => {
      this.apiService.patchItem(id, payload).subscribe({
        next: (confirmed) => {
          // Update item in current table view
          const updatedItems = this.items().map((i) => (i.id === confirmed.id ? confirmed : i));
          this.items.set(updatedItems);

          // Synchronize global Dashboard KPIs
          this.dashboardState.refresh();

          // Refresh query to keep sorting and filtering authoritatively aligned with server
          this.dispatchQuery();

          this.showSuccess(`Updated "${confirmed.name}" successfully.`);
          this.closeEditModal();
          this.isUpdating.set(false);
          resolve(true);
        },
        error: (err) => {
          const msg =
            err?.error?.message ||
            (Array.isArray(err?.error?.message)
              ? err.error.message.join(', ')
              : 'Failed to update item on server.');
          this.updateError.set(msg);
          this.isUpdating.set(false);
          resolve(false);
        },
      });
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => {
      if (this.successMessage() === msg) {
        this.successMessage.set(null);
      }
    }, 4000);
  }

  destroy(): void {
    this.querySubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.priceSubscription?.unsubscribe();
  }
}
