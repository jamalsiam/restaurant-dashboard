import { TestBed } from '@angular/core/testing';
import { EditItemModalComponent } from './edit-item-modal.component';
import { MenuStateService } from '../../menu-state.service';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { MenuItem } from '../../../../core/models/menu.model';

describe('EditItemModalComponent (Reactive Form Validation & Accessibility)', () => {
  let component: EditItemModalComponent;
  let mockState: {
    selectedItem: ReturnType<typeof signal<MenuItem | null>>;
    isEditModalOpen: ReturnType<typeof signal<boolean>>;
    isUpdating: ReturnType<typeof signal<boolean>>;
    updateError: ReturnType<typeof signal<string | null>>;
    closeEditModal: ReturnType<typeof vi.fn>;
    updateItem: ReturnType<typeof vi.fn>;
  };

  const dummyItem: MenuItem = {
    id: 'ITEM-000100',
    name: 'Artisan Cheescake',
    restaurantId: 'REST-01',
    restaurantName: 'Saffron & Spice',
    branchId: 'BR-01-1',
    branchName: 'Downtown',
    category: 'Desserts',
    price: 12.0,
    isAvailable: true,
    updatedAt: '2025-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    mockState = {
      selectedItem: signal<MenuItem | null>(dummyItem),
      isEditModalOpen: signal<boolean>(true),
      isUpdating: signal<boolean>(false),
      updateError: signal<string | null>(null),
      closeEditModal: vi.fn(),
      updateItem: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EditItemModalComponent],
      providers: [{ provide: MenuStateService, useValue: mockState }],
    }).compileComponents();

    const fixture = TestBed.createComponent(EditItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize reactive form with item price and availability', () => {
    expect(component.form.value.price).toBe(12.0);
    expect(component.form.value.isAvailable).toBe(true);
    expect(component.form.valid).toBe(true);
  });

  it('should invalidate form when price is negative', () => {
    component.form.controls.price.setValue(-5.5);
    expect(component.form.controls.price.valid).toBe(false);
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.price.hasError('min')).toBe(true);
  });

  it('should invalidate form when price is empty/null', () => {
    (component.form.controls.price as any).setValue(null);
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.price.hasError('required')).toBe(true);
  });

  it('should submit valid updates to MenuStateService', async () => {
    component.form.controls.price.setValue(18.5);
    component.form.controls.isAvailable.setValue(false);

    await component.onSubmit();
    expect(mockState.updateItem).toHaveBeenCalledWith('ITEM-000100', {
      price: 18.5,
      isAvailable: false,
    });
  });

  it('should trigger closeEditModal when Escape key is pressed', () => {
    component.onEscape();
    expect(mockState.closeEditModal).toHaveBeenCalled();
  });
});
