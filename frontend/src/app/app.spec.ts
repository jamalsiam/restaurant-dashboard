import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { DashboardStateService } from './features/dashboard/dashboard-state.service';
import { signal } from '@angular/core';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('App', () => {
  beforeEach(async () => {
    const mockDashboardState = {
      stats: signal({
        totalItems: 50000,
        availableItems: 42000,
        unavailableItems: 8000,
        averagePrice: 24.5,
        categoryDistribution: {} as any,
        restaurants: [],
        lastCalculatedAt: new Date().toISOString(),
      }),
      loadStats: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: DashboardStateService, useValue: mockDashboardState },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render brand title in navigation bar', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-title')?.textContent).toContain(
      'RestoData Enterprise',
    );
  });
});
