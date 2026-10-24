import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { describe, expect, it } from 'vitest';

describe('CardComponent', () => {
  it('renders card title, subtitle, and body properly', () => {
    const fixture = TestBed.createComponent(CardComponent);
    fixture.componentRef.setInput('title', 'Architecture Card');
    fixture.componentRef.setInput('subtitle', 'Test Subtitle');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-title')?.textContent).toContain('Architecture Card');
    expect(compiled.querySelector('.card-subtitle')?.textContent).toContain('Test Subtitle');
    expect(compiled.querySelector('.shared-card')?.classList.contains('glass-panel')).toBe(true);
  });
});
