import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'restodata_theme_preference';

  readonly theme = signal<AppTheme>('light');
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem(this.storageKey) as AppTheme | null;
        if (savedTheme === 'light' || savedTheme === 'dark') {
          this.theme.set(savedTheme);
        } else {
          this.theme.set('light');
        }
      } catch {
        this.theme.set('light');
      }

      this.applyTheme(this.theme());

      effect(() => {
        const current = this.theme();
        this.applyTheme(current);
        try {
          localStorage.setItem(this.storageKey, current);
        } catch {
          // ignore storage quota / sandbox exceptions
        }
      });
    }
  }

  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(newTheme: AppTheme): void {
    this.theme.set(newTheme);
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: AppTheme): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.body?.setAttribute('data-theme', theme);
    }
  }
}
