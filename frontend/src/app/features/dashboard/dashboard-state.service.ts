import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardStateService {
  stats = signal<any>(null);
  loading = signal(false);
}
