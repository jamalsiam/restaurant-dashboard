import { TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';
import { describe, expect, it } from 'vitest';

describe('BadgeComponent', () => {
  it('renders category badge with proper category class', () => {
    const fixture = TestBed.createComponent(BadgeComponent);
    fixture.componentRef.setInput('category', 'Mains');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.shared-badge');
    expect(badge).toBeTruthy();
    expect(badge.classList.contains('cat-mains')).toBe(true);
  });

  it('renders availability status with status dot', () => {
    const fixture = TestBed.createComponent(BadgeComponent);
    fixture.componentRef.setInput('isAvailable', true);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.shared-badge');
    expect(badge.classList.contains('badge-status-in-stock')).toBe(true);
    expect(fixture.nativeElement.querySelector('.badge-dot')).toBeTruthy();
  });
});
