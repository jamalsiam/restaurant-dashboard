import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuStateService } from '../../menu-state.service';
import {
  ButtonComponent,
  SearchBoxComponent,
  SingleSelectComponent,
  InputComponent,
  SelectOption,
} from '../../../../shared/components';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    SearchBoxComponent,
    SingleSelectComponent,
    InputComponent,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  readonly state = inject(MenuStateService);

  readonly restaurantOptions = computed<SelectOption[]>(() => {
    const list = this.state.restaurants().map((r) => ({ value: r.id, label: r.name }));
    return [{ value: '', label: 'All Restaurants (10 Chains)' }, ...list];
  });

  readonly branchOptions = computed<SelectOption[]>(() => {
    const defaultLabel = this.state.restaurantId()
      ? 'All Branches for Chain'
      : 'Select Restaurant First';
    const list = this.state.availableBranches().map((b) => ({ value: b.id, label: b.name }));
    return [{ value: '', label: defaultLabel }, ...list];
  });

  readonly categoryOptions: SelectOption[] = [
    { value: '', label: 'All Categories' },
    { value: 'Mains', label: 'Mains' },
    { value: 'Appetizers', label: 'Appetizers' },
    { value: 'Desserts', label: 'Desserts' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Sides', label: 'Sides' },
  ];

  readonly availabilityOptions: SelectOption[] = [
    { value: 'all', label: 'All Availability' },
    { value: 'true', label: 'In Stock Only' },
    { value: 'false', label: 'Out of Stock Only' },
  ];

  onMinPriceChange(val: string | number | null): void {
    const num = val === '' || val === null ? null : Number(val);
    this.state.onPriceChangeDebounced(num, this.state.maxPrice());
  }

  onMaxPriceChange(val: string | number | null): void {
    const num = val === '' || val === null ? null : Number(val);
    this.state.onPriceChangeDebounced(this.state.minPrice(), num);
  }
}
