import { HttpParams } from '@angular/common/http';
import { QueryFilters } from '../models/menu.model';

/**
 * Builds HttpParams from QueryFilters, omitting null, undefined, or empty values.
 */
export function buildQueryParams(filters: Partial<QueryFilters>): HttpParams {
  let params = new HttpParams();

  if (filters.page !== undefined && filters.page !== null) {
    params = params.set('page', filters.page.toString());
  }
  if (filters.pageSize !== undefined && filters.pageSize !== null) {
    params = params.set('pageSize', filters.pageSize.toString());
  }
  if (filters.search && filters.search.trim()) {
    params = params.set('search', filters.search.trim());
  }
  if (filters.restaurantId) {
    params = params.set('restaurantId', filters.restaurantId);
  }
  if (filters.branchId) {
    params = params.set('branchId', filters.branchId);
  }
  if (filters.category) {
    params = params.set('category', filters.category);
  }
  if (filters.availability && filters.availability !== 'all') {
    params = params.set('availability', filters.availability);
  }
  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    params = params.set('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    params = params.set('maxPrice', filters.maxPrice.toString());
  }
  if (filters.sortBy) {
    params = params.set('sortBy', filters.sortBy);
  }
  if (filters.sortOrder) {
    params = params.set('sortOrder', filters.sortOrder);
  }

  return params;
}
