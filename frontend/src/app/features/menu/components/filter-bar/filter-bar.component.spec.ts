import { TestBed } from '@angular/core/testing';
import { FilterBarComponent } from './filter-bar.component';
import { MenuStateService } from '../../menu-state.service';
import { signal } from '@angular/core';

describe('FilterBarComponent', () => {
  beforeEach(async () => {
    const mockMenuState = {
      search: signal(''),
      onSearchChange: vi.fn(),
      clearSearch: vi.fn(),
      restaurantId: signal(''),
      setRestaurant: vi.fn(),
      restaurants: signal([]),
      branchId: signal(''),
      setBranch: vi.fn(),
      availableBranches: signal([]),
      category: signal(''),
      setCategory: vi.fn(),
      availability: signal('all'),
      setAvailability: vi.fn(),
      minPrice: signal(null),
      maxPrice: signal(null),
      onPriceChangeDebounced: vi.fn(),
      hasActiveFilters: signal(false),
      resetFilters: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FilterBarComponent],
      providers: [{ provide: MenuStateService, useValue: mockMenuState }],
    }).compileComponents();
  });

  it('renders filter controls properly', () => {
    const fixture = TestBed.createComponent(FilterBarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-search-box')).toBeTruthy();
    expect(compiled.querySelector('input')).toBeTruthy();
  });
});
