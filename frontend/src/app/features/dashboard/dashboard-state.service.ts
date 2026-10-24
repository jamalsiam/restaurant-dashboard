import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats } from '../../core/models/menu.model';
import { catchError, finalize, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardStateService {
  private readonly apiService = inject(ApiService);

  readonly stats = signal<DashboardStats | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  loadStats(silent = false): void {
    if (!silent) {
      this.loading.set(true);
    }
    this.error.set(null);

    this.apiService
      .getStats()
      .pipe(
        catchError((err) => {
          this.error.set(err?.error?.message || 'Failed to load dashboard statistics');
          return of(null);
        }),
        finalize(() => {
          if (!silent) {
            this.loading.set(false);
          }
        }),
      )
      .subscribe((data) => {
        if (data) {
          this.stats.set(data);
        }
      });
  }

  refresh(): void {
    this.loadStats(true);
  }
}
