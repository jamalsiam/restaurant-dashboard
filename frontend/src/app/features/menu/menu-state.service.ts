import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MenuStateService {
  items = signal<any[]>([]);
  loading = signal(false);
}
