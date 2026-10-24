import { TestBed } from '@angular/core/testing';
import { MenuTableComponent } from './menu-table.component';
import { MenuStateService } from '../../menu-state.service';
import { signal } from '@angular/core';

describe('MenuTableComponent', () => {
  beforeEach(async () => {
    const mockMenuState = {
      items: signal([
        {
          id: 'item_1',
          name: 'Classic Burger',
          category: 'Mains',
          restaurantName: 'The Rustic Grill',
          branchName: 'Downtown',
          price: 18.5,
          isAvailable: true,
          updatedAt: new Date().toISOString(),
        },
      ]),
      loading: signal(false),
      error: signal(null),
      sortBy: signal('name'),
      sortOrder: signal('ASC'),
      setSorting: vi.fn(),
      openEditModal: vi.fn(),
      dispatchQuery: vi.fn(),
      hasActiveFilters: signal(false),
      resetFilters: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MenuTableComponent],
      providers: [{ provide: MenuStateService, useValue: mockMenuState }],
    }).compileComponents();
  });

  it('renders menu rows with dish details', () => {
    const fixture = TestBed.createComponent(MenuTableComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.item-name')?.textContent).toContain('Classic Burger');
    expect(compiled.querySelector('.badge-status-in-stock')?.textContent).toContain('In Stock');
  });
});
