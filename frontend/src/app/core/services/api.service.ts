import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardStats,
  MenuItem,
  PaginatedResult,
  QueryFilters,
  UpdateItemPayload,
} from '../models/menu.model';
import { buildQueryParams } from '../helpers/query.helper';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getItems(filters: Partial<QueryFilters>): Observable<PaginatedResult<MenuItem>> {
    const params = buildQueryParams(filters);
    return this.http.get<PaginatedResult<MenuItem>>(`${this.baseUrl}/items`, { params });
  }

  getItem(id: string): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.baseUrl}/items/${id}`);
  }

  patchItem(id: string, payload: UpdateItemPayload): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.baseUrl}/items/${id}`, payload);
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  getHealth(): Observable<{ status: string; datasetItemsCount: number }> {
    return this.http.get<{ status: string; datasetItemsCount: number }>(`${this.baseUrl}/health`);
  }
}
